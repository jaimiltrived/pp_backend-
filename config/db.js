const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME || 'purchase_point',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD !== undefined ? process.env.DB_PASSWORD : '',
  {
    host: process.env.DB_HOST || '127.0.0.1',
    port: process.env.DB_PORT || 3307,
    dialect: process.env.DB_DIALECT || 'mysql',
    logging: false, // Set to console.log to see SQL queries
  }
);

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.User = require('../models/User')(sequelize, Sequelize);
db.Product = require('../models/Product')(sequelize, Sequelize);
db.Order = require('../models/Order')(sequelize, Sequelize);
db.Organization = require('../models/Organization')(sequelize, Sequelize);
db.OrganizationInfo = require('../models/OrganizationInfo')(sequelize, Sequelize);
db.PersonalInfo = require('../models/PersonalInfo')(sequelize, Sequelize);
db.IndustryCode = require('../models/IndustryCode')(sequelize, Sequelize);
db.UserIndustry = require('../models/UserIndustry')(sequelize, Sequelize);
db.PaymentMethod = require('../models/PaymentMethod')(sequelize, Sequelize);
db.OTP = require('../models/OTP')(sequelize, Sequelize);
db.RFQ = require('../models/RFQ')(sequelize, Sequelize);
db.RFQItem = require('../models/RFQItem')(sequelize, Sequelize);
db.Quotation = require('../models/Quotation')(sequelize, Sequelize);
db.Supplier = require('../models/Supplier')(sequelize, Sequelize);

// Associations
// User - Order
db.User.hasMany(db.Order, { foreignKey: 'UserId' });
db.Order.belongsTo(db.User, { foreignKey: 'UserId' });

// User - Organization
db.User.hasOne(db.Organization, { foreignKey: 'UserId' });
db.Organization.belongsTo(db.User, { foreignKey: 'UserId' });

// User - OrganizationInfo
db.User.hasOne(db.OrganizationInfo, { foreignKey: 'UserId' });
db.OrganizationInfo.belongsTo(db.User, { foreignKey: 'UserId' });

// User - PersonalInfo
db.User.hasOne(db.PersonalInfo, { foreignKey: 'UserId' });
db.PersonalInfo.belongsTo(db.User, { foreignKey: 'UserId' });

// User - PaymentMethod
db.User.hasMany(db.PaymentMethod, { foreignKey: 'UserId' });
db.PaymentMethod.belongsTo(db.User, { foreignKey: 'UserId' });

// User - IndustryCode (Many-to-Many)
db.User.belongsToMany(db.IndustryCode, { through: db.UserIndustry });
db.IndustryCode.belongsToMany(db.User, { through: db.UserIndustry });

// RFQ Associations
db.User.hasMany(db.RFQ, { foreignKey: 'BuyerId', as: 'rfqs' });
db.RFQ.belongsTo(db.User, { foreignKey: 'BuyerId', as: 'buyer' });

db.RFQ.hasMany(db.RFQItem, { foreignKey: 'RFQId', as: 'items' });
db.RFQItem.belongsTo(db.RFQ, { foreignKey: 'RFQId' });

db.RFQ.hasMany(db.Quotation, { foreignKey: 'RFQId', as: 'quotations' });
db.Quotation.belongsTo(db.RFQ, { foreignKey: 'RFQId' });

db.User.hasMany(db.Quotation, { foreignKey: 'SellerId', as: 'sentQuotations' });
db.Quotation.belongsTo(db.User, { foreignKey: 'SellerId', as: 'seller' });

// Supplier associations (for manual supplier entry if needed)
db.User.hasMany(db.Supplier, { foreignKey: 'BuyerId', as: 'suppliers' });
db.Supplier.belongsTo(db.User, { foreignKey: 'BuyerId' });

module.exports = db;
