const User = require('../models/User');
const { SkillRecord } = require('../models/index');

// Get all users (admin)
const getAllUsers = async (req, res, next) => {
  try {
    const { role, search, page = 1, limit = 20, isActive } = req.query;
    const query = {};
    if (role) query.role = role;
    if (isActive !== undefined) query.isActive = isActive === 'true';
    if (search) query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { college: { $regex: search, $options: 'i' } },
    ];
    const total = await User.countDocuments(query);
    const users = await User.find(query)
      .select('-password')
      .sort('-createdAt')
      .skip((page - 1) * limit)
      .limit(Number(limit));
    res.json({ success: true, total, page: Number(page), users });
  } catch (error) { next(error); }
};

// Get single user
const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password')
      .populate('studentProfile.assignedMentor', 'name email');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, user });
  } catch (error) { next(error); }
};

// Assign mentor to student (admin)
const assignMentor = async (req, res, next) => {
  try {
    const { studentId, mentorId } = req.body;
    const student = await User.findByIdAndUpdate(
      studentId,
      { 'studentProfile.assignedMentor': mentorId },
      { new: true }
    ).select('-password');
    if (!student) return res.status(404).json({ success: false, message: 'Student not found' });

    // Update all active internships
    const Internship = require('../models/Internship');
    await Internship.updateMany({ student: studentId, status: 'Active' }, { mentor: mentorId });

    res.json({ success: true, message: 'Mentor assigned', student });
  } catch (error) { next(error); }
};

// Toggle user active status (admin)
const toggleUserStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    user.isActive = !user.isActive;
    await user.save();
    res.json({ success: true, message: `User ${user.isActive ? 'activated' : 'deactivated'}`, isActive: user.isActive });
  } catch (error) { next(error); }
};

// Get mentor's students
const getMentorStudents = async (req, res, next) => {
  try {
    const students = await User.find({
      role: 'student',
      'studentProfile.assignedMentor': req.user._id,
    }).select('-password').populate('studentProfile.assignedMentor', 'name');

    // Get skill records
    const studentIds = students.map(s => s._id);
    const skillRecords = await SkillRecord.find({ student: { $in: studentIds } });

    const enriched = students.map(s => {
      const sr = skillRecords.find(r => r.student.toString() === s._id.toString());
      return { ...s.toObject(), skillRecord: sr };
    });

    res.json({ success: true, students: enriched });
  } catch (error) { next(error); }
};

// Get available mentors
const getMentors = async (req, res, next) => {
  try {
    const mentors = await User.find({ role: 'mentor', isActive: true }).select('-password');
    res.json({ success: true, mentors });
  } catch (error) { next(error); }
};

// Delete user (admin)
const deleteUser = async (req, res, next) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'User deleted' });
  } catch (error) { next(error); }
};

module.exports = { getAllUsers, getUser, assignMentor, toggleUserStatus, getMentorStudents, getMentors, deleteUser };
