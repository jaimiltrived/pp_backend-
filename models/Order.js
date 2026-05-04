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
      type: DataTypes.TEXT('long'),
      allowNull: false,
      get() {
        const value = this.getDataValue('items');
        try { return typeof value === 'string' ? JSON.parse(value) : value; } catch (e) { return value; }
      },
      set(value) {
        this.setDataValue('items', typeof value === 'object' ? JSON.stringify(value) : value);
      }
    },
  });
  return Order;
};
