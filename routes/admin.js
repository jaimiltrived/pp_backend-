const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const auth = require('../middleware/auth');
const role = require('../middleware/role');

// Admin routes - require authentication and admin role
router.get('/pending-users', auth, role('admin'), adminController.getPendingUsers);
router.get('/users', auth, role('admin'), adminController.getAllUsers);
router.get('/user/:user_id', auth, role('admin'), adminController.getUserForReview);
router.put('/user/:user_id/approve', auth, role('admin'), adminController.approveUser);
router.put('/user/:user_id/reject', auth, role('admin'), adminController.rejectUser);
router.put('/user/:user_id/suspend', auth, role('admin'), adminController.suspendUser);

module.exports = router;
