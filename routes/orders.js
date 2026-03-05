const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const auth = require('../middleware/auth');

router.post('/', auth, orderController.createOrder); // Requires auth to create order
router.get('/', auth, orderController.getUserOrders); // Requires auth to view user orders
router.get('/:id', auth, orderController.getOrderById); // Requires auth to view order
router.put('/:id/status', auth, orderController.updateOrderStatus); // Requires auth to update order status

module.exports = router;
