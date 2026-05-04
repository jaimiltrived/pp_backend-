const mysql = require('mysql2/promise');

async function fixTables() {
  try {
    const connection = await mysql.createConnection({
      host: 'sql12.freesqldatabase.com',
      user: 'sql12824282',
      password: 'sdztZegsna',
      database: 'sql12824282',
      port: 3306,
      multipleStatements: true
    });
    
    console.log("Connected to DB. Fixing duplicate tables...");
    
    const sql = `
      SET FOREIGN_KEY_CHECKS=0;
      
      -- Drop the empty uppercase tables that Sequelize automatically created
      DROP TABLE IF EXISTS IndustryCodes, Messages, Orders, OrganizationInfos, Organizations, OTPs, PaymentMethods, PersonalInfos, Products, Quotations, RFQItems, RFQs, Suppliers, UserIndustries, Users;
      
      -- Rename the lowercase tables (which contain your actual data) to exactly match Sequelize's expected names
      RENAME TABLE 
        industrycodes TO IndustryCodes,
        messages TO Messages,
        orders TO Orders,
        organizationinfos TO OrganizationInfos,
        organizations TO Organizations,
        otps TO OTPs,
        paymentmethods TO PaymentMethods,
        personalinfos TO PersonalInfos,
        products TO Products,
        quotations TO Quotations,
        rfqitems TO RFQItems,
        rfqs TO RFQs,
        suppliers TO Suppliers,
        userindustries TO UserIndustries,
        users TO Users;
        
      SET FOREIGN_KEY_CHECKS=1;
    `;
    
    await connection.query(sql);
    console.log("Success! Unwanted empty tables dropped and data tables renamed to match the backend.");
    process.exit(0);
  } catch (err) {
    console.error("Error:", err);
    process.exit(1);
  }
}
fixTables();
