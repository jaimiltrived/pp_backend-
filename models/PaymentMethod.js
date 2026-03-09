module.exports = (sequelize, DataTypes) => {
  const PaymentMethod = sequelize.define('PaymentMethod', {
    method_type: {
      type: DataTypes.ENUM('internet_banking', 'paypal', 'google_pay', 'other'),
      allowNull: false,
    },
    payment_identifier: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    is_default: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  });

  return PaymentMethod;
};
