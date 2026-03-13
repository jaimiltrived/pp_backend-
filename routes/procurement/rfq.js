const express = require('express');
const router = express.Router();
const rfqController = require('../../controllers/procurement/rfqController');
const auth = require('../../middleware/auth');
const role = require('../../middleware/role');

/**
 * @swagger
 * /api/procurement/rfq:
 *   post:
 *     tags:
 *       - Procurement - RFQ
 *     summary: Create RFQ
 *     description: Create a new RFQ for procurement
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *     responses:
 *       201:
 *         description: RFQ created successfully
 *       403:
 *         description: Forbidden - User does not have procurement role
 */
router.post('/', auth, role('buyer'), rfqController.createRFQ);

/**
 * @swagger
 * /api/procurement/rfq/import-bom:
 *   post:
 *     tags:
 *       - Procurement - RFQ
 *     summary: Import BOM
 *     description: Import Bill of Materials for RFQ
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: BOM imported successfully
 *       403:
 *         description: Forbidden
 */
router.post('/import-bom', auth, role('buyer'), rfqController.importBOM);

/**
 * @swagger
 * /api/procurement/rfq/assign-suppliers:
 *   post:
 *     tags:
 *       - Procurement - RFQ
 *     summary: Assign Suppliers
 *     description: Assign suppliers to an RFQ
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rfq_id:
 *                 type: string
 *               suppliers:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Suppliers assigned successfully
 *       403:
 *         description: Forbidden
 */
router.post('/assign-suppliers', auth, role('buyer'), rfqController.assignSuppliers);

/**
 * @swagger
 * /api/procurement/rfq/{id}/comparison:
 *   get:
 *     tags:
 *       - Procurement - RFQ
 *     summary: Get RFQ Comparison
 *     description: Get supplier quotes comparison for an RFQ
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
 *         description: Comparison retrieved successfully
 *       403:
 *         description: Forbidden
 *       404:
 *         description: RFQ not found
 */
router.get('/:id/comparison', auth, role('buyer'), rfqController.getComparison);

/**
 * @swagger
 * /api/procurement/rfq/{id}/select-supplier:
 *   put:
 *     tags:
 *       - Procurement - RFQ
 *     summary: Select Supplier
 *     description: Select a supplier for RFQ
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
 *               supplier_id:
 *                 type: string
 *     responses:
 *       200:
 *         description: Supplier selected successfully
 *       403:
 *         description: Forbidden
 */
router.put('/:id/select-supplier', auth, role('buyer'), rfqController.selectSupplier);

/**
 * @swagger
 * /api/procurement/rfq/status:
 *   get:
 *     tags:
 *       - Procurement - RFQ
 *     summary: List RFQs by Status
 *     description: List RFQs filtered by status
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: RFQs retrieved successfully
 *       403:
 *         description: Forbidden
 */
router.get('/status', auth, role('buyer'), rfqController.listByStatus);

/**
 * @swagger
 * /api/procurement/rfq/{id}:
 *   get:
 *     tags:
 *       - Procurement - RFQ
 *     summary: Get RFQ Details
 *     description: Get detailed information for an RFQ
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
router.get('/:id', auth, role('buyer'), rfqController.getRFQDetails);

/**
 * @swagger
 * /api/procurement/rfq:
 *   get:
 *     tags:
 *       - Procurement - RFQ
 *     summary: List RFQs
 *     description: List all RFQs
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: RFQs retrieved successfully
 *       403:
 *         description: Forbidden
 */
router.get('/', auth, role('buyer'), rfqController.listRFQs);

/**
 * @swagger
 * /api/procurement/rfq/dashboard/summary:
 *   get:
 *     tags:
 *       - Procurement - RFQ
 *     summary: Get dashboard summary
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard metrics retrieved successfully
 */
router.get('/dashboard/summary', auth, role('buyer'), rfqController.getDashboard);

/**
 * @swagger
 * /api/procurement/rfq/savings/calculate:
 *   post:
 *     tags:
 *       - Procurement - RFQ
 *     summary: Calculate potential savings
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rfq_id:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Savings calculated successfully
 */
router.post('/savings/calculate', auth, role('buyer'), rfqController.calculateSavings);

module.exports = router;
