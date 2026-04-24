module.exports = (sequelize, DataTypes) => {
  const Quotation = sequelize.define('Quotation', {
    unit_price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    nre_cost: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.00,
    },
    delivery_days: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    terms: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('pending', 'accepted', 'rejected'),
      defaultValue: 'pending',
    },
  });

  return Quotation;
};
