const { Order, Product } = require('../config/db');

exports.createOrder = async (req, res) => {
  try {
    const { items } = req.body;
    let totalAmount = 0;

    for (let item of items) {
      const product = await Product.findByPk(item.productId);
      if (!product) return res.status(404).json({ error: `Product with id ${item.productId} not found` });
      if (product.stock < item.quantity) return res.status(400).json({ error: `Not enough stock for ${product.name}` });
      
      product.stock -= item.quantity;
      await product.save();

      totalAmount += product.price * item.quantity;
      item.price = product.price;
    }

    const order = await Order.create({
      userId: req.user.id,
      items,
      totalAmount,
    });

    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create order', details: error.message });
  }
};

exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({ where: { userId: req.user.id } });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findOne({ where: { id: req.params.id, userId: req.user.id } });
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const [updated] = await Order.update({ status }, { where: { id: req.params.id } });
    if (!updated) return res.status(404).json({ error: 'Order not found' });
    const updatedOrder = await Order.findByPk(req.params.id);
    res.json(updatedOrder);
  } catch (error) {
    res.status(400).json({ error: 'Failed to update order status' });
  }
};
