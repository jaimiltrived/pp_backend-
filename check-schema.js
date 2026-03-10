const db = require('./config/db');

async function checkSchema() {
  try {
    const [results] = await db.sequelize.query('DESCRIBE products');
    console.log('Product Table Schema:');
    results.forEach(col => {
      console.log(`- ${col.Field}: ${col.Type} (Null: ${col.Null})`);
    });
    
    // Check if any product has embedding
    const products = await db.Product.findAll({ limit: 5 });
    console.log('\nSample Product Data:');
    products.forEach(p => {
      console.log(`- Product: ${p.name}`);
      console.log(`  Embedding type: ${typeof p.embedding}`);
      console.log(`  Is Buffer: ${Buffer.isBuffer(p.embedding)}`);
      if (p.embedding) {
        console.log(`  Constructor: ${p.embedding.constructor.name}`);
        console.log(`  Keys: ${Object.keys(p.embedding)}`);
      }
    });
    
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

checkSchema();
