module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define('Order', {
    totalAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('pending', 'processing', 'completed', 'cancelled'),
      defaultValue: 'pending',
    },
    items: {
      type: DataTypes.JSON,
      allowNull: false,
    },
  });
  return Order;
};
