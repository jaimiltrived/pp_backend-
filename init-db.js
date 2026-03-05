const mysql = require('mysql2/promise');
const config = require('./config/config.json').development;

async function initDB() {
  try {
    // Connect without specifying a database first
    const connection = await mysql.createConnection({
      host: config.host,
      user: config.username,
      password: config.password,
    });

    console.log(`Connected to MySQL at ${config.host} as ${config.username}`);

    // Create the database if it doesn't exist
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${config.database}\`;`);
    console.log(`Database '${config.database}' created or already exists.`);

    await connection.end();
    process.exit(0);
  } catch (error) {
    console.error('--- Initialization Failed ---');
    console.error('Error Code:', error.code);
    console.error('Message:', error.message);
    
    if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.log('\nTIP: The username or password in config/config.json is incorrect.');
      console.log('Common defaults for local MySQL:');
      console.log(' - User: root, Password: (empty)');
      console.log(' - User: root, Password: root');
      console.log(' - User: root, Password: password');
    } else if (error.code === 'ECONNREFUSED') {
      console.log('\nTIP: MySQL server is not running or the host/port is wrong.');
    }
    
    process.exit(1);
  }
}

initDB();
