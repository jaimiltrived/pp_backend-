const mysql = require('mysql2/promise');
const fs = require('fs');

async function importDb() {
  try {
    // Connect without selecting a database first to create it
    const connection = await mysql.createConnection({
      host: 'junction.proxy.rlwy.net',
      user: 'root',
      password: 'aemqpvGbdlNCLcEEaHcQvcuxcIrnMbaE',
      port: 46619,
      multipleStatements: true
    });
    console.log("Connected to Railway!");
    await connection.query("CREATE DATABASE IF NOT EXISTS pp_db;");
    await connection.query("USE pp_db;");
    console.log("Database pp_db ready. Importing data...");
    const sql = fs.readFileSync('purchase_point (5).sql', 'utf8');
    await connection.query(sql);
    console.log("SUCCESS! All data imported into Railway database.");
    await connection.end();
    process.exit(0);
  } catch (err) {
    console.error("Error:", err.message);
    process.exit(1);
  }
}
importDb();
