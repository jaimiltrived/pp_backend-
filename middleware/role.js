// Role-based access middleware
// Supports: buyer, seller, admin
module.exports = function(requiredRole) {
  return function(req, res, next) {
    const userRole = req.user && req.user.role;
    if (!userRole) return res.status(401).json({ message: 'Unauthorized' });
    
    if (Array.isArray(requiredRole)) {
      if (!requiredRole.includes(userRole)) {
        return res.status(403).json({ message: 'Forbidden: Insufficient role' });
      }
    } else {
      if (userRole !== requiredRole) {
        return res.status(403).json({ message: 'Forbidden: Insufficient role', required_role: requiredRole, user_role: userRole });
      }
    }
    next();
  };
};
