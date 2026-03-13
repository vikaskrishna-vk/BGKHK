const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  internship: { type: mongoose.Schema.Types.ObjectId, ref: 'Internship', required: true },
  mentor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  weekNumber: { type: Number, required: true, min: 1, max: 52 },
  reportType: {
    type: String,
    enum: ['weekly', 'final'],
    default: 'weekly',
  },
  dateRange: {
    from: { type: Date, required: true },
    to: { type: Date, required: true },
  },

  // Weekly report content
  tasksCompleted: { type: String, required: true },
  technologiesUsed: [{ type: String }],
  challengesFaced: String,
  skillsLearned: String,
  projectUpdates: String,
  mentorInteraction: String,
  hoursWorked: { type: Number, default: 0 },
  selfRating: { type: Number, min: 1, max: 10 },
  nextWeekPlan: String,
  supportNeeded: String,

  // Mentor review
  mentorFeedback: String,
  mentorRating: { type: Number, min: 1, max: 10 },
  mentorApprovalDate: Date,

  status: {
    type: String,
    enum: ['Draft', 'Submitted', 'Under Review', 'Approved', 'Rejected', 'Revision Required'],
    default: 'Draft',
  },

  // AI analysis
  aiAnalysis: {
    consistencyScore: Number,
    qualityScore: Number,
    suspicionFlags: [String],
    summary: String,
    analyzedAt: Date,
  },

  attachments: [{
    name: String,
    url: String,
    type: String,
  }],
}, {
  timestamps: true,
});

// Compound index for uniqueness per student per week per internship
reportSchema.index({ student: 1, internship: 1, weekNumber: 1 }, { unique: true });
reportSchema.index({ mentor: 1, status: 1 });
reportSchema.index({ internship: 1, weekNumber: 1 });

module.exports = mongoose.model('Report', reportSchema);
