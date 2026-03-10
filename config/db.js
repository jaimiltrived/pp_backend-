const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME || 'purchase_point',
  process.env.DB_USER || 'root',
  process.env.DB_PASS !== undefined ? process.env.DB_PASS : '',
  {
    host: process.env.DB_HOST || 'localhost',
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

// Associations
// User - Order
db.User.hasMany(db.Order, { foreignKey: 'userId' });
db.Order.belongsTo(db.User, { foreignKey: 'userId' });

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

module.exports = db;
