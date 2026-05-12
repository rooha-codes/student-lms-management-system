// backend/models/User.js

const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

// =====================================
// 🔹 USER MODEL FULL FIX
// =====================================
const User = sequelize.define(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },

    password: {
      // ✅ VERY IMPORTANT
      // Old DB may have short VARCHAR causing bcrypt hash cut issue
      type: DataTypes.STRING(255),
      allowNull: false,
    },

    role: {
      type: DataTypes.ENUM("student", "teacher", "admin"),
      defaultValue: "student",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = User;