const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const { SkillRecord, Notification } = require('../models/index');
const { sendEmail } = require('../services/emailService');

// ─── Generate JWT ──────────────────────────────────────────────────────────────
const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });

// ─── REGISTER ─────────────────────────────────────────────────────────────────
const register = async (req, res, next) => {
  try {
    const { name, email, password, role, college, department, year, phone } = req.body;

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Email already registered' });
    }

    const user = await User.create({
      name, email, password, role: role || 'student',
      college, department, year, phone,
    });

    // Initialize skill record for students
    if (user.role === 'student') {
      await SkillRecord.create({ student: user._id });
    }

    // Welcome notification
    await Notification.create({
      recipient: user._id,
      type: 'system',
      title: 'Welcome to InternAI! 🎉',
      message: `Hi ${name}, your account has been created successfully. Start by completing your profile and adding your first internship!`,
    });

    const token = generateToken(user._id);
    const userObj = user.toObject();
    delete userObj.password;

    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      token,
      user: userObj,
    });
  } catch (error) {
    next(error);
  }
};

// ─── LOGIN ────────────────────────────────────────────────────────────────────
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
    if (!user.isActive) {
      return res.status(401).json({ success: false, message: 'Account deactivated. Contact admin.' });
    }

    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    const token = generateToken(user._id);
    const userObj = user.toObject();
    delete userObj.password;

    res.json({ success: true, message: 'Login successful', token, user: userObj });
  } catch (error) {
    next(error);
  }
};

// ─── GET PROFILE ──────────────────────────────────────────────────────────────
const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('studentProfile.assignedMentor', 'name email mentorProfile')
      .select('-password');
    res.json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

// ─── UPDATE PROFILE ───────────────────────────────────────────────────────────
const updateProfile = async (req, res, next) => {
  try {
    const { name, phone, bio, college, department, year, studentProfile, mentorProfile } = req.body;

    const updateData = { name, phone, bio, college, department, year };
    if (req.user.role === 'student' && studentProfile) {
      updateData.studentProfile = { ...req.user.studentProfile?.toObject(), ...studentProfile };
    }
    if (req.user.role === 'mentor' && mentorProfile) {
      updateData.mentorProfile = { ...req.user.mentorProfile?.toObject(), ...mentorProfile };
    }

    const user = await User.findByIdAndUpdate(req.user._id, updateData, { new: true, runValidators: true })
      .select('-password');

    res.json({ success: true, message: 'Profile updated', user });
  } catch (error) {
    next(error);
  }
};

// ─── CHANGE PASSWORD ──────────────────────────────────────────────────────────
const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id).select('+password');
    if (!(await user.comparePassword(currentPassword))) {
      return res.status(400).json({ success: false, message: 'Current password is incorrect' });
    }
    user.password = newPassword;
    await user.save();
    res.json({ success: true, message: 'Password changed successfully' });
  } catch (error) {
    next(error);
  }
};

// ─── UPLOAD PROFILE PHOTO ─────────────────────────────────────────────────────
const uploadProfilePhoto = async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { profilePhoto: req.file.path },
      { new: true }
    ).select('-password');
    res.json({ success: true, message: 'Profile photo updated', user });
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login, getProfile, updateProfile, changePassword, uploadProfilePhoto };
