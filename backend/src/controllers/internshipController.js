const Internship = require('../models/Internship');
const { Notification } = require('../models/index');
const { calculatePlacementReadiness } = require('../services/skillService');

// ─── CREATE INTERNSHIP ────────────────────────────────────────────────────────
const createInternship = async (req, res, next) => {
  try {
    const { company, role, domain, description, startDate, endDate, stipend, mode } = req.body;

    const internship = await Internship.create({
      student: req.user._id,
      mentor: req.user.studentProfile?.assignedMentor,
      company, role, domain, description, startDate, endDate, stipend, mode,
    });

    // Notify mentor
    if (req.user.studentProfile?.assignedMentor) {
      const io = req.app.get('io');
      const notification = await Notification.create({
        recipient: req.user.studentProfile.assignedMentor,
        sender: req.user._id,
        type: 'internship_approved',
        title: 'New Internship Added',
        message: `${req.user.name} added a new internship at ${company.name}. Please review and verify.`,
        link: `/mentor/internships/${internship._id}`,
      });
      io?.to(`user_${req.user.studentProfile.assignedMentor}`).emit('notification', notification);
    }

    await internship.populate('student', 'name email');
    res.status(201).json({ success: true, message: 'Internship submitted for approval', internship });
  } catch (error) {
    next(error);
  }
};

// ─── GET MY INTERNSHIPS ───────────────────────────────────────────────────────
const getMyInternships = async (req, res, next) => {
  try {
    const internships = await Internship.find({ student: req.user._id })
      .populate('mentor', 'name email mentorProfile.designation')
      .populate('certificate')
      .sort('-createdAt');
    res.json({ success: true, count: internships.length, internships });
  } catch (error) {
    next(error);
  }
};

// ─── GET SINGLE INTERNSHIP ────────────────────────────────────────────────────
const getInternship = async (req, res, next) => {
  try {
    const internship = await Internship.findById(req.params.id)
      .populate('student', 'name email profilePhoto studentProfile')
      .populate('mentor', 'name email mentorProfile')
      .populate({ path: 'reports', options: { sort: { weekNumber: 1 } } })
      .populate('certificate');

    if (!internship) return res.status(404).json({ success: false, message: 'Internship not found' });

    // Authorization check
    const isOwner = internship.student._id.toString() === req.user._id.toString();
    const isMentor = internship.mentor?._id.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';
    if (!isOwner && !isMentor && !isAdmin) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    res.json({ success: true, internship });
  } catch (error) {
    next(error);
  }
};

// ─── UPDATE INTERNSHIP ────────────────────────────────────────────────────────
const updateInternship = async (req, res, next) => {
  try {
    const internship = await Internship.findById(req.params.id);
    if (!internship) return res.status(404).json({ success: false, message: 'Not found' });
    if (internship.student.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    const updated = await Internship.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.json({ success: true, internship: updated });
  } catch (error) {
    next(error);
  }
};

// ─── APPROVE/REJECT (Mentor/Admin) ────────────────────────────────────────────
const approveInternship = async (req, res, next) => {
  try {
    const { status, notes } = req.body;
    const internship = await Internship.findById(req.params.id).populate('student');

    if (!internship) return res.status(404).json({ success: false, message: 'Not found' });

    internship.status = status;
    if (notes) internship.adminNotes = notes;
    if (status === 'Active') {
      internship.verificationStatus = req.user.role === 'admin' ? 'Admin Verified' : 'Mentor Verified';
    }
    if (status === 'Completed') {
      internship.completedAt = new Date();
      internship.progress = 100;
    }
    await internship.save();

    // Notify student
    const io = req.app.get('io');
    const notification = await Notification.create({
      recipient: internship.student._id,
      sender: req.user._id,
      type: status === 'Active' ? 'internship_approved' : 'internship_rejected',
      title: `Internship ${status}`,
      message: `Your internship at ${internship.company.name} has been ${status.toLowerCase()}.${notes ? ` Note: ${notes}` : ''}`,
      link: `/student/internships/${internship._id}`,
    });
    io?.to(`user_${internship.student._id}`).emit('notification', notification);

    res.json({ success: true, message: `Internship ${status}`, internship });
  } catch (error) {
    next(error);
  }
};

// ─── GET MENTOR'S STUDENTS' INTERNSHIPS ───────────────────────────────────────
const getMentorInternships = async (req, res, next) => {
  try {
    const internships = await Internship.find({ mentor: req.user._id })
      .populate('student', 'name email profilePhoto studentProfile')
      .sort('-createdAt');
    res.json({ success: true, internships });
  } catch (error) {
    next(error);
  }
};

// ─── GET ALL INTERNSHIPS (Admin) ──────────────────────────────────────────────
const getAllInternships = async (req, res, next) => {
  try {
    const { status, domain, page = 1, limit = 20, search } = req.query;
    const query = {};
    if (status) query.status = status;
    if (domain) query.domain = domain;
    if (search) query['company.name'] = { $regex: search, $options: 'i' };

    const total = await Internship.countDocuments(query);
    const internships = await Internship.find(query)
      .populate('student', 'name email college')
      .populate('mentor', 'name email')
      .sort('-createdAt')
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({ success: true, total, page: Number(page), internships });
  } catch (error) {
    next(error);
  }
};

// ─── UPDATE PROGRESS ──────────────────────────────────────────────────────────
const updateProgress = async (req, res, next) => {
  try {
    const { progress } = req.body;
    const internship = await Internship.findByIdAndUpdate(
      req.params.id, { progress }, { new: true }
    );
    res.json({ success: true, internship });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createInternship, getMyInternships, getInternship,
  updateInternship, approveInternship, getMentorInternships,
  getAllInternships, updateProgress,
};
