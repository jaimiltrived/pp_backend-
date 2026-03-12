const express = require('express');
const router = express.Router();
const sellerController = require('../controllers/sellerController');
const auth = require('../middleware/auth');
const role = require('../middleware/role');

/**
 * @swagger
 * /api/seller/dashboard:
 *   get:
 *     tags:
 *       - Seller
 *     summary: Get Seller Dashboard
 *     description: Get the seller dashboard with summary information
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Seller dashboard retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - User is not a seller
 */
router.get('/dashboard', auth, role('seller'), sellerController.dashboard);

module.exports = router;
