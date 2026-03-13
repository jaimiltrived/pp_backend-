const express = require('express');
const router = express.Router();
const supplierRFQController = require('../../controllers/supplier/supplierRFQController');
const auth = require('../../middleware/auth');
const role = require('../../middleware/role');

/**
 * @swagger
 * /api/supplier/rfq:
 *   get:
 *     tags:
 *       - Supplier - RFQ
 *     summary: List Assigned RFQs
 *     description: Get list of RFQs assigned to the supplier
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Assigned RFQs retrieved successfully
 *       403:
 *         description: Forbidden - User does not have supplier role
 */
router.get('/', auth, role('seller'), supplierRFQController.listAssignedRFQs);

/**
 * @swagger
 * /api/supplier/rfq/{id}:
 *   get:
 *     tags:
 *       - Supplier - RFQ
 *     summary: Get Assigned RFQ Details
 *     description: Get details of an RFQ assigned to the supplier
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: RFQ ID
 *     responses:
 *       200:
 *         description: RFQ details retrieved successfully
 *       403:
 *         description: Forbidden
 *       404:
 *         description: RFQ not found
 */
router.get('/:id', auth, role('seller'), supplierRFQController.getAssignedRFQDetails);

/**
 * @swagger
 * /api/supplier/rfq/{id}/quote:
 *   post:
 *     tags:
 *       - Supplier - RFQ
 *     summary: Submit Quotation
 *     description: Submit a quote for an RFQ
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: RFQ ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               unit_price:
 *                 type: number
 *               delivery_days:
 *                 type: integer
 *               terms:
 *                 type: string
 *     responses:
 *       201:
 *         description: Quotation submitted successfully
 *       403:
 *         description: Forbidden
 */
router.post('/:id/quote', auth, role('seller'), supplierRFQController.submitQuotation);

/**
 * @swagger
 * /api/supplier/rfq/{id}/update-quote:
 *   put:
 *     tags:
 *       - Supplier - RFQ
 *     summary: Update Quotation
 *     description: Update an existing quotation for an RFQ
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: RFQ ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               unit_price:
 *                 type: number
 *               delivery_days:
 *                 type: integer
 *               terms:
 *                 type: string
 *     responses:
 *       200:
 *         description: Quotation updated successfully
 *       403:
 *         description: Forbidden
 */
router.put('/:id/update-quote', auth, role('seller'), supplierRFQController.updateQuotation);

module.exports = router;
