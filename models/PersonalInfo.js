module.exports = (sequelize, DataTypes) => {
  const PersonalInfo = sequelize.define('PersonalInfo', {
    full_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    designation: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    national_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    tax_id: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    contact_phone: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  });

  return PersonalInfo;
};
