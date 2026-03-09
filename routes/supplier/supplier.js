const express = require('express');
const router = express.Router();
const supplierController = require('../../controllers/supplier/supplierController');
const role = require('../../middleware/role');

// Supplier Master APIs
router.post('/', role('procurement'), supplierController.addSupplier);
router.put('/:id', role('procurement'), supplierController.editSupplier);
router.get('/', role(['procurement','supplier']), supplierController.listSuppliers);

module.exports = router;
