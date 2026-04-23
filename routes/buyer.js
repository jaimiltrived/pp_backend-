const express = require('express');
const router = express.Router();
const buyerController = require('../controllers/buyerController');
const auth = require('../middleware/auth');
const role = require('../middleware/role');

/**
 * @swagger
 * /api/buyer/dashboard:
 *   get:
 *     tags:
 *       - Buyer
 *     summary: Get Buyer Dashboard
 *     description: Get the buyer dashboard with summary information
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Buyer dashboard retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - User is not a buyer
 */
router.get('/dashboard', auth, role('buyer'), buyerController.dashboard);
router.post('/rfq', auth, role('buyer'), buyerController.createRFQ);
router.get('/rfqs', auth, role('buyer'), buyerController.getBuyerRFQs);
router.put('/rfq/:id', auth, role('buyer'), buyerController.updateRFQ);
router.delete('/rfq/:id', auth, role('buyer'), buyerController.deleteRFQ);
router.get('/analytics', auth, role('buyer'), buyerController.getAnalytics);
router.get('/awards', auth, role('buyer'), buyerController.getBuyerAwards);
router.get('/invoices', auth, role('buyer'), buyerController.getBuyerInvoices);
router.get('/invoice/:id', auth, role('buyer'), buyerController.getInvoiceDetail);
router.delete('/invoice/:id', auth, role('buyer'), buyerController.deleteInvoice);
router.get('/events', auth, role('buyer'), buyerController.getBuyerEvents);
module.exports = router;
