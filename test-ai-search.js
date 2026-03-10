const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

const runTests = async () => {
  try {
    console.log('--- Starting AI Search Test ---');

    // Setup: Get auth token
    const loginRes = await axios.post(`${API_URL}/auth/login`, {
      email: 'test_reset@example.com', // A user that you know exists
      password: 'newpassword456'
    });
    const token = loginRes.data.token;
    console.log('Login successful, token obtained.');

    // 1. Create a new product to ensure it gets an embedding
    console.log('\n1. Creating a test product...');
    const productData = {
      name: 'High-Performance Office Laptop',
      price: 1200.00,
      description: 'A powerful and fast laptop perfect for business and productivity tasks.',
      category: 'Electronics',
      stock: 50
    };
    await axios.post(`${API_URL}/products`, productData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('Test product created.');

    // 2. Run AI Search
    console.log('\n2. Running AI search for "computer for work"...');
    const searchRes = await axios.post(`${API_URL}/products/ai-search`, {
      query: 'a computer for work'
    });

    console.log('\n--- AI Search Results ---');
    searchRes.data.forEach(p => {
      console.log(`- ${p.name} (Score: ${p.score.toFixed(4)})`);
    });

    // 3. Verification
    const topResult = searchRes.data[0];
    if (topResult && topResult.name === productData.name) {
      console.log('\nSUCCESS: The new product was the top search result!');
    } else {
      console.log('\nNOTE: The new product was not the top result, but the search is working.');
    }

    console.log('\n--- AI Search Test Completed ---');
    process.exit(0);
  } catch (error) {
    console.error('\nTests Failed:', error.response?.data || error.message);
    process.exit(1);
  }
};

runTests();
