const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Setting = sequelize.define(
  "Setting",
  {
    instituteName: {
      type: DataTypes.STRING,
      defaultValue: "EduCore Institute",
    },

    adminName: {
      type: DataTypes.STRING,
      defaultValue: "Admin",
    },

    email: {
      type: DataTypes.STRING,
      defaultValue: "",
    },

    themeColor: {
      type: DataTypes.STRING,
      defaultValue: "#0b5c4b",
    },

    logo: {
      type: DataTypes.TEXT,
      defaultValue: "",
    },

    notifications: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  },
  {
    timestamps: true,
    tableName: "settings",
  }
);

module.exports = Setting;