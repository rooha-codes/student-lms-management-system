// backend/config/db.js
// ✅ FULL FIXED DATABASE CONFIG
// Replace complete file

const { Sequelize } = require("sequelize");

// =====================================
// 🔹 DATABASE CONNECTION
// =====================================
const sequelize = new Sequelize(
  process.env.DB_NAME || "student_lms", // your DB name
  process.env.DB_USER || "root",        // XAMPP default user
  process.env.DB_PASSWORD || "",        // XAMPP default password empty
  {
    host: process.env.DB_HOST || "localhost",
    dialect: "mysql",
    logging: false,
    port: process.env.DB_PORT || 3306,
  }
);

// =====================================
// 🔹 TEST CONNECTION
// =====================================
const connectDB = async () => {
  try {
    await sequelize.authenticate();

    console.log("✅ MySQL Connected Successfully");
    console.log(
      `📦 DB: ${process.env.DB_NAME || "student_lms"} | Host: ${
        process.env.DB_HOST || "localhost"
      }`
    );
  } catch (error) {
    console.log("❌ Database Connection Failed");
    console.log(error.message);

    // ✅ Clear human-readable message
    if (error.original?.code === "ECONNREFUSED") {
      console.log(
        "⚠️ MySQL is OFF. Open XAMPP Control Panel → Start MySQL."
      );
    }

    if (error.original?.code === "ER_BAD_DB_ERROR") {
      console.log(
        "⚠️ Database not found. Create database 'student_lms' in phpMyAdmin."
      );
    }
  }
};

connectDB();

module.exports = sequelize;