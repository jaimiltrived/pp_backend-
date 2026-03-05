const { User } = require('../config/db');
const jwt = require('jsonwebtoken');

exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Check if user already exists
    let user = await User.findOne({ where: { email } });
    if (user) return res.status(400).json({ error: 'User already exists' });

    user = await User.create({ name, email, password });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.status(201).json({ user, token });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user || !(await user.comparePassword(password))) {
      return res.status(400).json({ error: 'Invalid login credentials' });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.json({ user, token });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
};
