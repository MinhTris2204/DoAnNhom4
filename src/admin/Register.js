import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../css//AdminRegister.css"; // Import file CSS mới
function Register() {
  const [formData, setFormData] = useState({
    ten_dang_nhap: "",
    mat_khau: "",
    email: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3001/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error);
      }

      alert("Đăng ký thành công! Vui lòng đăng nhập.");
      navigate("/admin/login");
    } catch (error) {
      console.error("Lỗi khi đăng ký:", error);
      alert(`Lỗi: ${error.message}`);
    }
  };

  return (
    <div className="register-container">
      <h1>Đăng ký Admin</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="ten_dang_nhap"
          placeholder="Tên đăng nhập"
          value={formData.ten_dang_nhap}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="mat_khau"
          placeholder="Mật khẩu"
          value={formData.mat_khau}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <button type="submit">Đăng ký</button>
      </form>
      <p>
        Đã có tài khoản? <Link to="/admin/login">Đăng nhập</Link>
      </p>
    </div>
  );
}

export default Register;
