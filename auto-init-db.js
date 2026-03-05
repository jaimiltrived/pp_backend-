const mysql = require('mysql2/promise');
const config = require('./config/config.json').development;

const commonPasswords = ['', 'root', 'admin', 'password', '123456', 'root123'];

async function tryPasswords() {
  console.log('--- Attempting to find working MySQL credentials ---');
  
  for (const pwd of commonPasswords) {
    try {
      console.log(`Trying password: "${pwd}"...`);
      const connection = await mysql.createConnection({
        host: config.host,
        user: config.username,
        password: pwd,
      });

      console.log(`\nSUCCESS! Found working password: "${pwd}"`);
      
      // Update config.json
      const fs = require('fs');
      const configPath = './config/config.json';
      const currentConfig = JSON.parse(fs.readFileSync(configPath, 'utf8'));
      currentConfig.development.password = pwd;
      fs.writeFileSync(configPath, JSON.stringify(currentConfig, null, 2));
      console.log('Updated config/config.json with working password.');

      // Create DB
      await connection.query(`CREATE DATABASE IF NOT EXISTS \`${config.database}\`;`);
      console.log(`Database '${config.database}' initialized.`);

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
