module.exports = (sequelize, DataTypes) => {
  const Organization = sequelize.define('Organization', {
    organization_type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    department: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    country: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    state: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    post_code: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  });

  return Organization;
};
