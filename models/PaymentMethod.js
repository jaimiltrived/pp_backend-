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
    bank_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    account_no: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    ifsc_code: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    account_holder_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    bank_location: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  });

  return PaymentMethod;
};
