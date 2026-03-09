const { User } = require('../config/db');

// Seller Dashboard
exports.dashboard = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);

    if (!user || user.status !== 'active') {
      return res.status(403).json({ error: 'User not approved' });
    }

    if (user.role !== 'seller') {
      return res.status(403).json({ error: 'Insufficient role' });
    }

    res.json({
      message: 'Seller Dashboard',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status
      },
      dashboard_data: {
        assigned_rfqs: 0,
        pending_quotations: 0,
        total_earnings: 0,
        recent_rfqs: []
      },
      actions: ['View RFQs', 'Submit Quotation', 'Track Earnings']
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
};
