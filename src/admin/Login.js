import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../css/AdminLogin.css"; // Import file CSS mới
function Login({ setIsAuthenticated }) {
  // Khởi tạo state cho form đăng nhập
  const [formData, setFormData] = useState({
    ten_dang_nhap: "",
    mat_khau: "",
  });

  // Hook để điều hướng
  const navigate = useNavigate();

  // Xử lý thay đổi giá trị trong input
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Xử lý submit form đăng nhập
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Gửi yêu cầu đăng nhập đến backend
      const response = await fetch("http://localhost:3001/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      // Kiểm tra phản hồi từ server
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Đăng nhập thất bại");
      }

      // Lấy token từ phản hồi
      const { token } = await response.json();

      // Lưu token vào localStorage
      localStorage.setItem("token", token);

      // Cập nhật trạng thái isAuthenticated trong App.js
      if (typeof setIsAuthenticated === "function") {
        setIsAuthenticated(true);
      } else {
        console.warn(
          "setIsAuthenticated không phải là hàm, cập nhật thủ công không khả thi."
        );
      }

      // Hiển thị thông báo thành công
      alert("Đăng nhập thành công!");

      // Chuyển hướng đến dashboard
      navigate("/admin/dashboard");
    } catch (error) {
      // Xử lý lỗi và hiển thị thông báo
      console.error("Lỗi khi đăng nhập:", error);
      alert(`Lỗi: ${error.message}`);
    }
  };

  // Render giao diện đăng nhập
  return (
    <div className="login-container">
      <h1>Đăng nhập Admin</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="text"
            name="ten_dang_nhap"
            placeholder="Tên đăng nhập"
            value={formData.ten_dang_nhap}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            name="mat_khau"
            placeholder="Mật khẩu"
            value={formData.mat_khau}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Đăng nhập</button>
      </form>
      <p>
        Chưa có tài khoản? <Link to="/admin/register">Đăng ký</Link>
      </p>
    </div>
  );
}

export default Login;
