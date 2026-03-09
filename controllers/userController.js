const { User, Organization, OrganizationInfo, PersonalInfo, PaymentMethod } = require('../config/db');

// Get User Profile
exports.profile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      include: [
        { model: Organization, as: 'organization' },
        { model: OrganizationInfo, as: 'organizationInfo' },
        { model: PersonalInfo, as: 'personalInfo' },
        { model: PaymentMethod, as: 'paymentMethods' }
      ]
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Don't send password
    const userProfile = user.toJSON();
    delete userProfile.password;

    res.json({
      message: 'Profile retrieved',
      user: userProfile
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
};

// Logout
exports.logout = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (user) {
      user.last_login = new Date();
      await user.save();
    }

    res.json({
      message: 'Logout successful',
      action: 'redirect_to_login'
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
};
