// ─── authRoutes.js ────────────────────────────────────────────────────────────
const express = require('express');
const router = express.Router();
const { register, login, getProfile, updateProfile, changePassword, uploadProfilePhoto } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { uploadProfile } = require('../config/cloudinary');

router.post('/register', register);
router.post('/login', login);
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.put('/change-password', protect, changePassword);
router.post('/upload-photo', protect, uploadProfile.single('photo'), uploadProfilePhoto);

module.exports = router;
