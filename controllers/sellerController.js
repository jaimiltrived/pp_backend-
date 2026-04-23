const { User, RFQ, Quotation, Message, sequelize } = require('../config/db');

// Seller Dashboard Stats
exports.dashboard = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user || user.status !== 'active') return res.status(403).json({ error: 'User not approved' });
    if (user.role !== 'seller') return res.status(403).json({ error: 'Insufficient role' });

    const totalBids = await Quotation.count({ where: { SellerId: req.user.id } });
    const pendingBids = await Quotation.count({ where: { SellerId: req.user.id, status: 'pending' } });
    const acceptedBids = await Quotation.count({ where: { SellerId: req.user.id, status: 'accepted' } });
    const openRFQsCount = await RFQ.count({ where: { status: 'open' } });
    const unreadMessages = await Message.count({ where: { receiver_id: req.user.id, is_read: false } });

    const recentBids = await Quotation.findAll({
      where: { SellerId: req.user.id },
      include: [{ model: RFQ, as: 'RFQ', attributes: ['id', 'title', 'rfq_number', 'status', 'category', 'deadline'] }],
      order: [['createdAt', 'DESC']],
      limit: 5
    });

    const openRFQs = await RFQ.findAll({
      where: { status: 'open' },
      order: [['createdAt', 'DESC']],
      limit: 5
    });

    res.json({
      user: { id: user.id, name: user.name, email: user.email, role: user.role, status: user.status },
      stats: { totalBids, pendingBids, acceptedBids, openRFQs: openRFQsCount, unreadMessages },
      recentBids,
      matches: openRFQs
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
};

// Get all Open RFQs for sellers to bid on
exports.getOpenRFQs = async (req, res) => {
  try {
    const rfqs = await RFQ.findAll({
      where: { status: 'open' },
      order: [['createdAt', 'DESC']]
    });
    res.json(rfqs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Submit a bid (Quotation) on an RFQ
exports.submitBid = async (req, res) => {
  try {
    const { rfq_id, unit_price, delivery_days, terms, nre_cost } = req.body;
    if (!rfq_id || !unit_price || !delivery_days) {
      return res.status(400).json({ error: 'rfq_id, unit_price and delivery_days are required' });
    }

    const rfq = await RFQ.findByPk(rfq_id);
    if (!rfq) return res.status(404).json({ error: 'RFQ not found' });
    if (rfq.status !== 'open') return res.status(400).json({ error: 'RFQ is no longer accepting bids' });

    // Check for duplicate bid
    const existing = await Quotation.findOne({ where: { RFQId: rfq_id, SellerId: req.user.id } });
    if (existing) return res.status(400).json({ error: 'You have already submitted a bid for this RFQ' });

    const quotation = await Quotation.create({
      unit_price,
      delivery_days,
      terms,
      nre_cost: nre_cost || 0,
      status: 'pending',
      RFQId: rfq_id,
      SellerId: req.user.id
    });

    res.status(201).json({ message: 'Bid submitted successfully', quotation });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get seller's own bids
exports.getMyBids = async (req, res) => {
  try {
    const bids = await Quotation.findAll({
      where: { SellerId: req.user.id },
      include: [{ model: RFQ, as: 'RFQ', attributes: ['id', 'title', 'rfq_number', 'status', 'category', 'deadline'] }],
      order: [['createdAt', 'DESC']]
    });
    res.json(bids);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get seller inbox (messages)
exports.getInbox = async (req, res) => {
  try {
    const messages = await Message.findAll({
      where: { receiver_id: req.user.id },
      order: [['createdAt', 'DESC']],
      limit: 20
    });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get seller analytics (historical data for charts)
exports.getAnalytics = async (req, res) => {
  try {
    const sellerId = req.user.id;
    const { timeRange, category } = req.query;
    const { Op } = require('sequelize');

    const quotationWhere = { SellerId: sellerId };
    
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
      if (startDate) quotationWhere.createdAt = { [Op.gte]: startDate };
    }

    // 1. Monthly Bid Activity
    const activeBids = await Quotation.findAll({
      where: quotationWhere,
      attributes: ['status', 'createdAt'],
      include: category && category !== 'all' ? [{
        model: RFQ,
        as: 'RFQ',
        where: { category }
      }] : []
    });

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyData = {};
    
    // Initialize last 6 months
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${months[d.getMonth()]}`;
      monthlyData[key] = { month: key, bids: 0, accepted: 0 };
    }

    activeBids.forEach(b => {
      const d = new Date(b.createdAt);
      const key = months[d.getMonth()];
      if (monthlyData[key]) {
        monthlyData[key].bids++;
        if (b.status === 'accepted') monthlyData[key].accepted++;
      }
    });

    // 2. Bid Status Breakdown
    const statusCounts = await Quotation.findAll({
      where: quotationWhere,
      attributes: ['status', [sequelize.fn('COUNT', sequelize.col('status')), 'count']],
      group: ['status'],
      include: category && category !== 'all' ? [{
        model: RFQ,
        as: 'RFQ',
        where: { category }
      }] : []
    });

    const statusPie = statusCounts.map(s => ({
      name: s.status.charAt(0).toUpperCase() + s.status.slice(1),
      value: parseInt(s.get('count'))
    }));

    // 3. Category Distribution
    const categoryBids = await Quotation.findAll({
      where: quotationWhere,
      include: [{ 
        model: RFQ, 
        as: 'RFQ', 
        attributes: ['category'],
        where: category && category !== 'all' ? { category } : {}
      }],
    });

    const catMap = {};
    categoryBids.forEach(b => {
      const cat = b.RFQ?.category || 'General';
      catMap[cat] = (catMap[cat] || 0) + 1;
    });

    const categoryData = Object.keys(catMap).map(cat => ({
      category: cat,
      bids: catMap[cat]
    })).sort((a, b) => b.bids - a.bids);

    // Get unique categories for filter options
    const allCategoryData = await RFQ.findAll({
      attributes: [[sequelize.fn('DISTINCT', sequelize.col('category')), 'category']],
      raw: true
    });
    const categoryOptions = allCategoryData.map(c => c.category).filter(c => c);

    res.json({
      monthlyActivity: Object.values(monthlyData),
      statusBreakdown: statusPie,
      categoryDistribution: categoryData,
      filters: {
        categories: categoryOptions
      }
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateBid = async (req, res) => {
  try {
    const { id } = req.params;
    const bid = await Quotation.findOne({ where: { id, SellerId: req.user.id } });
    if (!bid) return res.status(404).json({ error: 'Bid not found or unauthorized' });
    if (bid.status !== 'pending') return res.status(400).json({ error: 'Cannot update a non-pending bid' });

    await bid.update(req.body);
    res.json({ message: 'Bid updated successfully', bid });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteBid = async (req, res) => {
  try {
    const { id } = req.params;
    const bid = await Quotation.findOne({ where: { id, SellerId: req.user.id } });
    if (!bid) return res.status(404).json({ error: 'Bid not found or unauthorized' });
    if (bid.status !== 'pending') return res.status(400).json({ error: 'Cannot delete a non-pending bid' });

    await bid.destroy();
    res.json({ message: 'Bid decommissioned successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
