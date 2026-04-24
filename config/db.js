const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME || process.env.MYSQLDATABASE || 'pp_db',
  process.env.DB_USER || process.env.MYSQLUSER || 'root',
  process.env.DB_PASSWORD !== undefined ? process.env.DB_PASSWORD : (process.env.MYSQLPASSWORD || 'aemqpvGbdlNCLcEEaHcQvcuxcIrnMbaE'),
  {
    host: process.env.DB_HOST || process.env.MYSQLHOST || 'junction.proxy.rlwy.net',
    port: process.env.DB_PORT || process.env.MYSQLPORT || 46619,
    dialect: process.env.DB_DIALECT || 'mysql',
    logging: false,
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
db.Message = require('../models/Message')(sequelize, Sequelize);

// Associations
// User - Order
db.User.hasMany(db.Order, { foreignKey: 'UserId', onDelete: 'CASCADE' });
db.Order.belongsTo(db.User, { foreignKey: 'UserId' });

// User - Organization
db.User.hasOne(db.Organization, { foreignKey: 'UserId', onDelete: 'CASCADE' });
db.Organization.belongsTo(db.User, { foreignKey: 'UserId' });

// User - OrganizationInfo
db.User.hasOne(db.OrganizationInfo, { foreignKey: 'UserId', onDelete: 'CASCADE' });
db.OrganizationInfo.belongsTo(db.User, { foreignKey: 'UserId' });

// User - PersonalInfo
db.User.hasOne(db.PersonalInfo, { foreignKey: 'UserId', onDelete: 'CASCADE' });
db.PersonalInfo.belongsTo(db.User, { foreignKey: 'UserId' });

// User - PaymentMethod
db.User.hasMany(db.PaymentMethod, { foreignKey: 'UserId', onDelete: 'CASCADE' });
db.PaymentMethod.belongsTo(db.User, { foreignKey: 'UserId' });

// User - IndustryCode (Many-to-Many)
db.User.belongsToMany(db.IndustryCode, { through: db.UserIndustry });
db.IndustryCode.belongsToMany(db.User, { through: db.UserIndustry });

// RFQ Associations
db.User.hasMany(db.RFQ, { foreignKey: 'BuyerId', as: 'rfqs', onDelete: 'CASCADE' });
db.RFQ.belongsTo(db.User, { foreignKey: 'BuyerId', as: 'buyer' });

db.RFQ.hasMany(db.RFQItem, { foreignKey: 'RFQId', as: 'items' });
db.RFQItem.belongsTo(db.RFQ, { foreignKey: 'RFQId' });

db.RFQ.hasMany(db.Quotation, { foreignKey: 'RFQId', as: 'quotations' });
db.Quotation.belongsTo(db.RFQ, { foreignKey: 'RFQId', as: 'RFQ' });

db.User.hasMany(db.Quotation, { foreignKey: 'SellerId', as: 'sentQuotations', onDelete: 'CASCADE' });
db.Quotation.belongsTo(db.User, { foreignKey: 'SellerId', as: 'seller' });

// Supplier associations (for manual supplier entry if needed)
db.User.hasMany(db.Supplier, { foreignKey: 'BuyerId', as: 'suppliers' });
db.Supplier.belongsTo(db.User, { foreignKey: 'BuyerId' });

module.exports = db;
