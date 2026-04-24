const { User, Order, Product, RFQ, Supplier, Quotation, RFQItem, Message, Organization, OrganizationInfo, PersonalInfo, sequelize } = require('../config/db');
const EmailService = require('../utils/EmailService');
const { Op } = require('sequelize');

// Get Dashboard Stats
exports.getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.count();
    const totalOrders = await Order.count();
    const totalProducts = await Product.count();
    const totalRFQs = await RFQ.count();
    
    const revenueResult = await Order.findAll({
      attributes: [[sequelize.fn('SUM', sequelize.col('totalAmount')), 'total']],
      where: { status: 'completed' },
      raw: true
    });
    const totalRevenue = parseFloat(revenueResult[0]?.total || 0);

    const priceResult = await Product.findAll({
      attributes: [[sequelize.fn('AVG', sequelize.col('price')), 'avg']],
      raw: true
    });
    const avgPrice = parseFloat(priceResult[0]?.avg || 0);

    const collectionsResult = await Product.findAll({
      attributes: [[sequelize.fn('COUNT', sequelize.fn('DISTINCT', sequelize.col('category'))), 'count']],
      raw: true
    });
    const collections = collectionsResult[0]?.count || 0;

    const recentActivity = await Order.findAll({
      limit: 5,
      order: [['createdAt', 'DESC']],
      include: [{ model: User, attributes: ['name', 'email'] }]
    });

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const chartData = await Order.findAll({
      attributes: [
        [sequelize.fn('DATE', sequelize.col('createdAt')), 'date'],
        [sequelize.fn('COUNT', sequelize.col('id')), 'count'],
        [sequelize.fn('SUM', sequelize.col('totalAmount')), 'revenue']
      ],
      where: {
        createdAt: { [Op.gte]: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
      },
      group: [sequelize.fn('DATE', sequelize.col('createdAt'))],
      order: [[sequelize.fn('DATE', sequelize.col('createdAt')), 'ASC']],
      raw: true
    });

    res.json({
      summary: {
        totalUsers,
        totalOrders,
        totalProducts,
        totalRFQs,
        totalRevenue,
        avgPrice,
        collections,
        activeSourcing: await RFQ.count({ where: { status: 'open' } }),
        validatedPartners: await User.count({ where: { status: 'active' } }),
      },
      chartData: chartData.map(d => ({
        date: d.date,
        count: d.count,
        revenue: parseFloat(d.revenue || 0)
      })),
      recentActivity,
      uptime: '99.98%',
      efficiencyScore: '94.2%'
    });
  } catch (error) {
    console.error('Stats Error:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
};

// Get pending users for approval
exports.getPendingUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      where: { account_status: 'pending_approval' },
      include: [
        { model: Organization },
        { model: PersonalInfo }
      ],
      attributes: { exclude: ['password'] }
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
};

// Get user details for review
exports.getUserForReview = async (req, res) => {
  try {
    const { user_id } = req.params;
    const user = await User.findOne({
      where: { 
        [Op.or]: [{ user_id: user_id }, { id: user_id }] 
      },
      include: [
        { model: Organization },
        { model: OrganizationInfo },
        { model: PersonalInfo }
      ]
    });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ message: 'User details retrieved', user });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
};

