const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const auth = require('../middleware/auth');
const role = require('../middleware/role');

/**
 * @swagger
 * /api/admin/pending-users:
 *   get:
 *     tags:
 *       - Admin
 *     summary: Get Pending Users
 *     description: Get list of users pending approval (admin only)
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Pending users retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - User is not an admin
 */
router.get('/stats', auth, role('admin'), adminController.getDashboardStats);
router.get('/pending-users', auth, role('admin'), adminController.getPendingUsers);

/**
 * @swagger
 * /api/admin/users:
 *   get:
 *     tags:
 *       - Admin
 *     summary: Get All Users
 *     description: Get list of all users (admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, approved, rejected, suspended]
 *     responses:
 *       200:
 *         description: Users retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - User is not an admin
 */
router.get('/users', auth, role('admin'), adminController.getAllUsers);

/**
 * @swagger
 * /api/admin/user/{user_id}:
 *   get:
 *     tags:
 *       - Admin
 *     summary: Get User for Review
 *     description: Get specific user details for review (admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - User is not an admin
 *       404:
 *         description: User not found
 */
router.get('/user/:user_id', auth, role('admin'), adminController.getUserForReview);

/**
 * @swagger
 * /api/admin/user/{user_id}/approve:
 *   put:
 *     tags:
 *       - Admin
 *     summary: Approve User
 *     description: Approve a pending user (admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User approved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - User is not an admin
 *       404:
 *         description: User not found
 */
router.put('/user/:user_id/approve', auth, role('admin'), adminController.approveUser);

/**
 * @swagger
 * /api/admin/user/{user_id}/reject:
 *   put:
 *     tags:
 *       - Admin
 *     summary: Reject User
 *     description: Reject a pending user (admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reason:
 *                 type: string
 *                 description: Reason for rejection
 *     responses:
 *       200:
 *         description: User rejected successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - User is not an admin
 *       404:
 *         description: User not found
 */
router.put('/user/:user_id/reject', auth, role('admin'), adminController.rejectUser);

/**
 * @swagger
 * /api/admin/user/{user_id}/suspend:
 *   put:
 *     tags:
 *       - Admin
 *     summary: Suspend User
 *     description: Suspend a user account (admin only)
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: user_id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               reason:
 *                 type: string
 *                 description: Reason for suspension
 *     responses:
 *       200:
 *         description: User suspended successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - User is not an admin
 *       404:
 *         description: User not found
 */
router.put('/user/:user_id/suspend', auth, role('admin'), adminController.suspendUser);
router.delete('/user/:user_id', auth, role('admin'), adminController.deleteUser);

router.get('/orders', auth, role('admin'), adminController.getAllOrders);
router.put('/order/:id', auth, role('admin'), adminController.updateOrder);
router.delete('/order/:id', auth, role('admin'), adminController.deleteOrder);

router.get('/rfqs', auth, role('admin'), adminController.getAllRFQs);
router.post('/rfq', auth, role('admin'), adminController.createRFQ);
router.put('/rfq/:id', auth, role('admin'), adminController.updateRFQ);
router.delete('/rfq/:id', auth, role('admin'), adminController.deleteRFQ);

router.delete('/product/:id', auth, role('admin'), adminController.deleteProduct);

router.get('/quotations', auth, role('admin'), adminController.getAllQuotations);
router.put('/quotation/:id', auth, role('admin'), adminController.updateQuotation);

router.get('/messages', auth, role('admin'), adminController.getAllMessages);
router.get('/inbox', auth, role('admin'), adminController.getAllMessages);
router.delete('/message/:id', auth, role('admin'), adminController.deleteMessage);

router.get('/analytics', auth, role('admin'), adminController.getAnalytics);

module.exports = router;
