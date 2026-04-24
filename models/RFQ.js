module.exports = (sequelize, DataTypes) => {
  const RFQ = sequelize.define('RFQ', {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    rfq_number: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('open', 'closed', 'awarded', 'cancelled'),
      defaultValue: 'open',
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    deadline: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  });

  return RFQ;
};
