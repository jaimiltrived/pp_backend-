const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

/**
 * @swagger
 * /api/auth/signup:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: User Signup
 *     description: Create a new user account
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *               firstName:
 *                 type: string
 *                 example: John
 *               lastName:
 *                 type: string
 *                 example: Doe
 *     responses:
 *       201:
 *         description: User successfully created
 *       400:
 *         description: Invalid input or user already exists
 */
router.post('/signup', authController.signup);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: User Login
 *     description: Login with email and password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: password123
 *     responses:
 *       200:
 *         description: Successfully logged in
 *       401:
 *         description: Invalid credentials
 */
router.post('/login', authController.login);

/**
 * @swagger
 * /api/auth/login/email:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Login with Email (Step 1)
 *     description: Email verification step for multi-step onboarding
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *     responses:
 *       200:
 *         description: Email verification sent
 *       400:
 *         description: Invalid email
 */
router.post('/login/email', authController.loginWithEmail);

/**
 * @swagger
 * /api/auth/login/password:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Verify Password (Step 2)
 *     description: Password verification for multi-step onboarding
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password verified
 *       401:
 *         description: Invalid password
 */
router.post('/login/password', authController.loginWithPassword);

/**
 * @swagger
 * /api/auth/login/google:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Google OAuth Login
 *     description: Login with Google account
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *                 description: Google OAuth token
 *     responses:
 *       200:
 *         description: Successfully logged in with Google
 *       400:
 *         description: Invalid token
 */
router.post('/login/google', authController.googleLogin);

/**
 * @swagger
 * /api/auth/login/apple:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Apple OAuth Login
 *     description: Login with Apple account
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *                 description: Apple OAuth token
 *     responses:
 *       200:
 *         description: Successfully logged in with Apple
 *       400:
 *         description: Invalid token
 */
router.post('/login/apple', authController.appleLogin);

/**
 * @swagger
 * /api/auth/select-role:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Select User Role
 *     description: User selects their role (buyer, seller, admin) during onboarding
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               role:
 *                 type: string
 *                 enum: [buyer, seller, admin]
 *     responses:
 *       200:
 *         description: Role selected successfully
 *       400:
 *         description: Invalid role
 */
router.post('/select-role', authController.selectRole);

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Complete User Registration
 *     description: Final registration step after role selection
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *     responses:
 *       200:
 *         description: Registration completed
 *       400:
 *         description: Invalid input
 */
router.post('/register', authController.register);

/**
 * @swagger
 * /api/auth/forgot-password:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Request Password Reset
 *     description: Initiate forgot password flow
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Reset OTP sent to email
 *       404:
 *         description: User not found
 */
router.post('/forgot-password', authController.forgotPassword);

/**
 * @swagger
 * /api/auth/verify-reset-otp:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Verify Reset OTP
 *     description: Verify the OTP sent for password reset
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               otp:
 *                 type: string
 *     responses:
 *       200:
 *         description: OTP verified successfully
 *       400:
 *         description: Invalid or expired OTP
 */
router.post('/verify-reset-otp', authController.verifyResetOtp);

/**
 * @swagger
 * /api/auth/reset-password:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Reset Password
 *     description: Set new password after OTP verification
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password reset successfully
 *       400:
 *         description: Invalid request
 */
router.post('/reset-password', authController.resetPassword);

module.exports = router;
