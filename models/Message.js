module.exports = (sequelize, DataTypes) => {
  const Message = sequelize.define('Message', {
    subject: {
      type: DataTypes.STRING,
      allowNull: false
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    sender_id: {
      type: DataTypes.STRING,
      allowNull: false
    },
    receiver_id: {
      type: DataTypes.STRING,
      allowNull: false
    },
    is_read: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    type: {
      type: DataTypes.ENUM('system', 'user', 'broadcast'),
      defaultValue: 'user'
    }
  });
  return Message;
};
