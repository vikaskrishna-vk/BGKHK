// userRoutes.js
const express = require('express');
const router = express.Router();
const { getAllUsers, getUser, assignMentor, toggleUserStatus, getMentorStudents, getMentors, deleteUser } = require('../controllers/userController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', protect, authorize('admin'), getAllUsers);
router.get('/mentors', protect, getMentors);
router.get('/my-students', protect, authorize('mentor'), getMentorStudents);
router.get('/:id', protect, getUser);
router.post('/assign-mentor', protect, authorize('admin'), assignMentor);
router.patch('/:id/toggle-status', protect, authorize('admin'), toggleUserStatus);
router.delete('/:id', protect, authorize('admin'), deleteUser);

module.exports = router;
