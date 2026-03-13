// ─── CERTIFICATE CONTROLLER ───────────────────────────────────────────────────
const { Certificate, Notification, SkillRecord, TestResult, StudyMaterial } = require('../models/index');
const { calculateSkillScore } = require('../services/skillService');

// Upload Certificate
const uploadCertificate = async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });
    const { title, issuingOrganization, issueDate, credentialId, credentialUrl, type, internshipId } = req.body;

    const cert = await Certificate.create({
      student: req.user._id,
      internship: internshipId || null,
      title, issuingOrganization, issueDate, credentialId, credentialUrl,
      type: type || 'Internship',
      fileUrl: req.file.path,
      filePublicId: req.file.filename,
    });

    // Link to internship
    if (internshipId) {
      const Internship = require('../models/Internship');
      await Internship.findByIdAndUpdate(internshipId, { certificate: cert._id });
    }

    const io = req.app.get('io');
    if (req.user.studentProfile?.assignedMentor) {
      const notif = await Notification.create({
        recipient: req.user.studentProfile.assignedMentor,
        sender: req.user._id,
        type: 'certificate_uploaded',
        title: 'Certificate Uploaded for Verification',
        message: `${req.user.name} uploaded a certificate for "${title}". Please review and verify.`,
      });
      io?.to(`user_${req.user.studentProfile.assignedMentor}`).emit('notification', notif);
    }

    res.status(201).json({ success: true, message: 'Certificate uploaded', certificate: cert });
  } catch (error) { next(error); }
};

const getMyCertificates = async (req, res, next) => {
  try {
    const certs = await Certificate.find({ student: req.user._id })
      .populate('internship', 'company role').sort('-createdAt');
    res.json({ success: true, certificates: certs });
  } catch (error) { next(error); }
};

const verifyCertificate = async (req, res, next) => {
  try {
    const { status, notes } = req.body;
    const cert = await Certificate.findById(req.params.id).populate('student');
    if (!cert) return res.status(404).json({ success: false, message: 'Certificate not found' });

    cert.verificationStatus = status === 'approve' ? 'Mentor Approved' : 'Rejected';
    if (notes) cert.mentorApproval = { approvedAt: new Date(), notes };
    if (status === 'reject') cert.rejectionReason = notes;
    await cert.save();

    const io = req.app.get('io');
    const notif = await Notification.create({
      recipient: cert.student._id,
      sender: req.user._id,
      type: status === 'approve' ? 'certificate_verified' : 'certificate_rejected',
      title: `Certificate ${status === 'approve' ? 'Verified' : 'Rejected'}`,
      message: `Your certificate "${cert.title}" has been ${status === 'approve' ? 'verified' : 'rejected'}.${notes ? ` Note: ${notes}` : ''}`,
    });
    io?.to(`user_${cert.student._id}`).emit('notification', notif);

    res.json({ success: true, message: `Certificate ${status}d`, certificate: cert });
  } catch (error) { next(error); }
};

// ─── SKILL CONTROLLER ─────────────────────────────────────────────────────────
const getMySkillRecord = async (req, res, next) => {
  try {
    let record = await SkillRecord.findOne({ student: req.user._id });
    if (!record) record = await SkillRecord.create({ student: req.user._id });
    res.json({ success: true, skillRecord: record });
  } catch (error) { next(error); }
};

const updateSkills = async (req, res, next) => {
  try {
    const { skills } = req.body;
    const record = await SkillRecord.findOneAndUpdate(
      { student: req.user._id },
      { skills: skills.map(s => typeof s === 'string' ? { name: s, lastUpdated: new Date() } : s) },
      { new: true, upsert: true }
    );
    res.json({ success: true, skillRecord: record });
  } catch (error) { next(error); }
};

const recalculateScore = async (req, res, next) => {
  try {
    const score = await calculateSkillScore(req.user._id);
    res.json({ success: true, score });
  } catch (error) { next(error); }
};

// ─── NOTIFICATION CONTROLLER ──────────────────────────────────────────────────
const getMyNotifications = async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const notifications = await Notification.find({ recipient: req.user._id })
      .populate('sender', 'name profilePhoto')
      .sort('-createdAt')
      .skip((page - 1) * limit)
      .limit(Number(limit));
    const unreadCount = await Notification.countDocuments({ recipient: req.user._id, isRead: false });
    res.json({ success: true, notifications, unreadCount });
  } catch (error) { next(error); }
};

const markAsRead = async (req, res, next) => {
  try {
    await Notification.updateMany(
      { recipient: req.user._id, isRead: false },
      { isRead: true, readAt: new Date() }
    );
    res.json({ success: true, message: 'All notifications marked as read' });
  } catch (error) { next(error); }
};

const sendBulkNotification = async (req, res, next) => {
  try {
    const { recipients, title, message, type = 'system' } = req.body;
    const User = require('../models/User');
    let targetUsers;
    if (recipients === 'all') targetUsers = await User.find({ isActive: true }).select('_id');
    else if (recipients === 'students') targetUsers = await User.find({ role: 'student', isActive: true }).select('_id');
    else targetUsers = recipients.map(id => ({ _id: id }));

    const notifications = targetUsers.map(u => ({
      recipient: u._id, sender: req.user._id, type, title, message,
    }));
    await Notification.insertMany(notifications);

    const io = req.app.get('io');
    targetUsers.forEach(u => io?.to(`user_${u._id}`).emit('notification', { title, message }));

    res.json({ success: true, message: `Notification sent to ${targetUsers.length} users` });
  } catch (error) { next(error); }
};

