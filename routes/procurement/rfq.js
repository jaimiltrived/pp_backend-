const express = require('express');
const router = express.Router();
const rfqController = require('../../controllers/procurement/rfqController');
const role = require('../../middleware/role');

// Procurement APIs
router.post('/', role('procurement'), rfqController.createRFQ);
router.post('/import-bom', role('procurement'), rfqController.importBOM);
router.post('/assign-suppliers', role('procurement'), rfqController.assignSuppliers);
router.get('/:id/comparison', role('procurement'), rfqController.getComparison);
router.put('/:id/select-supplier', role('procurement'), rfqController.selectSupplier);
router.get('/status', role('procurement'), rfqController.listByStatus);
router.get('/:id', role('procurement'), rfqController.getRFQDetails);
router.get('/', role('procurement'), rfqController.listRFQs);

module.exports = router;
