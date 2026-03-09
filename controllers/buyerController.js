const { User } = require('../config/db');

// Buyer Dashboard
exports.dashboard = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);

    if (!user || user.status !== 'active') {
      return res.status(403).json({ error: 'User not approved' });
    }

    if (user.role !== 'buyer') {
      return res.status(403).json({ error: 'Insufficient role' });
    }

    res.json({
      message: 'Buyer Dashboard',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status
      },
      dashboard_data: {
        pending_rfqs: 0,
        active_suppliers: 0,
        total_purchases: 0,
        recent_orders: []
      },
      actions: ['Create RFQ', 'View Suppliers', 'Track Orders']
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
};
