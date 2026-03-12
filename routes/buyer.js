const express = require('express');
const router = express.Router();
const buyerController = require('../controllers/buyerController');
const auth = require('../middleware/auth');
const role = require('../middleware/role');

/**
 * @swagger
 * /api/buyer/dashboard:
 *   get:
 *     tags:
 *       - Buyer
 *     summary: Get Buyer Dashboard
 *     description: Get the buyer dashboard with summary information
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Buyer dashboard retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - User is not a buyer
 */
router.get('/dashboard', auth, role('buyer'), buyerController.dashboard);

module.exports = router;
