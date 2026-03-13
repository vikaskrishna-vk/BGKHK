const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const userSchema = new mongoose.Schema(
{
  name: {
    type: String,
    required: [true, "Name is required"],
    trim: true,
    maxlength: 100,
  },

  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, "Please enter a valid email"],
  },

  // Optional login ID for mentors/admin
  userId: {
    type: String,
    unique: true,
    sparse: true
  },

  password: {
    type: String,
    required: [true, "Password required"],
    minlength: 6,
    select: false,
  },

  role: {
    type: String,
    enum: ["student", "mentor", "admin"],
    default: "student",
  },

  profilePhoto: {
    type: String,
    default: "",
  },

  phone: String,
  college: String,
  department: String,
  year: { type: Number, min: 1, max: 5 },

  bio: {
    type: String,
    maxlength: 500,
  },

  // ───── Student Profile ─────
  studentProfile: {
    rollNumber: String,
    course: String,
    skills: [{ type: String }],
    selectedDomains: [{ type: String }],
    linkedIn: String,
    github: String,
    portfolio: String,
    careerGoal: String,

    placementReadiness: {
      type: Number,
      default: 0,
    },

    skillRatingScore: {
      type: Number,
      default: 0,
    },

    assignedMentor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },

  // ───── Mentor Profile ─────
  mentorProfile: {
    expertise: [{ type: String }],
    experience: Number,
    company: String,
    designation: String,
    linkedIn: String,

    maxStudents: {
      type: Number,
      default: 10,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },
  },

  // ───── Admin Profile ─────
  adminProfile: {
    institution: String,
    position: String,
    accessLevel: {
      type: String,
      enum: ["super", "regular"],
      default: "regular",
    },
  },

  isActive: {
    type: Boolean,
    default: true,
  },

  isEmailVerified: {
    type: Boolean,
    default: false,
  },

  emailVerificationToken: String,
  passwordResetToken: String,
  passwordResetExpires: Date,

  passwordChangedAt: Date,
  lastLogin: Date,

  notificationPreferences: {
    email: { type: Boolean, default: true },
    inApp: { type: Boolean, default: true },
  },

},
{
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
}
);



// ─── INDEXES ───────────────────────────
userSchema.index({ email: 1 });
userSchema.index({ userId: 1 });
userSchema.index({ role: 1 });
userSchema.index({ "studentProfile.assignedMentor": 1 });



// ─── HASH PASSWORD BEFORE SAVE ─────────
userSchema.pre("save", async function (next) {

  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password, 12);

  next();
});



// ─── PASSWORD COMPARE ──────────────────
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};



// ─── GENERATE PASSWORD RESET TOKEN ─────
userSchema.methods.createPasswordResetToken = function () {

  const resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};



// ─── VIRTUAL: INTERNSHIPS ──────────────
userSchema.virtual("internships", {
  ref: "Internship",
  localField: "_id",
  foreignField: "student",
});



module.exports = mongoose.model("User", userSchema);