const express = require('express');
const router = express.Router();
const rfqController = require('../controllers/rfqController');
const auth = require('../middleware/auth');

// RFQ-Tracking Routes
router.get('/tracking', rfqController.getAllRFQs);
router.get('/tracking/:id', rfqController.getRFQById);
router.post('/tracking', auth, rfqController.createRFQ);
router.put('/tracking/:id/status', auth, rfqController.updateRFQStatus);

// Detail Analysis Routes
router.get('/analysis/:rfq_id', rfqController.getDetailAnalysis);
router.get('/quotes/:part_number', rfqController.getQuotesByPart);

// Supplier Selection Routes
router.get('/suppliers/best/:part_number', rfqController.getBestSuppliers);
router.post('/savings/calculate', auth, rfqController.calculateSavings);

// RFQ-Input Routes
router.get('/input/:rfq_id', rfqController.getRFQInput);
router.post('/input', auth, rfqController.createRFQInput);

// Adapter RFQ-Generator Routes
router.get('/mappings', rfqController.getPartMappings);
router.post('/mappings', auth, rfqController.createPartMapping);

// RFQ-Supplier & DropDown Routes
router.get('/suppliers', rfqController.getAllSuppliers);
router.get('/dropdown/:category', rfqController.getDropdownOptions);

// Dashboard Route
router.get('/dashboard/summary', rfqController.getDashboard);

module.exports = router;
