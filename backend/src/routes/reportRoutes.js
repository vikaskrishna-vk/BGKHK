const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/authMiddleware');
const {
  submitReport, getMyReports, getReport,
  reviewReport, getMentorReports, generateFinalReport,
} = require('../controllers/reportController');

router.post('/', protect, authorize('student'), submitReport);
router.get('/my', protect, authorize('student'), getMyReports);
router.get('/mentor', protect, authorize('mentor'), getMentorReports);
router.get('/:id', protect, getReport);
router.patch('/:id/review', protect, authorize('mentor'), reviewReport);
router.post('/final/:internshipId', protect, authorize('student'), generateFinalReport);

module.exports = router;
