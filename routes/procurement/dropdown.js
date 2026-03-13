const express = require('express');
const router = express.Router();
const dropdownController = require('../../controllers/procurement/dropdownController');
const auth = require('../../middleware/auth');
const role = require('../../middleware/role');

/**
 * @swagger
 * /api/procurement/dropdown/rfq-numbers:
 *   get:
 *     tags:
 *       - Procurement - Dropdown
 *     summary: Get RFQ Numbers
 *     description: Get list of RFQ numbers for dropdown selection
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: RFQ numbers retrieved successfully
 *       403:
 *         description: Forbidden - User does not have required role
 */
router.get('/rfq-numbers', auth, role(['buyer','seller']), dropdownController.getRFQNumbers);

module.exports = router;
