const express = require('express');
const { protect, authorize } = require('../middleware/authMiddleware');
const { uploadCert } = require('../config/cloudinary');
const {
  uploadCertificate, getMyCertificates, verifyCertificate,
  getMySkillRecord, updateSkills, recalculateScore,
  getMyNotifications, markAsRead, sendBulkNotification,
  submitTestResult, getMyTestResults,
  getStudyMaterials, createStudyMaterial,
  getAdminAnalytics, getStudentAnalytics,
} = require('../controllers/controllers');
const { chat, resumeAnalyze, mockInterview, careerRoadmap, skillGap } = require('../controllers/aiController');
// ─── CERTIFICATE ROUTES ───────────────────────────────────────────────────────
const certRouter = express.Router();
certRouter.post('/', protect, authorize('student'), uploadCert.single('certificate'), uploadCertificate);
certRouter.get('/my', protect, authorize('student'), getMyCertificates);
certRouter.patch('/:id/verify', protect, authorize('mentor', 'admin'), verifyCertificate);
module.exports.certificateRoutes = certRouter;

// ─── AI ROUTES ────────────────────────────────────────────────────────────────
const aiRouter = express.Router();
aiRouter.post('/chat', protect, chat);
aiRouter.post('/resume', protect, resumeAnalyze);
aiRouter.post('/interview', protect, mockInterview);
aiRouter.post('/roadmap', protect, careerRoadmap);
aiRouter.post('/skill-gap', protect, skillGap);
module.exports.aiRoutes = aiRouter;

// ─── TEST ROUTES ──────────────────────────────────────────────────────────────
const testRouter = express.Router();
testRouter.post('/submit', protect, authorize('student'), submitTestResult);
testRouter.get('/my', protect, authorize('student'), getMyTestResults);
module.exports.testRoutes = testRouter;

// ─── NOTIFICATION ROUTES ──────────────────────────────────────────────────────
const notifRouter = express.Router();
notifRouter.get('/', protect, getMyNotifications);
notifRouter.patch('/read-all', protect, markAsRead);
notifRouter.post('/bulk', protect, authorize('admin'), sendBulkNotification);
module.exports.notificationRoutes = notifRouter;

// ─── SKILL ROUTES ─────────────────────────────────────────────────────────────
const skillRouter = express.Router();
skillRouter.get('/my', protect, authorize('student'), getMySkillRecord);
skillRouter.put('/my', protect, authorize('student'), updateSkills);
skillRouter.post('/recalculate', protect, authorize('student'), recalculateScore);
module.exports.skillRoutes = skillRouter;

// ─── STUDY ROUTES ─────────────────────────────────────────────────────────────
const studyRouter = express.Router();
studyRouter.get('/', protect, getStudyMaterials);
studyRouter.post('/', protect, authorize('admin'), createStudyMaterial);
module.exports.studyRoutes = studyRouter;

// ─── ANALYTICS ROUTES ─────────────────────────────────────────────────────────
const analyticsRouter = express.Router();
analyticsRouter.get('/admin', protect, authorize('admin'), getAdminAnalytics);
analyticsRouter.get('/student', protect, authorize('student'), getStudentAnalytics);
module.exports.analyticsRoutes = analyticsRouter;
