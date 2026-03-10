const jwt = require('jsonwebtoken');
require('dotenv').config();

// Default values for a test token
const payload = {
  id: 1, // Default user ID
  role: 'admin' // Default role (could be 'buyer', 'seller', or 'admin')
};

const secret = process.env.JWT_SECRET || 'your_jwt_secret_key_here';
const options = { expiresIn: '7d' };

const token = jwt.sign(payload, secret, options);

console.log('\n--- Test JWT Token Generated ---');
console.log('Payload:', payload);
console.log('Token (Valid for 7 days):');
console.log(token);
console.log('\nUse this token in your API requests header as:');
console.log(`Authorization: Bearer ${token}`);
console.log('--------------------------------\n');
