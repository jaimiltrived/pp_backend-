const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

const runTests = async () => {
  try {
    console.log('--- Starting Tests ---');

    // 1. Signup
    console.log('\n1. Testing Signup...');
    const signupRes = await axios.post(`${API_URL}/auth/signup`, {
      name: 'John Doe',
      email: `john${Date.now()}@example.com`,
      password: 'password123',
      confirm_password: 'password123'
    });
    console.log('Signup Successful:', signupRes.data.user.email);

    // 2. Login
    console.log('\n2. Testing Login...');
    const loginRes = await axios.post(`${API_URL}/auth/login`, {
      email: signupRes.data.user.email,
      password: 'password123'
    });
    console.log('Login Successful:', loginRes.data.user.email);
    const token = loginRes.data.token;

    // 2.1 Testing Apple Login (Simulated)
    console.log('\n2.1 Testing Apple Login (Simulated)...');
    const appleEmail = `apple${Date.now()}@example.com`;
    const appleRes = await axios.post(`${API_URL}/auth/login/apple`, {
      email: appleEmail,
      name: 'Apple Test User'
    });
    console.log('Apple Login Successful (New User):', appleRes.data.user.email);
    console.log('Action:', appleRes.data.action);

    // 3. Create Product
    console.log('\n3. Testing Product Creation...');
    const productRes = await axios.post(`${API_URL}/products`, {
      name: 'Test Product',
      price: 100,
      description: 'A test product description',
      category: 'Electronics',
      stock: 10
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('Product Created:', productRes.data.name);
    const productId = productRes.data.id;

    // 4. Create Order
    console.log('\n4. Testing Order Creation...');
    const orderRes = await axios.post(`${API_URL}/orders`, {
      items: [{ productId, quantity: 2 }]
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('Order Created. Total Amount:', orderRes.data.totalAmount);

    console.log('\n--- Tests Completed Successfully ---');
    process.exit(0);
  } catch (error) {
    console.error('\nTests Failed:', error.response?.data || error.message);
    process.exit(1);
  }
};

runTests();
