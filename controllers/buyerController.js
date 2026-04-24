const { User, RFQ, RFQItem, Quotation, Order, Organization, PersonalInfo, sequelize } = require('../config/db');
const { Op } = require('sequelize');

// Buyer Dashboard
exports.dashboard = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);

    if (!user || user.account_status !== 'active') {
      return res.status(403).json({ error: 'User not approved' });
    }

    if (user.role !== 'buyer') {
      return res.status(403).json({ error: 'Insufficient role' });
    }

    const total_rfqs = await RFQ.count({ where: { BuyerId: user.id } });
    
    // Count bids (quotations) for all RFQs of this buyer
    const rfqs = await RFQ.findAll({ where: { BuyerId: user.id }, attributes: ['id'] });
    const rfqIds = rfqs.map(r => r.id);
    const total_bids = await Quotation.count({ where: { RFQId: { [Op.in]: rfqIds } } });

    // Calculate total spend from completed orders
    const { Order } = require('../config/db');
    const orders = await Order.findAll({ 
      where: { UserId: user.id, status: 'completed' },
      attributes: [[sequelize.fn('SUM', sequelize.col('totalAmount')), 'total']],
      raw: true
    });
    const total_spend = parseFloat(orders[0]?.total || 0);

    const delivered_orders = await Order.count({ where: { UserId: user.id, status: 'completed' } });
    const pending_orders = await Order.count({ where: { UserId: user.id, status: 'pending' } });

    const recent_rfqs = await RFQ.findAll({
      where: { BuyerId: user.id },
      order: [['createdAt', 'DESC']],
      limit: 5,
      include: [{ model: Quotation, as: 'quotations', attributes: ['id'] }]
    });

    const formatted_recent_rfqs = recent_rfqs.map(r => ({
      ...r.toJSON(),
      bid_count: r.quotations?.length || 0
    }));

    res.json({
      message: 'Buyer Dashboard',
      total_rfqs,
      total_bids,
      total_spend: `$${total_spend.toLocaleString()}`,
      overdue_quotes: 0,
      delivered_orders,
      pending_orders,
      recent_rfqs: formatted_recent_rfqs,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status
      }
    });
  } catch (error) {
    console.error('Buyer Stats Error:', error);
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
};

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
      deadline: deadline || new Date(new Date().setMonth(new Date().getMonth() + 1)),
      BuyerId: req.user.id
    });

    res.status(201).json({ message: 'RFQ created successfully', rfq });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getBuyerRFQs = async (req, res) => {
  try {
    const rfqs = await RFQ.findAll({
      where: { BuyerId: req.user.id },
      order: [['createdAt', 'DESC']]
    });
    res.json(rfqs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAnalytics = async (req, res) => {
  try {
    const { timeRange, category } = req.query;
    const where = { BuyerId: req.user.id };
    
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
    
    // Calculate potential savings for this buyer with filters
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
      where: { BuyerId: req.user.id },
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

exports.getBuyerAwards = async (req, res) => {
  try {
    const awards = await Quotation.findAll({
      include: [{
        model: RFQ,
        as: 'RFQ',
        where: { BuyerId: req.user.id }
      }, {
        model: User,
        as: 'seller',
        attributes: ['name', 'email']
      }],
      where: { status: 'accepted' },
      order: [['updatedAt', 'DESC']]
    });
    res.json(awards);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getBuyerInvoices = async (req, res) => {
  try {
    const invoices = await Order.findAll({
      where: { UserId: req.user.id },
      order: [['createdAt', 'DESC']]
    });
    res.json(invoices);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getInvoiceDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const invoice = await Order.findOne({
      where: { id, UserId: req.user.id },
      include: [{
        model: User,
        include: [{ model: Organization }, { model: PersonalInfo }]
      }]
    });
    if (!invoice) return res.status(404).json({ error: 'Invoice not found' });
    res.json(invoice);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteInvoice = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Order.destroy({
      where: { id, UserId: req.user.id }
    });
    if (!deleted) return res.status(404).json({ error: 'Invoice not found or unauthorized' });
    res.json({ message: 'Invoice node decommissioned successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateRFQ = async (req, res) => {
  try {
    const { id } = req.params;
    const rfq = await RFQ.findOne({ where: { id, BuyerId: req.user.id } });
    if (!rfq) return res.status(404).json({ error: 'RFQ not found or unauthorized' });
    
    await rfq.update(req.body);
    res.json({ message: 'RFQ updated successfully', rfq });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteRFQ = async (req, res) => {
  try {
    const { id } = req.params;
    const rfq = await RFQ.findOne({ where: { id, BuyerId: req.user.id } });
    if (!rfq) return res.status(404).json({ error: 'RFQ not found or unauthorized' });

    await rfq.destroy();
    res.json({ message: 'RFQ decommissioned successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getBuyerEvents = async (req, res) => {
  try {
    const rfqs = await RFQ.findAll({ 
      where: { BuyerId: req.user.id }, 
      limit: 10, 
      order: [['createdAt', 'DESC']] 
    });
    const orders = await Order.findAll({ 
      where: { UserId: req.user.id }, 
      limit: 10, 
      order: [['createdAt', 'DESC']] 
    });
    
    const events = [
      ...rfqs.map(r => ({ type: 'RFQ', title: r.title, date: r.createdAt, status: r.status, id: r.id })),
      ...orders.map(o => ({ type: 'ORDER', title: `Order #${o.id}`, date: o.createdAt, status: o.status, id: o.id }))
    ].sort((a, b) => new Date(b.date) - new Date(a.date));

    res.json(events);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

