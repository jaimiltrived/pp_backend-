const bcrypt = require('bcryptjs');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    user_id: {
      type: DataTypes.STRING(100),
      unique: true,
      allowNull: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING(191),
      allowNull: false,
      unique: true,
      lowercase: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    role: {
      type: DataTypes.ENUM('buyer', 'seller', 'admin'),
      allowNull: true,
    },
    onboarding_step: {
      type: DataTypes.INTEGER,
      defaultValue: 1, // 1-7 steps, 8 = completed
    },
    status: {
      type: DataTypes.ENUM('registered', 'role_selected', 'onboarding_in_progress', 'pending_approval', 'active', 'rejected', 'suspended'),
      defaultValue: 'registered',
    },
    email_verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    login_attempts: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    last_login: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    account_status: {
      type: DataTypes.ENUM('active', 'pending_approval', 'rejected', 'suspended'),
      defaultValue: 'pending_approval',
    },
    terms_accepted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    terms_accepted_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  });

  const hashPassword = async (user) => {
    if (user.changed('password') && user.password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(user.password, salt);
    }
  };

  const generateUserId = (user) => {
    if (!user.user_id) {
      const year = new Date().getFullYear();
      const random = Math.random().toString(36).substring(2, 7).toUpperCase();
      user.user_id = `PP-${year}-${random}`;
    }
  };

  User.beforeCreate(async (user) => {
    generateUserId(user);
    await hashPassword(user);
  });
  User.beforeUpdate(hashPassword);

  User.prototype.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
  };

  return User;
};
