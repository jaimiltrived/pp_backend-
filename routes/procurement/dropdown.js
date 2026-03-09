const express = require('express');
const router = express.Router();
const dropdownController = require('../../controllers/procurement/dropdownController');
const role = require('../../middleware/role');

// Dropdown APIs
router.get('/rfq-numbers', role(['procurement','supplier']), dropdownController.getRFQNumbers);

module.exports = router;
