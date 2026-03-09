const express = require('express');
const router = express.Router();
const supplierRFQController = require('../../controllers/supplier/supplierRFQController');
const role = require('../../middleware/role');

// Supplier APIs
router.get('/', role('supplier'), supplierRFQController.listAssignedRFQs);
router.get('/:id', role('supplier'), supplierRFQController.getAssignedRFQDetails);
router.post('/:id/quote', role('supplier'), supplierRFQController.submitQuotation);
router.put('/:id/update-quote', role('supplier'), supplierRFQController.updateQuotation);

module.exports = router;
