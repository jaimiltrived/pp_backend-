const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');

/**
 * @swagger
 * /api/user/profile:
 *   get:
 *     tags:
 *       - User
 *     summary: Get User Profile
 *     description: Get the profile of the authenticated user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 */
router.get('/profile', auth, userController.profile);

/**
 * @swagger
 * /api/user/logout:
 *   post:
 *     tags:
 *       - User
 *     summary: User Logout
 *     description: Logout the authenticated user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User logged out successfully
 *       401:
 *         description: Unauthorized
 */
router.post('/logout', auth, userController.logout);

module.exports = router;
