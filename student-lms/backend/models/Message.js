const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Message = sequelize.define(
  "Message",
  {
    senderName: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    senderRole: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    receiverName: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    receiverRole: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    subject: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    status: {
      type: DataTypes.ENUM("Unread", "Read"),
      defaultValue: "Unread",
    },
  },
  {
    timestamps: true,
    tableName: "messages",
  }
);

module.exports = Message;