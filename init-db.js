const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function initDB() {
  const host = process.env.DB_HOST || 'localhost';
  const port = process.env.DB_PORT || 3306;
  const user = process.env.DB_USER || 'root';
  const password = process.env.DB_PASSWORD || '';
  const database = process.env.DB_NAME || 'purchase_point';

  console.log('\n--- MySQL Connection Details ---');
  console.log(`Host: ${host}:${port}`);
  console.log(`User: ${user}`);
  console.log(`Database: ${database}`);
  console.log('-----------------------------------\n');

  try {
    // Connect without specifying a database first
    const connectionConfig = {
      host,
      port: parseInt(port),
      user,
    };

    // Only add password if it's not empty
    if (password) {
      connectionConfig.password = password;
    }

    const connection = await mysql.createConnection(connectionConfig);

    console.log(`✓ Connected to MySQL at ${host}:${port} as ${user}`);

    // Create the database if it doesn't exist
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`);
    console.log(`✓ Database '${database}' created or already exists.`);

    // Switch to the new database
    await connection.query(`USE \`${database}\`;`);
    console.log(`✓ Using database '${database}'`);

    // Read and execute schema.sql
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    // Split the schema by semicolons and execute each statement
    const statements = schema
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

    let tableCount = 0;
    for (const statement of statements) {
      try {
        await connection.query(statement);
        if (statement.includes('CREATE TABLE')) {
          tableCount++;
        }
      } catch (err) {
        // Skip if table already exists
        if (err.code !== 'ER_TABLE_EXISTS_ERROR') {
          console.error('Error executing statement:', err.message);
        }
      }
    }

    console.log(`✓ Created ${tableCount} tables successfully`);
    console.log('\n--- Database Initialization Complete ---');
    console.log(`Database: ${database}`);
    console.log(`Host: ${host}:${port}`);
    console.log(`User: ${user}`);
    console.log('All tables created successfully!\n');

    await connection.end();
    process.exit(0);
  } catch (error) {
    console.error('\n--- Initialization Failed ---');
    console.error('Error Code:', error.code);
    console.error('Message:', error.message);
    
    if (error.code === 'ER_ACCESS_DENIED_ERROR') {
      console.log('\n❌ TIP: MySQL authentication failed');
      console.log('\nUpdate your .env file with correct credentials:');
      console.log('  DB_USER=root');
      console.log('  DB_PASSWORD=your_mysql_password');
      console.log('\nCommon default passwords:');
      console.log('  - Empty password (no password set)');
      console.log('  - "root"');
      console.log('  - "password"');
    } else if (error.code === 'ECONNREFUSED') {
      console.log('\n❌ TIP: MySQL server is not running.');
      console.log('Steps to fix:');
      console.log('  1. Start MySQL service (Services app or command line)');
      console.log('  2. Verify host and port in .env');
      console.log('  3. Run this script again');
    } else if (error.code === 'ENOENT') {
      console.log('\n❌ TIP: schema.sql file not found.');
      console.log('Make sure schema.sql exists in the project root.');
    }
    
    process.exit(1);
  }
}

initDB();
