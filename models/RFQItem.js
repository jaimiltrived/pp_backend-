module.exports = (sequelize, DataTypes) => {
  const RFQItem = sequelize.define('RFQItem', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    part_number: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    target_price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    comparison_price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    bom_level: {
      type: DataTypes.INTEGER,
      defaultValue: 1,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  });

  return RFQItem;
};
