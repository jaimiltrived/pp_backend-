const express = require('express');
const router = express.Router();
const sellerController = require('../controllers/sellerController');
const auth = require('../middleware/auth');
const role = require('../middleware/role');

router.get('/dashboard', auth, role('seller'), sellerController.dashboard);
router.get('/rfqs', auth, role('seller'), sellerController.getOpenRFQs);
router.post('/bid', auth, role('seller'), sellerController.submitBid);
router.get('/bids', auth, role('seller'), sellerController.getMyBids);
router.put('/bid/:id', auth, role('seller'), sellerController.updateBid);
router.delete('/bid/:id', auth, role('seller'), sellerController.deleteBid);
router.get('/inbox', auth, role('seller'), sellerController.getInbox);
router.get('/analytics', auth, role('seller'), sellerController.getAnalytics);

module.exports = router;
