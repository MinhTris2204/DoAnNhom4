require("dotenv").config(); // Đọc các biến từ file .env
const mysql = require("mysql2");

const pool = mysql
  .createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  })
  .promise(); // <-- Dùng promise()

pool
  .getConnection()
  .then((connection) => {
    console.log("Kết nối database thành công!");
    connection.release(); // Giải phóng kết nối
  })
  .catch((err) => {
    console.error("Lỗi kết nối database:", err.message);
  });

module.exports = pool;
