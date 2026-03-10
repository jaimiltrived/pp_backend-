const mysql = require('mysql2/promise');
require('dotenv').config();

async function initDB() {
  const host = process.env.DB_HOST || 'localhost';
  const user = process.env.DB_USER || 'root';
  const password = process.env.DB_PASS || '';
  const database = process.env.DB_NAME || 'purchase_point';

  try {
    // Connect without specifying a database first
    const connection = await mysql.createConnection({
      host,
      user,
      password,
    });

    console.log(`Connected to MySQL at ${host} as ${user}`);

    // Create the database if it doesn't exist
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`);
    console.log(`Database '${database}' created or already exists.`);

    await connection.end();
    process.exit(0);
  } catch (error) {
    console.error('--- Initialization Failed ---');
    console.error('Error Code:', error.code);
    console.error('Message:', error.message);
    
    if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.log('\nTIP: The username or password in .env is incorrect.');
      console.log('Common defaults for local MySQL:');
      console.log(' - DB_USER: root, DB_PASS: (empty)');
      console.log(' - DB_USER: root, DB_PASS: root');
      console.log(' - DB_USER: root, DB_PASS: password');
    } else if (error.code === 'ECONNREFUSED') {
      console.log('\nTIP: MySQL server is not running or the host/port is wrong.');
    }
    
    process.exit(1);
  }
}

initDB();
