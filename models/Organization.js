module.exports = (sequelize, DataTypes) => {
  const Organization = sequelize.define('Organization', {
    organization_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    organization_type: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    experience: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    id_proof: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    products_deal_with: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    supplier_type: {
      type: DataTypes.STRING,
      allowNull: true,
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