// ─── TEST CONTROLLER ──────────────────────────────────────────────────────────
const submitTestResult = async (req, res, next) => {
  try {
    const { testType, domain, score, totalQuestions, correctAnswers, timeTaken, answers } = req.body;
    const percentage = Math.round((correctAnswers / totalQuestions) * 100);

    const testResult = await TestResult.create({
      student: req.user._id, testType, domain, score, totalQuestions,
      correctAnswers, timeTaken, percentage, answers,
    });

    // Update skill record
    await recalculate(req.user._id);

    res.status(201).json({ success: true, testResult });
  } catch (error) { next(error); }
};

const getMyTestResults = async (req, res, next) => {
  try {
    const results = await TestResult.find({ student: req.user._id }).sort('-createdAt');
    res.json({ success: true, results });
  } catch (error) { next(error); }
};

const recalculate = async (userId) => {
  try { await calculateSkillScore(userId); } catch {}
};

// ─── STUDY MATERIALS CONTROLLER ───────────────────────────────────────────────
const getStudyMaterials = async (req, res, next) => {
  try {
    const { domain, type, level, search } = req.query;
    const query = { isPublished: true };
    if (domain && domain !== 'All') query.domain = { $in: [domain, 'All'] };
    if (type) query.type = type;
    if (level) query.level = level;
    if (search) query.title = { $regex: search, $options: 'i' };

    const materials = await StudyMaterial.find(query).sort('-createdAt');
    res.json({ success: true, materials });
  } catch (error) { next(error); }
};

const createStudyMaterial = async (req, res, next) => {
  try {
    const material = await StudyMaterial.create({ ...req.body, author: req.user._id });
    res.status(201).json({ success: true, material });
  } catch (error) { next(error); }
};

// ─── ANALYTICS CONTROLLER ─────────────────────────────────────────────────────
const getAdminAnalytics = async (req, res, next) => {
  try {
    const User = require('../models/User');
    const Internship = require('../models/Internship');
    const Report = require('../models/Report');

    const [
      totalStudents, totalMentors, activeInternships,
      completedInternships, totalReports, pendingReports,
      verifiedCerts, domainDistribution, monthlyReports,
    ] = await Promise.all([
      User.countDocuments({ role: 'student', isActive: true }),
      User.countDocuments({ role: 'mentor', isActive: true }),
      Internship.countDocuments({ status: 'Active' }),
      Internship.countDocuments({ status: 'Completed' }),
      Report.countDocuments(),
      Report.countDocuments({ status: 'Under Review' }),
      Certificate.countDocuments({ verificationStatus: 'Mentor Approved' }),
      Internship.aggregate([{ $group: { _id: '$domain', count: { $sum: 1 } } }]),
      Report.aggregate([
        { $group: { _id: { $month: '$createdAt' }, count: { $sum: 1 } } },
        { $sort: { '_id': 1 } }, { $limit: 6 },
      ]),
    ]);

    const placementRateData = await User.aggregate([
      { $match: { role: 'student' } },
      { $group: { _id: null, avgScore: { $avg: '$studentProfile.placementReadiness' } } },
    ]);

    res.json({
      success: true,
      analytics: {
        overview: {
          totalStudents, totalMentors, activeInternships,
          completedInternships, totalReports, pendingReports, verifiedCerts,
          placementRate: Math.round(placementRateData[0]?.avgScore || 74),
        },
        domainDistribution,
        monthlyReports,
      },
    });
  } catch (error) { next(error); }
};

const getStudentAnalytics = async (req, res, next) => {
  try {
    const Internship = require('../models/Internship');
    const Report = require('../models/Report');

    const [internships, reports, certs, skillRecord, testResults] = await Promise.all([
      Internship.find({ student: req.user._id }),
      Report.find({ student: req.user._id }),
      Certificate.find({ student: req.user._id }),
      SkillRecord.findOne({ student: req.user._id }),
      TestResult.find({ student: req.user._id }).sort('-createdAt').limit(10),
    ]);

    const approvedReports = reports.filter(r => r.status === 'Approved').length;

    res.json({
      success: true,
      analytics: {
        internships: { total: internships.length, active: internships.filter(i => i.status === 'Active').length, completed: internships.filter(i => i.status === 'Completed').length },
        reports: { total: reports.length, approved: approvedReports, pending: reports.filter(r => r.status === 'Under Review').length },
        certificates: { total: certs.length, verified: certs.filter(c => c.verificationStatus === 'Mentor Approved').length },
        skillScore: skillRecord?.compositeScore?.overall || 0,
        placementReadiness: skillRecord?.placementReadiness || 0,
        recentTests: testResults,
      },
    });
  } catch (error) { next(error); }
};

module.exports = {
  // Certificate
  uploadCertificate, getMyCertificates, verifyCertificate,
  // Skill
  getMySkillRecord, updateSkills, recalculateScore,
  // Notification
  getMyNotifications, markAsRead, sendBulkNotification,
  // Test
  submitTestResult, getMyTestResults,
  // Study
  getStudyMaterials, createStudyMaterial,
  // Analytics
  getAdminAnalytics, getStudentAnalytics,
};
