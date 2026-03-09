const { User } = require('../config/db');
const EmailService = require('../utils/EmailService');

// Get pending users for approval
exports.getPendingUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      where: { account_status: 'pending_approval' },
      attributes: { exclude: ['password'] }
    });

    res.json({
      message: 'Pending users retrieved',
      count: users.length,
      users
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
};

// Get user details for review
exports.getUserForReview = async (req, res) => {
  try {
    const { user_id } = req.params;

    const user = await User.findByPk(user_id, {
      include: [
        { model: 'Organization', as: 'organization' },
        { model: 'OrganizationInfo', as: 'organizationInfo' },
        { model: 'PersonalInfo', as: 'personalInfo' }
      ]
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      message: 'User details retrieved',
      user
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
};

// Approve user
exports.approveUser = async (req, res) => {
  try {
    const { user_id } = req.params;

    const user = await User.findByPk(user_id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update status
    user.account_status = 'active';
    user.status = 'active';
    await user.save();

    // Send approval email
    await EmailService.sendApprovalNotification(
      user.email,
      'APPROVED',
      'Your account has been approved. Welcome!'
    );

    res.json({
      message: 'User approved successfully',
      user: { id: user.id, email: user.email, status: user.status }
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
};

// Reject user
exports.rejectUser = async (req, res) => {
  try {
    const { user_id } = req.params;
    const { rejection_reason } = req.body;

    const user = await User.findByPk(user_id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update status
    user.account_status = 'rejected';
    user.status = 'rejected';
    await user.save();

    // Send rejection email
    await EmailService.sendApprovalNotification(
      user.email,
      'REJECTED',
      rejection_reason || 'Your account registration was rejected. Please resubmit with correct information.'
    );

    res.json({
      message: 'User rejected successfully',
      user: { id: user.id, email: user.email, status: user.status }
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
};

// Get all users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password'] }
    });

    res.json({
      message: 'All users retrieved',
      count: users.length,
      users
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
};

// Suspend user
exports.suspendUser = async (req, res) => {
  try {
    const { user_id } = req.params;

    const user = await User.findByPk(user_id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    user.account_status = 'suspended';
    await user.save();

    res.json({
      message: 'User suspended successfully',
      user: { id: user.id, email: user.email, status: user.account_status }
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
};
