const jwt = require('jsonwebtoken');
const { User } = require('../config/db');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) throw new Error('No token provided');

    const decoded = jwt.verify(token, (process.env.JWT_SECRET || '04f058abc86f6e6c016b595d68a1ec8f76609f81e931148e91240c46da68d10f'));
    const user = await User.findByPk(decoded.id);

    if (!user) throw new Error('User not found');

    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    res.status(401).send({ error: 'Please authenticate.' });
  }
};

module.exports = auth;
