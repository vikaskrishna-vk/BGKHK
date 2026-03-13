const { SkillRecord, TestResult } = require('../models/index');
const Internship = require('../models/Internship');
const Report = require('../models/Report');
const User = require('../models/User');

/**
 * AI Skill Rating Formula:
 * score = 0.4 * internship_performance + 0.3 * ai_test_results + 0.2 * mentor_feedback + 0.1 * project_score
 */
const calculateSkillScore = async (studentId) => {
  try {
    // 1. Internship Performance Score (40%)
    const internships = await Internship.find({ student: studentId, status: { $in: ['Active', 'Completed'] } });
    let internshipScore = 0;
    if (internships.length > 0) {
      const scores = internships.map(i => i.performance?.overallScore || i.progress || 0);
      internshipScore = scores.reduce((a, b) => a + b, 0) / scores.length;
    }

    // 2. AI Test Results Score (30%)
    const testResults = await TestResult.find({ student: studentId }).sort('-createdAt').limit(10);
    let aiTestScore = 0;
    if (testResults.length > 0) {
      aiTestScore = testResults.reduce((sum, t) => sum + (t.percentage || 0), 0) / testResults.length;
    }

    // 3. Mentor Feedback Score (20%)
    const reports = await Report.find({ student: studentId, mentorRating: { $exists: true, $ne: null } });
    let mentorScore = 0;
    if (reports.length > 0) {
      const avgRating = reports.reduce((sum, r) => sum + (r.mentorRating || 0), 0) / reports.length;
      mentorScore = (avgRating / 10) * 100; // Convert 1-10 to 0-100
    }

    // 4. Project Score (10%) — based on completed reports & certificates
    const { Certificate } = require('../models/index');
    const certCount = await Certificate.countDocuments({ student: studentId, verificationStatus: 'Mentor Approved' });
    const completedInternships = internships.filter(i => i.status === 'Completed').length;
    const projectScore = Math.min((certCount * 20 + completedInternships * 30), 100);

    // Composite Score
    const overall = Math.round(
      0.4 * internshipScore +
      0.3 * aiTestScore +
      0.2 * mentorScore +
      0.1 * projectScore
    );

    // Placement Readiness (consider more factors)
    const placementReadiness = Math.min(Math.round(
      overall * 0.7 +
      Math.min(testResults.length * 5, 20) + // bonus for taking tests
      Math.min(certCount * 5, 10)             // bonus for certificates
    ), 100);

    const skillRecord = await SkillRecord.findOneAndUpdate(
      { student: studentId },
      {
        compositeScore: {
          overall,
          internshipPerformance: Math.round(internshipScore),
          aiTestResults: Math.round(aiTestScore),
          mentorFeedback: Math.round(mentorScore),
          projectScore: Math.round(projectScore),
        },
        placementReadiness,
        lastCalculated: new Date(),
      },
      { new: true, upsert: true }
    );

    // Update user's placement readiness
    await User.findByIdAndUpdate(studentId, {
      'studentProfile.placementReadiness': placementReadiness,
      'studentProfile.skillRatingScore': overall,
    });

    return { overall, internshipScore, aiTestScore, mentorScore, projectScore, placementReadiness };
  } catch (error) {
    console.error('Skill score calculation error:', error);
    throw error;
  }
};

module.exports = { calculateSkillScore };
