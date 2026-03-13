const Report = require('../models/Report');
const Internship = require('../models/Internship');
const { Notification } = require('../models/index');
const { analyzeReport } = require('../services/aiService');

// ─── SUBMIT WEEKLY REPORT ─────────────────────────────────────────────────────
const submitReport = async (req, res, next) => {
  try {
    const {
      internshipId, weekNumber, dateRange, tasksCompleted,
      technologiesUsed, challengesFaced, skillsLearned,
      projectUpdates, mentorInteraction, hoursWorked,
      selfRating, nextWeekPlan, supportNeeded,
    } = req.body;

    // Verify internship belongs to student
    const internship = await Internship.findOne({ _id: internshipId, student: req.user._id });
    if (!internship) return res.status(404).json({ success: false, message: 'Internship not found' });

    // Check duplicate
    const existing = await Report.findOne({ student: req.user._id, internship: internshipId, weekNumber });
    if (existing) return res.status(400).json({ success: false, message: `Week ${weekNumber} report already submitted` });

    const report = await Report.create({
      student: req.user._id,
      internship: internshipId,
      mentor: internship.mentor,
      weekNumber, dateRange, tasksCompleted,
      technologiesUsed, challengesFaced, skillsLearned,
      projectUpdates, mentorInteraction, hoursWorked,
      selfRating, nextWeekPlan, supportNeeded,
      status: 'Submitted',
    });

    // Background AI analysis
    analyzeReport(report._id).catch(console.error);

    // Update internship progress
    const totalReports = await Report.countDocuments({ internship: internshipId });
    const progress = Math.min(Math.round((totalReports / internship.durationWeeks) * 100), 95);
    await Internship.findByIdAndUpdate(internshipId, { progress });

    // Notify mentor
    if (internship.mentor) {
      const io = req.app.get('io');
      const notification = await Notification.create({
        recipient: internship.mentor,
        sender: req.user._id,
        type: 'report_submitted',
        title: 'New Weekly Report Submitted',
        message: `${req.user.name} submitted Week ${weekNumber} report for their internship at ${internship.company.name}.`,
        link: `/mentor/reports/${report._id}`,
        metadata: { reportId: report._id, weekNumber },
      });
      io?.to(`user_${internship.mentor}`).emit('notification', notification);
    }

    res.status(201).json({ success: true, message: 'Report submitted successfully', report });
  } catch (error) {
    next(error);
  }
};

// ─── GET MY REPORTS ───────────────────────────────────────────────────────────
const getMyReports = async (req, res, next) => {
  try {
    const { internshipId } = req.query;
    const query = { student: req.user._id };
    if (internshipId) query.internship = internshipId;

    const reports = await Report.find(query)
      .populate('internship', 'company role')
      .sort({ weekNumber: 1 });
    res.json({ success: true, reports });
  } catch (error) {
    next(error);
  }
};

