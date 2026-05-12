const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Result = sequelize.define(
  "Result",
  {
    studentName: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    className: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    course: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    subject: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    marksObtained: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    totalMarks: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 100,
    },

    percentage: {
      type: DataTypes.FLOAT,
      allowNull: false,
      defaultValue: 0,
    },

    grade: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "F",
    },

    status: {
      type: DataTypes.ENUM("Pass", "Fail"),
      allowNull: false,
      defaultValue: "Fail",
    },

    remarks: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
  },
  {
    timestamps: true,
    tableName: "results",
  }
);

module.exports = Result;