const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Student = sequelize.define(
  "Student",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Student name is required",
        },
      },
      set(value) {
        this.setDataValue("name", value?.trim());
      },
    },

    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        msg: "Email already exists",
      },
      validate: {
        isEmail: {
          msg: "Enter a valid email",
        },
        notEmpty: {
          msg: "Email is required",
        },
      },
      set(value) {
        this.setDataValue("email", value?.trim().toLowerCase());
      },
    },

    className: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Class is required",
        },
      },
    },

    age: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: {
          args: [3],
          msg: "Minimum age is 3",
        },
        max: {
          args: [100],
          msg: "Maximum age is 100",
        },
        isInt: {
          msg: "Age must be a number",
        },
      },
    },

    gender: {
      type: DataTypes.ENUM("Male", "Female", "Other"),
      allowNull: false,
      defaultValue: "Other",
    },

    course: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "",
    },

    status: {
      type: DataTypes.ENUM("Active", "Inactive"),
      allowNull: false,
      defaultValue: "Active",
    },

    image: {
      type: DataTypes.TEXT("long"),
      allowNull: true,
      defaultValue: "",
    },

    phone: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "",
      validate: {
        len: {
          args: [0, 20],
          msg: "Phone number too long",
        },
      },
    },

    address: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "",
    },
  },
  {
    timestamps: true,
    tableName: "students",
    indexes: [
      {
        unique: true,
        fields: ["email"],
      },
      {
        fields: ["className"],
      },
      {
        fields: ["course"],
      },
    ],
  }
);

module.exports = Student;