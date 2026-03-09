module.exports = (sequelize, DataTypes) => {
  const OrganizationInfo = sequelize.define('OrganizationInfo', {
    full_address: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    website: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    authorized_contact: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    contact_phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    tax_number: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    tax_registered: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  });

  return OrganizationInfo;
};
