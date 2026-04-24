const mysql = require('mysql2/promise');
const fs = require('fs');
require('dotenv').config();

const commonPasswords = ['', 'root', 'admin', 'password', '123456', 'root123'];

async function tryPasswords() {
  console.log('--- Attempting to find working MySQL credentials ---');
  
  const host = process.env.DB_HOST || '127.0.0.1';
  const user = process.env.DB_USER || 'root';
  const database = process.env.DB_NAME || 'purchase_point';

  for (const pwd of commonPasswords) {
    try {
      console.log(`Trying password: "${pwd}"...`);
      const connection = await mysql.createConnection({
        host,
        user,
        password: pwd,
      });

      console.log(`\nSUCCESS! Found working password: "${pwd}"`);
      
      // Update .env file
      const envPath = '.env';
      let envContent = fs.readFileSync(envPath, 'utf8');
      envContent = envContent.replace(/DB_PASS=.*/, `DB_PASS=${pwd}`);
      fs.writeFileSync(envPath, envContent);
      console.log('Updated .env with working password.');

      // Create DB
      await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`);
      console.log(`Database '${database}' initialized.`);

      await connection.end();
      console.log('\n--- Initialization Complete ---');
      process.exit(0);
    } catch (error) {
      if (error.code !== 'ER_ACCESS_DENIED_ERROR') {
        console.error('Fatal Error:', error.message);
        process.exit(1);
      }
      // Continue to next password
    }
  }

  console.error('\nFailed to connect with any common passwords.');
  console.log('Please manually update config/config.json with your root password.');
  process.exit(1);
}

tryPasswords();
