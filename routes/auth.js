const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/signup', authController.signup);
router.post('/login', authController.login);

// Multi-step onboarding and social login
router.post('/login/email', authController.loginWithEmail);
router.post('/login/password', authController.loginWithPassword);
router.post('/login/google', authController.googleLogin);
router.post('/login/apple', authController.appleLogin);
router.post('/select-role', authController.selectRole);
router.post('/register', authController.register);

// Forgot Password Flow
router.post('/forgot-password', authController.forgotPassword);
router.post('/verify-reset-otp', authController.verifyResetOtp);
router.post('/reset-password', authController.resetPassword);

module.exports = router;
