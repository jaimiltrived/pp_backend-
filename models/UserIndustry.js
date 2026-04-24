module.exports = (sequelize, DataTypes) => {
  const UserIndustry = sequelize.define('UserIndustry', {
    // This is a junction table between User and IndustryCode
  });

  return UserIndustry;
};
