// Onboarding Step Guard Middleware
const { User } = require('../config/db');

module.exports = function(requiredStep) {
  return async function(req, res, next) {
    try {
      const user = await User.findByPk(req.user.id);
      
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      if (user.onboarding_step !== requiredStep) {
        return res.status(403).json({ 
          error: 'Invalid onboarding step',
          current_step: user.onboarding_step,
          required_step: requiredStep,
          message: 'Complete previous steps first'
        });
      }

      next();
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
  };
};
