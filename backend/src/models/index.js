const mongoose = require('mongoose');

// ─── CERTIFICATE ──────────────────────────────────────────────────────────────
const certificateSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  internship: { type: mongoose.Schema.Types.ObjectId, ref: 'Internship' },
  mentor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  title: { type: String, required: true },
  issuingOrganization: { type: String, required: true },
  issueDate: Date,
  expiryDate: Date,
  credentialId: String,
  credentialUrl: String,
  fileUrl: { type: String, required: true },
  filePublicId: String,
  type: {
    type: String,
    enum: ['Internship', 'Course', 'Skill', 'Achievement'],
    default: 'Internship',
  },
  verificationStatus: {
    type: String,
    enum: ['Pending', 'AI Verified', 'Mentor Approved', 'Admin Approved', 'Rejected'],
    default: 'Pending',
  },
  aiVerification: {
    isAuthentic: Boolean,
    confidence: Number,
    extractedData: mongoose.Schema.Types.Mixed,
    verifiedAt: Date,
  },
  mentorApproval: {
    approvedAt: Date,
    notes: String,
  },
  rejectionReason: String,
}, { timestamps: true });

certificateSchema.index({ student: 1 });
certificateSchema.index({ internship: 1 });

// ─── TEST ─────────────────────────────────────────────────────────────────────
const testResultSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  testType: {
    type: String,
    enum: ['Quantitative', 'Logical', 'Verbal', 'Technical', 'Coding'],
    required: true,
  },
  domain: String,
  score: { type: Number, required: true },
  totalQuestions: { type: Number, required: true },
  correctAnswers: { type: Number, required: true },
  timeTaken: Number, // seconds
  percentage: Number,
  answers: [{
    questionId: String,
    selectedAnswer: Number,
    correctAnswer: Number,
    isCorrect: Boolean,
    timeSpent: Number,
  }],
  aiEvaluation: {
    strengths: [String],
    weaknesses: [String],
    suggestions: [String],
  },
  attemptNumber: { type: Number, default: 1 },
}, { timestamps: true });

testResultSchema.index({ student: 1, testType: 1 });

// ─── SKILL ────────────────────────────────────────────────────────────────────
const skillRecordSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  skills: [{
    name: String,
    level: { type: Number, min: 0, max: 100, default: 0 },
    endorsements: Number,
    lastUpdated: Date,
    verified: { type: Boolean, default: false },
  }],
  compositeScore: {
    overall: { type: Number, default: 0 },
    internshipPerformance: { type: Number, default: 0 }, // 40%
    aiTestResults: { type: Number, default: 0 },          // 30%
    mentorFeedback: { type: Number, default: 0 },         // 20%
    projectScore: { type: Number, default: 0 },           // 10%
  },
  placementReadiness: { type: Number, default: 0 },
  domainExpertise: [{
    domain: String,
    level: String,
    score: Number,
  }],
  lastCalculated: Date,
}, { timestamps: true });

skillRecordSchema.index({ student: 1 });

// ─── NOTIFICATION ─────────────────────────────────────────────────────────────
const notificationSchema = new mongoose.Schema({
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  type: {
    type: String,
    enum: [
      'report_submitted', 'report_approved', 'report_rejected',
      'certificate_uploaded', 'certificate_verified', 'certificate_rejected',
      'internship_approved', 'internship_rejected', 'internship_completed',
      'mentor_feedback', 'ai_analysis_complete', 'placement_update',
      'system', 'reminder',
    ],
    required: true,
  },
  title: { type: String, required: true },
  message: { type: String, required: true },
  link: String,
  isRead: { type: Boolean, default: false },
  readAt: Date,
  metadata: mongoose.Schema.Types.Mixed,
}, { timestamps: true });

notificationSchema.index({ recipient: 1, isRead: 1 });
notificationSchema.index({ createdAt: -1 });

// ─── STUDY MATERIAL ───────────────────────────────────────────────────────────
const studyMaterialSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  domain: {
    type: String,
    enum: ['All', 'Frontend Development', 'Backend Development', 'Full Stack Development',
      'Data Science', 'Machine Learning', 'DevOps', 'Mobile Development',
      'UI/UX Design', 'Cybersecurity', 'Cloud Computing', 'Aptitude', 'Communication'],
  },
  type: {
    type: String,
    enum: ['Video', 'Article', 'PDF', 'Course', 'Practice', 'Quiz', 'Guide'],
  },
  level: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
  },
  url: String,
  fileUrl: String,
  duration: String,
  tags: [String],
  icon: { type: String, default: '📚' },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  isPublished: { type: Boolean, default: true },
  views: { type: Number, default: 0 },
  likes: { type: Number, default: 0 },
}, { timestamps: true });

studyMaterialSchema.index({ domain: 1, type: 1 });

module.exports = {
  Certificate: mongoose.model('Certificate', certificateSchema),
  TestResult: mongoose.model('TestResult', testResultSchema),
  SkillRecord: mongoose.model('SkillRecord', skillRecordSchema),
  Notification: mongoose.model('Notification', notificationSchema),
  StudyMaterial: mongoose.model('StudyMaterial', studyMaterialSchema),
};
