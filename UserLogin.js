import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const UserLogin = ({ setIsAuthenticated }) => {
  // Nhận prop setIsAuthenticated từ parent component
  const [ten_dang_nhap, setTenDangNhap] = useState("");
  const [mat_khau, setMatKhau] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault(); // Ngăn form gửi yêu cầu mặc định (reload trang)

    // Kiểm tra xem tên đăng nhập hoặc mật khẩu có bị bỏ trống không
    if (!ten_dang_nhap || !mat_khau) {
      setError("Vui lòng điền đầy đủ thông tin!");
      return; // Thoát hàm nếu có lỗi
    }

    try {
      // Gửi yêu cầu POST tới API đăng nhập
      const response = await fetch("http://localhost:3001/api/user/login", {
        method: "POST", // Phương thức HTTP là POST
        headers: { "Content-Type": "application/json" }, // Định dạng dữ liệu gửi đi là JSON
        body: JSON.stringify({ ten_dang_nhap, mat_khau }), // Chuyển dữ liệu thành chuỗi JSON
      });

      // Kiểm tra nếu phản hồi từ server không thành công (mã trạng thái không phải 2xx)
      if (!response.ok) {
        const contentType = response.headers.get("content-type"); // Lấy loại nội dung của phản hồi
        if (contentType && contentType.includes("application/json")) {
          // Nếu phản hồi là JSON
          const data = await response.json(); // Lấy dữ liệu lỗi từ server
          throw new Error(data.error || "Đăng nhập không thành công!");
        } else {
          // Nếu phản hồi không phải JSON
          const text = await response.text();
          throw new Error(`Phản hồi không phải JSON: ${text.slice(0, 50)}...`);
        }
      }

      // Nếu thành công, lấy dữ liệu phản hồi từ server
      const data = await response.json();
      localStorage.setItem("token", data.token); // Lưu token vào localStorage
      localStorage.setItem("user", JSON.stringify(data.user)); // Lưu thông tin user vào localStorage
      setIsAuthenticated(true);
      alert(data.message); // Hiển thị thông báo thành công từ server (ví dụ: "Đăng nhập thành công")
      navigate("/"); // Chuyển hướng về trang chính ("/")
    } catch (err) {
      // Xử lý lỗi nếu có vấn đề khi gọi API (mạng, server, v.v.)
      console.error("Lỗi khi gọi API:", err); // Ghi log lỗi ra console để debug
      setError(err.message); // Hiển thị thông báo lỗi cho người dùng (ví dụ: "Tên đăng nhập hoặc mật khẩu không đúng")
    }
  };

  return (
    <div style={styles.container}>
      <h2>Đăng Nhập</h2>
      {error && <p style={styles.error}>{error}</p>}
      <form onSubmit={handleLogin} style={styles.form}>
        <div style={styles.formGroup}>
          <label>Tên đăng nhập:</label>
          <input
            type="text"
            value={ten_dang_nhap}
            onChange={(e) => setTenDangNhap(e.target.value)}
            required
            style={styles.input}
          />
        </div>
        <div style={styles.formGroup}>
          <label>Mật khẩu:</label>
          <input
            type="password"
            value={mat_khau}
            onChange={(e) => setMatKhau(e.target.value)}
            required
            style={styles.input}
          />
        </div>
        <button type="submit" style={styles.button}>
          Đăng Nhập
        </button>
      </form>
      <p>
        Chưa có tài khoản? <Link to="/dang-ky">Đăng ký ngay</Link>
      </p>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "400px",
    margin: "50px auto",
    padding: "20px",
    border: "1px solid #ccc",
    borderRadius: "5px",
    textAlign: "center",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  formGroup: {
    display: "flex",
    flexDirection: "column",
    textAlign: "left",
  },
  input: {
    padding: "10px",
    fontSize: "16px",
    borderRadius: "5px",
    border: "1px solid #ccc",
  },
  button: {
    padding: "10px",
    backgroundColor: "#b8860b",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  error: {
    color: "red",
  },
};

export default UserLogin;
