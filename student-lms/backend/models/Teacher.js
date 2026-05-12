const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Teacher = sequelize.define(
  "Teacher",
  {
    // ✅ ID
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },

    // ✅ Full Name
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Teacher name is required",
        },
      },
      set(value) {
        this.setDataValue("name", value?.trim());
      },
    },

    // ✅ Email
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

    // ✅ Subject
    subject: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Subject is required",
        },
      },
      set(value) {
        this.setDataValue("subject", value?.trim());
      },
    },

    // ✅ Qualification
    qualification: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: "",
    },

    // ✅ Experience (Years)
    experience: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validate: {
        min: {
          args: [0],
          msg: "Experience cannot be negative",
        },
        max: {
          args: [60],
          msg: "Experience too high",
        },
        isInt: {
          msg: "Experience must be a number",
        },
      },
    },

    // ✅ Phone
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

    // ✅ Status
    status: {
      type: DataTypes.ENUM("Active", "Inactive"),
      defaultValue: "Active",
    },

    // ✅ Image
    image: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: "",
    },

    // ✅ Role
    role: {
      type: DataTypes.STRING,
      defaultValue: "teacher",
    },
  },
  {
    timestamps: true,

    // ✅ Better table naming
    tableName: "teachers",

    // ✅ Index optimization
    indexes: [
      {
        unique: true,
        fields: ["email"],
      },
      {
        fields: ["subject"],
      },
    ],
  }
);

module.exports = Teacher;