// ─── GET REPORT BY ID ─────────────────────────────────────────────────────────
const getReport = async (req, res, next) => {
  try {
    const report = await Report.findById(req.params.id)
      .populate('student', 'name email profilePhoto')
      .populate('internship', 'company role domain')
      .populate('mentor', 'name email');

    if (!report) return res.status(404).json({ success: false, message: 'Report not found' });

    const isOwner = report.student._id.toString() === req.user._id.toString();
    const isMentor = report.mentor?._id.toString() === req.user._id.toString();
    if (!isOwner && !isMentor && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    res.json({ success: true, report });
  } catch (error) {
    next(error);
  }
};

// ─── MENTOR REVIEW REPORT ─────────────────────────────────────────────────────
const reviewReport = async (req, res, next) => {
  try {
    const { status, mentorFeedback, mentorRating } = req.body;
    const report = await Report.findById(req.params.id).populate('student internship');

    if (!report) return res.status(404).json({ success: false, message: 'Not found' });
    if (report.mentor?.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    report.status = status;
    report.mentorFeedback = mentorFeedback;
    report.mentorRating = mentorRating;
    report.mentorApprovalDate = new Date();
    await report.save();

    // Notify student
    const io = req.app.get('io');
    const notification = await Notification.create({
      recipient: report.student._id,
      sender: req.user._id,
      type: status === 'Approved' ? 'report_approved' : 'report_rejected',
      title: `Week ${report.weekNumber} Report ${status}`,
      message: mentorFeedback || `Your Week ${report.weekNumber} report has been ${status.toLowerCase()}.`,
      link: `/student/reports/${report._id}`,
    });
    io?.to(`user_${report.student._id}`).emit('notification', notification);

    res.json({ success: true, message: `Report ${status}`, report });
  } catch (error) {
    next(error);
  }
};

// ─── GET REPORTS FOR MENTOR ───────────────────────────────────────────────────
const getMentorReports = async (req, res, next) => {
  try {
    const { status, internshipId } = req.query;
    const query = { mentor: req.user._id };
    if (status) query.status = status;
    if (internshipId) query.internship = internshipId;

    const reports = await Report.find(query)
      .populate('student', 'name email profilePhoto')
      .populate('internship', 'company role')
      .sort('-createdAt');
    res.json({ success: true, reports });
  } catch (error) {
    next(error);
  }
};

// ─── GENERATE FINAL REPORT ────────────────────────────────────────────────────
const generateFinalReport = async (req, res, next) => {
  try {
    const { internshipId } = req.params;
    const internship = await Internship.findOne({
      _id: internshipId, student: req.user._id,
    }).populate('mentor', 'name email');

    if (!internship) return res.status(404).json({ success: false, message: 'Internship not found' });

    const weeklyReports = await Report.find({
      internship: internshipId,
      status: 'Approved',
    }).sort({ weekNumber: 1 });

    if (weeklyReports.length === 0) {
      return res.status(400).json({ success: false, message: 'No approved weekly reports found' });
    }

    // Compile final report data
    const allTasks = weeklyReports.map(r => `Week ${r.weekNumber}: ${r.tasksCompleted}`).join('\n\n');
    const allSkills = [...new Set(weeklyReports.flatMap(r => r.technologiesUsed || []))];
    const allChallenges = weeklyReports.filter(r => r.challengesFaced).map(r => `Week ${r.weekNumber}: ${r.challengesFaced}`);
    const totalHours = weeklyReports.reduce((sum, r) => sum + (r.hoursWorked || 0), 0);
    const avgSelfRating = (weeklyReports.reduce((s, r) => s + (r.selfRating || 0), 0) / weeklyReports.length).toFixed(1);
    const avgMentorRating = (weeklyReports.filter(r => r.mentorRating).reduce((s, r) => s + r.mentorRating, 0) / weeklyReports.filter(r => r.mentorRating).length || 0).toFixed(1);

    const finalReport = {
      internship: {
        company: internship.company.name,
        role: internship.role,
        domain: internship.domain,
        startDate: internship.startDate,
        endDate: internship.endDate,
        duration: `${internship.durationWeeks} weeks`,
        mentor: internship.mentor?.name,
      },
      student: req.user.name,
      generatedAt: new Date(),
      summary: {
        totalWeeks: weeklyReports.length,
        totalHours,
        avgSelfRating: Number(avgSelfRating),
        avgMentorRating: Number(avgMentorRating),
      },
      technologiesUsed: allSkills,
      tasksTimeline: allTasks,
      challengesOvercome: allChallenges,
      weeklyBreakdown: weeklyReports.map(r => ({
        week: r.weekNumber,
        tasks: r.tasksCompleted,
        skills: r.skillsLearned,
        hours: r.hoursWorked,
        selfRating: r.selfRating,
        mentorRating: r.mentorRating,
        mentorFeedback: r.mentorFeedback,
      })),
    };

    // Save as final report in DB
    const savedFinal = await Report.create({
      student: req.user._id,
      internship: internshipId,
      mentor: internship.mentor?._id,
      weekNumber: 0, // 0 = final
      reportType: 'final',
      dateRange: { from: internship.startDate, to: internship.endDate },
      tasksCompleted: allTasks,
      technologiesUsed: allSkills,
      challengesFaced: allChallenges.join('\n'),
      hoursWorked: totalHours,
      selfRating: Number(avgSelfRating),
      status: 'Submitted',
    });

    res.json({ success: true, message: 'Final report generated', finalReport, reportId: savedFinal._id });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  submitReport, getMyReports, getReport, reviewReport,
  getMentorReports, generateFinalReport,
};