// Approve user
exports.approveUser = async (req, res) => {
  try {
    const { user_id } = req.params;
    const user = await User.findOne({ 
      where: { 
        [Op.or]: [{ user_id: user_id }, { id: user_id }] 
      } 
    });
    if (!user) return res.status(404).json({ error: 'User not found' });
    user.account_status = 'active';
    user.status = 'active';
    await user.save();
    await EmailService.sendApprovalNotification(user.email, 'APPROVED', 'Your account has been approved. Welcome!');
    res.json({ message: 'User approved successfully', user: { id: user.id, email: user.email, status: user.status } });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
};

// Reject user
exports.rejectUser = async (req, res) => {
  try {
    const { user_id } = req.params;
    const { rejection_reason } = req.body;
    const user = await User.findOne({ 
      where: { 
        [Op.or]: [{ user_id: user_id }, { id: user_id }] 
      } 
    });
    if (!user) return res.status(404).json({ error: 'User not found' });
    user.account_status = 'rejected';
    user.status = 'rejected';
    await user.save();
    await EmailService.sendApprovalNotification(user.email,'REJECTED', rejection_reason || 'Your account registration was rejected.');
    res.json({ message: 'User rejected successfully', user: { id: user.id, email: user.email, status: user.status } });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
};

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({ 
      include: [
        { model: Organization },
        { model: PersonalInfo }
      ],
      attributes: { exclude: ['password'] } 
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
};

// Suspend user
exports.suspendUser = async (req, res) => {
  try {
    const { user_id } = req.params;
    const user = await User.findOne({ 
      where: { 
        [Op.or]: [{ user_id: user_id }, { id: user_id }] 
      } 
    });
    if (!user) return res.status(404).json({ error: 'User not found' });
    user.account_status = 'suspended';
    await user.save();
    res.json({ message: 'User suspended successfully', user: { id: user.id, email: user.email, status: user.account_status } });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
};

// Delete user
exports.deleteUser = async (req, res) => {
  try {
    const { user_id } = req.params;
    const user = await User.findOne({ 
      where: { 
        [Op.or]: [{ user_id: user_id }, { id: user_id }] 
      } 
    });
    if (!user) return res.status(404).json({ error: 'User not found' });
    
    await user.destroy();
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
};

// Get all orders (admin only)
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({ order: [['createdAt', 'DESC']] });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update order
exports.updateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, totalAmount } = req.body;
    const order = await Order.findByPk(id);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    if (status) order.status = status;
    if (totalAmount) order.totalAmount = totalAmount;
    await order.save();
    res.json({ message: 'Order updated successfully', order });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete order
exports.deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findByPk(id);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    await order.destroy();
    res.json({ message: 'Order deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all RFQs (admin only)
exports.getAllRFQs = async (req, res) => {
  try {
    const rfqs = await RFQ.findAll({ order: [['createdAt', 'DESC']] });
    res.json(rfqs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create RFQ
exports.createRFQ = async (req, res) => {
  try {
    const { title, rfq_number, description, category, deadline } = req.body;
    
    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    const generatedNumber = rfq_number || `PP-RFQ-${Math.floor(Math.random() * 1000000)}`;

    const rfq = await RFQ.create({
      title,
      rfq_number: generatedNumber,
      description,
      category,
      status: 'open',
      deadline: deadline || new Date(new Date().setMonth(new Date().getMonth() + 1))
    });

    res.status(201).json({ message: 'RFQ created successfully', rfq });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update RFQ
exports.updateRFQ = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, title, category } = req.body;
    const rfq = await RFQ.findByPk(id);
    if (!rfq) return res.status(404).json({ error: 'RFQ not found' });
    if (status) rfq.status = status;
    if (title) rfq.title = title;
    if (category) rfq.category = category;
    await rfq.save();
    res.json({ message: 'RFQ updated successfully', rfq });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete RFQ
exports.deleteRFQ = async (req, res) => {
  try {
    const { id } = req.params;
    const rfq = await RFQ.findByPk(id);
    if (!rfq) return res.status(404).json({ error: 'RFQ not found' });
    await rfq.destroy();
    res.json({ message: 'RFQ deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete product
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    await product.destroy();
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all quotations
exports.getAllQuotations = async (req, res) => {
  try {
    const quotations = await Quotation.findAll({
      include: [
        { model: RFQ, as: 'RFQ' },
        { model: User, as: 'seller', attributes: ['name', 'email'] }
      ],
      order: [['createdAt', 'DESC']]
    });
    res.json(quotations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update quotation status
exports.updateQuotation = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const quotation = await Quotation.findByPk(id);
    if (!quotation) return res.status(404).json({ error: 'Quotation not found' });
    quotation.status = status;
    await quotation.save();
    res.json(quotation);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all messages
exports.getAllMessages = async (req, res) => {
  try {
    const messages = await Message.findAll({
      order: [['createdAt', 'DESC']]
    });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete message
exports.deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const message = await Message.findByPk(id);
    if (!message) return res.status(404).json({ error: 'Message not found' });
    await message.destroy();
    res.json({ message: 'Message deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Admin Analytics (Based on Excel structure)
exports.getAnalytics = async (req, res) => {
  try {
    const { timeRange, category } = req.query;
    const where = {};
    
    // Apply time range filter
    if (timeRange && timeRange !== 'all') {
      const now = new Date();
      let startDate;
      switch (timeRange) {
        case '7d': startDate = new Date(now.setDate(now.getDate() - 7)); break;
        case '30d': startDate = new Date(now.setDate(now.getDate() - 30)); break;
        case '90d': startDate = new Date(now.setDate(now.getDate() - 90)); break;
        case 'ytd': startDate = new Date(now.getFullYear(), 0, 1); break;
        default: break;
      }
      if (startDate) where.createdAt = { [Op.gte]: startDate };
    }

    // Apply category filter
    if (category && category !== 'all') {
      where.category = category;
    }

    const totalRFQs = await RFQ.count({ where });
    const openRFQs = await RFQ.count({ where: { ...where, status: 'open' } });
    const awardedRFQs = await RFQ.count({ where: { ...where, status: 'awarded' } });
    
    // Calculate potential savings
    const rfqItems = await RFQItem.findAll({
      include: [{
        model: RFQ,
        as: 'RFQ',
        where,
        include: [{ model: Quotation, as: 'quotations' }]
      }]
    });

    let totalPotentialSavings = 0;
    const partStats = rfqItems.map(item => {
      const quotes = item.RFQ?.quotations || [];
      const bestPrice = quotes.length > 0 ? Math.min(...quotes.map(q => q.unit_price)) : (item.target_price || 0);
      const comparisonPrice = item.comparison_price || (bestPrice * 1.25);
      const savings = (comparisonPrice - bestPrice) * item.quantity;
      if (savings > 0) totalPotentialSavings += savings;
      
      return {
        part_number: item.part_number || `P-${item.id}`,
        comparison_price: comparisonPrice,
        best_price: bestPrice,
        total_savings: savings
      };
    });

    // Get unique categories for filter options
    const categories = await RFQ.findAll({
      attributes: [[sequelize.fn('DISTINCT', sequelize.col('category')), 'category']],
      raw: true
    });
    const categoryOptions = categories.map(c => c.category).filter(c => c);

    res.json({
      summary: {
        totalRFQs,
        openRFQs,
        awardedRFQs,
        totalPotentialSavings: `$${totalPotentialSavings.toLocaleString()}`,
        efficiencyScore: '94.2%'
      },
      partAnalysis: partStats.slice(0, 10),
      filters: {
        categories: categoryOptions
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
