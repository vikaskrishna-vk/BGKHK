const mongoose = require('mongoose');

const internshipSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  mentor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  company: {
    name: { type: String, required: true, trim: true },
    website: String,
    location: String,
    industry: String,
    mentorEmail: { type: String, required: true },
    mentorName: String,
    mentorPhone: String,
  },
  role: { type: String, required: true, trim: true },
  domain: {
    type: String,
    required: true,
    enum: ['Frontend Development', 'Backend Development', 'Full Stack Development',
      'Data Science', 'Machine Learning', 'DevOps', 'Mobile Development',
      'UI/UX Design', 'Cybersecurity', 'Cloud Computing', 'Other'],
  },
  description: String,
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  durationWeeks: Number,
  stipend: {
    amount: { type: Number, default: 0 },
    currency: { type: String, default: 'INR' },
  },
  mode: {
    type: String,
    enum: ['Remote', 'On-site', 'Hybrid'],
    default: 'Remote',
  },
  status: {
    type: String,
    enum: ['Pending Approval', 'Active', 'Completed', 'Rejected', 'Flagged'],
    default: 'Pending Approval',
  },
  verificationStatus: {
    type: String,
    enum: ['Unverified', 'Mentor Verified', 'Admin Verified', 'Fake Detected'],
    default: 'Unverified',
  },
  progress: { type: Number, default: 0, min: 0, max: 100 },
  performance: {
    technicalScore: { type: Number, default: 0 },
    communicationScore: { type: Number, default: 0 },
    punctualityScore: { type: Number, default: 0 },
    overallScore: { type: Number, default: 0 },
  },
  // Fake detection flags
  verificationFlags: {
    mentorEmailVerified: { type: Boolean, default: false },
    certificateValidated: { type: Boolean, default: false },
    reportConsistency: { type: Number, default: 100 },
    suspicionScore: { type: Number, default: 0 },
    flagReason: String,
  },
  certificate: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Certificate',
  },
  adminNotes: String,
  rejectionReason: String,
  completedAt: Date,
}, {
  timestamps: true,
  toJSON: { virtuals: true },
});

// Virtual: total reports
internshipSchema.virtual('reports', {
  ref: 'Report',
  localField: '_id',
  foreignField: 'internship',
});

// Calculate duration in weeks
internshipSchema.pre('save', function (next) {
  if (this.startDate && this.endDate) {
    const diff = (this.endDate - this.startDate) / (1000 * 60 * 60 * 24 * 7);
    this.durationWeeks = Math.ceil(diff);
  }
  next();
});

internshipSchema.index({ student: 1 });
internshipSchema.index({ mentor: 1 });
internshipSchema.index({ status: 1 });
internshipSchema.index({ 'company.mentorEmail': 1 });

module.exports = mongoose.model('Internship', internshipSchema);
