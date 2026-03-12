const express = require('express');
const router = express.Router();
const rfqController = require('../controllers/rfqController');
const auth = require('../middleware/auth');

// RFQ-Tracking Routes

/**
 * @swagger
 * /api/rfq/tracking:
 *   get:
 *     tags:
 *       - RFQ - Tracking
 *     summary: Get All RFQs
 *     description: Retrieve all RFQ requests with tracking information
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [open, closed, awarded]
 *     responses:
 *       200:
 *         description: RFQs retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/RFQ'
 */
router.get('/tracking', rfqController.getAllRFQs);

/**
 * @swagger
 * /api/rfq/tracking/{id}:
 *   get:
 *     tags:
 *       - RFQ - Tracking
 *     summary: Get RFQ by ID
 *     description: Retrieve a specific RFQ with tracking details
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: RFQ ID
 *     responses:
 *       200:
 *         description: RFQ retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RFQ'
 *       404:
 *         description: RFQ not found
 */
router.get('/tracking/:id', rfqController.getRFQById);

/**
 * @swagger
 * /api/rfq/tracking:
 *   post:
 *     tags:
 *       - RFQ - Tracking
 *     summary: Create RFQ
 *     description: Create a new Request for Quotation
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
 *               description:
 *                 type: string
 *               category:
 *                 type: string
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *     responses:
 *       201:
 *         description: RFQ created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RFQ'
 */
router.post('/tracking', auth, rfqController.createRFQ);

/**
 * @swagger
 * /api/rfq/tracking/{id}/status:
 *   put:
 *     tags:
 *       - RFQ - Tracking
 *     summary: Update RFQ Status
 *     description: Update the status of an RFQ
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [open, closed, awarded]
 *     responses:
 *       200:
 *         description: RFQ status updated successfully
 */
router.put('/tracking/:id/status', auth, rfqController.updateRFQStatus);

// Detail Analysis Routes

/**
 * @swagger
 * /api/rfq/analysis/{rfq_id}:
 *   get:
 *     tags:
 *       - RFQ - Analysis
 *     summary: Get RFQ Detail Analysis
 *     description: Get detailed analysis for an RFQ including quotes and comparisons
 *     parameters:
 *       - in: path
 *         name: rfq_id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Analysis retrieved successfully
 */
router.get('/analysis/:rfq_id', rfqController.getDetailAnalysis);

/**
 * @swagger
 * /api/rfq/quotes/{part_number}:
 *   get:
 *     tags:
 *       - RFQ - Quotes
 *     summary: Get Quotes by Part Number
 *     description: Retrieve all quotes for a specific part number
 *     parameters:
 *       - in: path
 *         name: part_number
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Quotes retrieved successfully
 */
router.get('/quotes/:part_number', rfqController.getQuotesByPart);

// Supplier Selection Routes

/**
 * @swagger
 * /api/rfq/suppliers/best/{part_number}:
 *   get:
 *     tags:
 *       - RFQ - Suppliers
 *     summary: Get Best Suppliers
 *     description: Get the best suppliers for a part based on price and ratings
 *     parameters:
 *       - in: path
 *         name: part_number
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Best suppliers retrieved successfully
 */
router.get('/suppliers/best/:part_number', rfqController.getBestSuppliers);

/**
 * @swagger
 * /api/rfq/savings/calculate:
 *   post:
 *     tags:
 *       - RFQ - Suppliers
 *     summary: Calculate Savings
 *     description: Calculate potential cost savings from supplier quotes
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               current_cost:
 *                 type: number
 *               quotes:
 *                 type: array
 *                 items:
 *                   type: object
 *     responses:
 *       200:
 *         description: Savings calculated successfully
 */
router.post('/savings/calculate', auth, rfqController.calculateSavings);

// RFQ-Input Routes

/**
 * @swagger
 * /api/rfq/input/{rfq_id}:
 *   get:
 *     tags:
 *       - RFQ - Input
 *     summary: Get RFQ Input
 *     description: Retrieve RFQ input and requirements
 *     parameters:
 *       - in: path
 *         name: rfq_id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: RFQ input retrieved successfully
 */
router.get('/input/:rfq_id', rfqController.getRFQInput);

/**
 * @swagger
 * /api/rfq/input:
 *   post:
 *     tags:
 *       - RFQ - Input
 *     summary: Create RFQ Input
 *     description: Create RFQ input and requirements
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: RFQ input created successfully
 */
router.post('/input', auth, rfqController.createRFQInput);

// Adapter RFQ-Generator Routes

/**
 * @swagger
 * /api/rfq/mappings:
 *   get:
 *     tags:
 *       - RFQ - Mappings
 *     summary: Get Part Mappings
 *     description: Get internal to supplier part mappings
 *     responses:
 *       200:
 *         description: Part mappings retrieved successfully
 */
router.get('/mappings', rfqController.getPartMappings);

/**
 * @swagger
 * /api/rfq/mappings:
 *   post:
 *     tags:
 *       - RFQ - Mappings
 *     summary: Create Part Mapping
 *     description: Create a mapping between internal and supplier parts
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       201:
 *         description: Part mapping created successfully
 */
router.post('/mappings', auth, rfqController.createPartMapping);

// RFQ-Supplier & DropDown Routes

/**
 * @swagger
 * /api/rfq/suppliers:
 *   get:
 *     tags:
 *       - RFQ - Suppliers
 *     summary: Get All Suppliers
 *     description: Retrieve all suppliers in the system
 *     responses:
 *       200:
 *         description: Suppliers retrieved successfully
 */
router.get('/suppliers', rfqController.getAllSuppliers);

/**
 * @swagger
 * /api/rfq/dropdown/{category}:
 *   get:
 *     tags:
 *       - RFQ - Dropdown
 *     summary: Get Dropdown Options
 *     description: Get dropdown options for a specific category
 *     parameters:
 *       - in: path
 *         name: category
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Dropdown options retrieved successfully
 */
router.get('/dropdown/:category', rfqController.getDropdownOptions);

// Dashboard Route

/**
 * @swagger
 * /api/rfq/dashboard/summary:
 *   get:
 *     tags:
 *       - RFQ - Dashboard
 *     summary: Get Dashboard Summary
 *     description: Get RFQ dashboard summary with key metrics
 *     responses:
 *       200:
 *         description: Dashboard summary retrieved successfully
 */
router.get('/dashboard/summary', rfqController.getDashboard);

module.exports = router;
