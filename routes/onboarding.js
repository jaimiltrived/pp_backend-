const express = require('express');
const router = express.Router();
const onboardingController = require('../controllers/onboardingController');

/**
 * @swagger
 * /api/onboarding/organization:
 *   post:
 *     tags:
 *       - Onboarding
 *     summary: Store Organization
 *     description: Store organization details during onboarding (Step 1)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               registration_number:
 *                 type: string
 *               country:
 *                 type: string
 *     responses:
 *       201:
 *         description: Organization stored successfully
 *       400:
 *         description: Invalid input
 */
router.post('/organization', onboardingController.storeOrganization);

/**
 * @swagger
 * /api/onboarding/send-otp:
 *   post:
 *     tags:
 *       - Onboarding
 *     summary: Send OTP
 *     description: Send OTP to user's email for verification
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
 *         description: OTP sent successfully
 *       400:
 *         description: Invalid email
 */
router.post('/send-otp', onboardingController.sendOtp);

/**
 * @swagger
 * /api/onboarding/verify-otp:
 *   post:
 *     tags:
 *       - Onboarding
 *     summary: Verify OTP
 *     description: Verify OTP sent to user's email
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
router.post('/verify-otp', onboardingController.verifyOtp);

/**
 * @swagger
 * /api/onboarding/create-user:
 *   post:
 *     tags:
 *       - Onboarding
 *     summary: Create User
 *     description: Create user account during onboarding (Step 2)
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
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Invalid input
 */
router.post('/create-user', onboardingController.createUser);

/**
 * @swagger
 * /api/onboarding/organization-info:
 *   post:
 *     tags:
 *       - Onboarding
 *     summary: Store Organization Info
 *     description: Store additional organization information (Step 3)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               organization_id:
 *                 type: string
 *               address:
 *                 type: string
 *               city:
 *                 type: string
 *               phone:
 *                 type: string
 *     responses:
 *       201:
 *         description: Organization info stored successfully
 *       400:
 *         description: Invalid input
 */
router.post('/organization-info', onboardingController.storeOrganizationInfo);

/**
 * @swagger
 * /api/onboarding/personal-info:
 *   post:
 *     tags:
 *       - Onboarding
 *     summary: Store Personal Info
 *     description: Store personal information of user (Step 4)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: string
 *               phone:
 *                 type: string
 *               designation:
 *                 type: string
 *               department:
 *                 type: string
 *     responses:
 *       201:
 *         description: Personal info stored successfully
 *       400:
 *         description: Invalid input
 */
router.post('/personal-info', onboardingController.storePersonalInfo);

/**
 * @swagger
 * /api/onboarding/industry-codes:
 *   get:
 *     tags:
 *       - Onboarding
 *     summary: Get Industry Codes
 *     description: Get list of available industry codes
 *     responses:
 *       200:
 *         description: Industry codes retrieved successfully
 */
router.get('/industry-codes', onboardingController.getIndustryCodes);

/**
 * @swagger
 * /api/onboarding/select-industry:
 *   post:
 *     tags:
 *       - Onboarding
 *     summary: Select Industry
 *     description: Select industry for the organization (Step 5)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: string
 *               industry_code:
 *                 type: string
 *     responses:
 *       200:
 *         description: Industry selected successfully
 *       400:
 *         description: Invalid input
 */
router.post('/select-industry', onboardingController.selectIndustry);

/**
 * @swagger
 * /api/onboarding/payment-method:
 *   post:
 *     tags:
 *       - Onboarding
 *     summary: Store Payment Method
 *     description: Store payment method details (Step 6)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: string
 *               method_type:
 *                 type: string
 *                 enum: [credit_card, bank_transfer, paypal]
 *               details:
 *                 type: object
 *     responses:
 *       201:
 *         description: Payment method stored successfully
 *       400:
 *         description: Invalid input
 */
router.post('/payment-method', onboardingController.storePaymentMethod);

router.get('/status/:user_id', onboardingController.getOnboardingStatus);
router.post('/complete', onboardingController.completeOnboarding);

module.exports = router;
