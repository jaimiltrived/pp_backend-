const axios = require('axios');

const API_URL = 'http://localhost:5000/api';

const verifySmartCRUD = async () => {
  try {
    console.log('--- Verifying Smart CRUD Features ---');

    // 1. Test Smart List (search parameter)
    console.log('\n1. Testing smart list (GET /api/products?search=computer)...');
    const listRes = await axios.get(`${API_URL}/products?search=computer`);
    console.log(`Found ${listRes.data.length} results.`);
    if (listRes.data[0] && listRes.data[0].score) {
      console.log('SUCCESS: Smart list search is active.');
    }

    // 2. Test Smart Read (similar products)
    const firstProductId = listRes.data[0]?.id;
    if (firstProductId) {
      console.log(`\n2. Testing smart read (GET /api/products/${firstProductId})...`);
      const detailRes = await axios.get(`${API_URL}/products/${firstProductId}`);
      if (detailRes.data.similarProducts) {
        console.log(`SUCCESS: Found ${detailRes.data.similarProducts.length} similar products.`);
      }
    }

    console.log('\n--- Smart CRUD Verification Completed ---');
    process.exit(0);
  } catch (error) {
    console.error('\nVerification Failed:', error.response?.data || error.message);
    process.exit(1);
  }
};

verifySmartCRUD();
