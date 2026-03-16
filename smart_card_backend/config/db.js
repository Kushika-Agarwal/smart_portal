const mysql = require("mysql2");

const db = mysql.createPool({
  host:process.env.DB_HOST || "localhost",
  user:process.env.DB_USER || "root",
  password:process.env.DB_PASSWORD || "password",
  database:process.env.DB_NAME || "smart_card"
});

module.exports = db;