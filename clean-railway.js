const mysql = require('mysql2/promise');

async function cleanRailway() {
  let connection;
  try {
    connection = await mysql.createConnection({
      host: 'junction.proxy.rlwy.net',
      user: 'root',
      password: 'aemqpvGbdlNCLcEEaHcQvcuxcIrnMbaE',
      database: 'pp_db',
      port: 46619,
      multipleStatements: true
    });
    console.log("Connected to Railway!");

    // Disable FK checks, drop all tables, re-enable
    await connection.query(`SET FOREIGN_KEY_CHECKS=0;`);

    const [tables] = await connection.query(`SHOW TABLES;`);
    if (tables.length === 0) {
      console.log("Database is already empty, Sequelize will create tables fresh.");
    } else {
      const tableNames = tables.map(t => Object.values(t)[0]);
      console.log(`Dropping ${tableNames.length} tables:`, tableNames.join(', '));
      for (const t of tableNames) {
        await connection.query(`DROP TABLE IF EXISTS \`${t}\`;`);
      }
      console.log("All tables dropped successfully!");
    }

    await connection.query(`SET FOREIGN_KEY_CHECKS=1;`);
    await connection.end();
    console.log("Done! Now Sequelize will create clean tables on next deploy.");
    process.exit(0);
  } catch (err) {
    console.error("Error:", err.message);
    process.exit(1);
  }
}
cleanRailway();
