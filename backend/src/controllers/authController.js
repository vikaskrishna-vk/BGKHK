const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { SkillRecord, Notification } = require("../models/index");

// ─── Built-in Accounts (Mentor/Admin) ─────────────────────
const builtInAccounts = [
  {
    name: "Faculty Mentor",
    email: "mentor@internai.com",
    password: "mentor123",
    role: "mentor",
  },
  {
    name: "Admin",
    email: "admin@internai.com",
    password: "admin123",
    role: "admin",
  },
];

// ─── Generate JWT ─────────────────────────────────────────
const generateToken = (id, role) =>
  jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });

// ─── REGISTER (Student Only) ──────────────────────────────
const register = async (req, res, next) => {
  try {
    const { name, email, password, college, department, year, phone } =
      req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password required",
      });
    }

    const existing = await User.findOne({ email });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Email already registered",
      });
    }

    const user = await User.create({
      name,
      email,
      password,
      role: "student",
      college,
      department,
      year,
      phone,
      isActive: true,
      isEmailVerified: true,
    });

    // Create skill record
    await SkillRecord.create({ student: user._id });

    // Welcome notification
    await Notification.create({
      recipient: user._id,
      type: "system",
      title: "Welcome to InternAI 🎉",
      message: `Hi ${name}, your account was created successfully!`,
    });

    const token = generateToken(user._id, user.role);

    const userObj = user.toObject();
    delete userObj.password;

    res.status(201).json({
      success: true,
      message: "Student account created",
      token,
      user: userObj,
    });
  } catch (error) {
    next(error);
  }
};

// ─── LOGIN ────────────────────────────────────────────────
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password required",
      });
    }

    // ─── Check Built-in Accounts
    const builtIn = builtInAccounts.find(
      (acc) => acc.email === email && acc.password === password,
    );

    if (builtIn) {
      const token = generateToken(builtIn.email, builtIn.role);

      return res.json({
        success: true,
        message: "Login successful",
        token,
        user: {
          name: builtIn.name,
          email: builtIn.email,
          role: builtIn.role,
        },
      });
    }

    // ─── Database User Login
    const user = await User.findOne({ email }).select("+password");

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Activate user if not active
    if (!user.isActive) {
      user.isActive = true;
    }

    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    const token = generateToken(user._id, user.role);

    const userObj = user.toObject();
    delete userObj.password;

    res.json({
      success: true,
      message: "Login successful",
      token,
      user: userObj,
    });
  } catch (error) {
    next(error);
  }
};

// ─── GET PROFILE ─────────────────────────────────────────
const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id)
      .populate("studentProfile.assignedMentor", "name email")
      .select("-password");

    res.json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};

// ─── UPDATE PROFILE ──────────────────────────────────────
const updateProfile = async (req, res, next) => {
  try {
    const { name, phone, bio, college, department, year } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, phone, bio, college, department, year },
      { new: true, runValidators: true },
    ).select("-password");

    res.json({
      success: true,
      message: "Profile updated",
      user,
    });
  } catch (error) {
    next(error);
  }
};

// ─── CHANGE PASSWORD ─────────────────────────────────────
const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id).select("+password");

    if (!(await user.comparePassword(currentPassword))) {
      return res.status(400).json({
        success: false,
        message: "Current password incorrect",
      });
    }

    user.password = newPassword;

    await user.save();

    res.json({
      success: true,
      message: "Password changed",
    });
  } catch (error) {
    next(error);
  }
};

// ─── UPLOAD PROFILE PHOTO ───────────────────────────────
const uploadProfilePhoto = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded",
      });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { profilePhoto: req.file.path },
      { new: true },
    ).select("-password");

    res.json({
      success: true,
      message: "Profile photo updated",
      user,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword,
  uploadProfilePhoto,
};
