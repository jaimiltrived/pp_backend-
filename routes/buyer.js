const express = require('express');
const router = express.Router();
const buyerController = require('../controllers/buyerController');
const auth = require('../middleware/auth');
const role = require('../middleware/role');

router.get('/dashboard', auth, role('buyer'), buyerController.dashboard);

module.exports = router;
