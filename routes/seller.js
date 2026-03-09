const express = require('express');
const router = express.Router();
const sellerController = require('../controllers/sellerController');
const auth = require('../middleware/auth');
const role = require('../middleware/role');

router.get('/dashboard', auth, role('seller'), sellerController.dashboard);

module.exports = router;
