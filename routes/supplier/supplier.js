const express = require('express');
const router = express.Router();
const supplierController = require('../../controllers/supplier/supplierController');
const auth = require('../../middleware/auth');
const role = require('../../middleware/role');

/**
 * @swagger
 * /api/supplier:
 *   post:
 *     tags:
 *       - Supplier - Master
 *     summary: Add Supplier
 *     description: Add a new supplier (procurement only)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               address:
 *                 type: string
 *     responses:
 *       201:
 *         description: Supplier added successfully
 *       403:
 *         description: Forbidden - User does not have procurement role
 */
router.post('/', auth, role('buyer'), supplierController.addSupplier);

/**
 * @swagger
 * /api/supplier/{id}:
 *   put:
 *     tags:
 *       - Supplier - Master
 *     summary: Edit Supplier
 *     description: Edit supplier information (procurement only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Supplier ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               address:
 *                 type: string
 *     responses:
 *       200:
 *         description: Supplier updated successfully
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Supplier not found
 */
router.put('/:id', auth, role('buyer'), supplierController.editSupplier);

/**
 * @swagger
 * /api/supplier:
 *   get:
 *     tags:
 *       - Supplier - Master
 *     summary: List Suppliers
 *     description: Get list of all suppliers
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
 *         description: Suppliers retrieved successfully
 *       403:
 *         description: Forbidden - User does not have required role
 */
router.get('/', auth, role(['buyer','seller']), supplierController.listSuppliers);

module.exports = router;
