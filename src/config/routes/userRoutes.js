// src/routes/userRoutes.js
const express = require("express");
const router = express.Router();
const pool = require("../config/db");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");

// Hàm băm mật khẩu bằng SHA-256
const hashPassword = (password) => {
  return crypto.createHash("sha256").update(password).digest("hex");
};

// Đăng ký
router.post("/register", async (req, res) => {
  const { ten_dang_nhap, mat_khau, email, ho_ten, so_dien_thoai } = req.body;

  try {
    // Kiểm tra xem tên đăng nhập hoặc email đã tồn tại chưa
    const [existingUser] = await pool.query(
      "SELECT * FROM nguoidung WHERE ten_dang_nhap = ? OR email = ?",
      [ten_dang_nhap, email]
    );

    if (existingUser.length > 0) {
      return res
        .status(400)
        .json({ message: "Tên đăng nhập hoặc email đã tồn tại!" });
    }

    // Mã hóa mật khẩu bằng SHA-256
    const hashedPassword = hashPassword(mat_khau);

    // Thêm người dùng mới vào cơ sở dữ liệu
    await pool.query(
      "INSERT INTO nguoidung (ten_dang_nhap, mat_khau, email, ho_ten, so_dien_thoai, ngay_tao) VALUES (?, ?, ?, ?, ?, NOW())",
      [ten_dang_nhap, hashedPassword, email, ho_ten, so_dien_thoai]
    );

    res.status(201).json({ message: "Đăng ký thành công!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Đã có lỗi xảy ra!" });
  }
});

// Đăng nhập
router.post("/login", async (req, res) => {
  const { ten_dang_nhap, mat_khau } = req.body;

  try {
    // Tìm người dùng theo tên đăng nhập
    const [user] = await pool.query(
      "SELECT * FROM nguoidung WHERE ten_dang_nhap = ?",
      [ten_dang_nhap]
    );

    if (user.length === 0) {
      return res
        .status(400)
        .json({ message: "Tên đăng nhập hoặc mật khẩu không đúng!" });
    }

    // Mã hóa mật khẩu nhập vào để so sánh
    const hashedPassword = hashPassword(mat_khau);

    // Kiểm tra mật khẩu
    if (hashedPassword !== user[0].mat_khau) {
      return res
        .status(400)
        .json({ message: "Tên đăng nhập hoặc mật khẩu không đúng!" });
    }

    // Tạo JWT token
    const token = jwt.sign(
      { id: user[0].ma_nguoi_dung, ten_dang_nhap: user[0].ten_dang_nhap },
      "your_jwt_secret",
      { expiresIn: "1h" }
    );

    res.status(200).json({ token, message: "Đăng nhập thành công!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Đã có lỗi xảy ra!" });
  }
});

// Đăng xuất (phía client sẽ xóa token, API này chỉ để minh họa)
router.post("/logout", (req, res) => {
  res.status(200).json({ message: "Đăng xuất thành công!" });
});

module.exports = router;
