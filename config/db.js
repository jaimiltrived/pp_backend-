const { Sequelize } = require('sequelize');
const config = require('./config.json').development;

const sequelize = new Sequelize(config.database, config.username, config.password, {
  host: config.host,
  dialect: config.dialect,
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.User = require('../models/User')(sequelize, Sequelize);
db.Product = require('../models/Product')(sequelize, Sequelize);
db.Order = require('../models/Order')(sequelize, Sequelize);

// Associations
db.Order.belongsTo(db.User, { foreignKey: 'userId' });
db.User.hasMany(db.Order, { foreignKey: 'userId' });

module.exports = db;
