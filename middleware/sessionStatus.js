// Session/Account Status Middleware
const { User } = require('../config/db');

module.exports = async function(req, res, next) {
  try {
    const user = await User.findByPk(req.user.id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check account status
    if (user.account_status === 'suspended') {
      return res.status(403).json({ 
        error: 'Account suspended',
        message: 'Your account has been suspended due to multiple failed login attempts'
      });
    }

    if (user.account_status === 'rejected') {
      return res.status(403).json({ 
        error: 'Account rejected',
        message: 'Your account was rejected during verification',
        action: 'redirect_to_resubmit'
      });
    }

    if (user.account_status === 'pending_approval') {
      return res.status(403).json({ 
        error: 'Account pending approval',
        message: 'Your account is awaiting admin approval',
        action: 'show_waiting_screen'
      });
    }

    // Add user to request
    req.user = user;
    next();
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
};
