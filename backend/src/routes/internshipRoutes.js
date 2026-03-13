// ─── internshipRoutes.js ──────────────────────────────────────────────────────
const express = require('express');
const { protect, authorize } = require('../middleware/authMiddleware');
const {
  createInternship, getMyInternships, getInternship,
  updateInternship, approveInternship, getMentorInternships,
  getAllInternships, updateProgress,
} = require('../controllers/internshipController');

const internshipRouter = express.Router();
internshipRouter.post('/', protect, authorize('student'), createInternship);
internshipRouter.get('/', protect, authorize('admin'), getAllInternships);
internshipRouter.get('/my', protect, authorize('student'), getMyInternships);
internshipRouter.get('/mentor', protect, authorize('mentor'), getMentorInternships);
internshipRouter.get('/:id', protect, getInternship);
internshipRouter.put('/:id', protect, authorize('student'), updateInternship);
internshipRouter.patch('/:id/approve', protect, authorize('mentor', 'admin'), approveInternship);
internshipRouter.patch('/:id/progress', protect, updateProgress);

module.exports = internshipRouter;
