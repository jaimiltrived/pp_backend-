module.exports = (sequelize, DataTypes) => {
  const IndustryCode = sequelize.define('IndustryCode', {
    code: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  });

  return IndustryCode;
};
