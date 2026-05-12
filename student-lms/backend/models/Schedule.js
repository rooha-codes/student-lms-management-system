const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Schedule = sequelize.define(
  "Schedule",
  {
    title: {
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

    teacher: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },

    startTime: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    endTime: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    room: {
      type: DataTypes.STRING,
      defaultValue: "",
    },

    type: {
      type: DataTypes.ENUM("Lecture", "Lab", "Exam", "Meeting"),
      defaultValue: "Lecture",
    },

    status: {
      type: DataTypes.ENUM("Upcoming", "Completed", "Cancelled"),
      defaultValue: "Upcoming",
    },

    notes: {
      type: DataTypes.TEXT,
      defaultValue: "",
    },
  },
  {
    timestamps: true,
    tableName: "schedules",
  }
);

module.exports = Schedule;