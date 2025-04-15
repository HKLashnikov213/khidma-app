// backend/routes/auth.js

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// @route   POST /api/auth/send-otp
router.post('/send-otp', authController.sendOtp);

// @route   POST /api/auth/verify-otp
router.post('/verify-otp', authController.verifyOtp);

module.exports = router;
