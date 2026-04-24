const mysql = require('mysql2/promise');
const fs = require('fs');

async function importDb() {
  try {
    const connection = await mysql.createConnection({
      host: 'sql12.freesqldatabase.com',
      user: 'sql12824282',
      password: 'sdztZegsna',
      database: 'sql12824282',
      port: 3306,
      multipleStatements: true
    });
    console.log("Connected to remote DB.");
    const sql = fs.readFileSync('purchase_point (5).sql', 'utf8');
    console.log("Read SQL file, length:", sql.length);
    console.log("Executing SQL...");
    await connection.query(sql);
    console.log("SQL execution complete.");
    process.exit(0);
  } catch (err) {
    console.error("Error:", err);
    process.exit(1);
  }
}
importDb();
