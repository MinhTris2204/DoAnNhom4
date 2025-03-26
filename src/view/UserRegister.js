import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const UserRegister = () => {
  const [ten_dang_nhap, setTenDangNhap] = useState("");
  const [mat_khau, setMatKhau] = useState("");
  const [email, setEmail] = useState("");
  const [ho_ten, setHoTen] = useState("");
  const [so_dien_thoai, setSoDienThoai] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault(); // Ngăn form gửi yêu cầu mặc định (reload trang)

    // Kiểm tra xem các trường có bị bỏ trống không
    if (!ten_dang_nhap || !mat_khau || !email || !ho_ten || !so_dien_thoai) {
      setError("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    // Kiểm tra độ dài của các trường dữ liệu
    if (
      ten_dang_nhap.length > 50 ||
      email.length > 100 ||
      ho_ten.length > 100 ||
      so_dien_thoai.length > 15
    ) {
      setError("Dữ liệu nhập vào quá dài!");
      return; // Thoát hàm nếu có lỗi
    }

    try {
      // Gửi yêu cầu POST tới API đăng ký
      const response = await fetch("http://localhost:3001/api/user/register", {
        method: "POST", // Phương thức HTTP là POST
        headers: { "Content-Type": "application/json" }, // Định dạng dữ liệu gửi đi là JSON
        body: JSON.stringify({
          // Chuyển dữ liệu thành chuỗi JSON
          ten_dang_nhap,
          mat_khau,
          email,
          ho_ten,
          so_dien_thoai,
        }),
      });

      // Kiểm tra nếu phản hồi từ server không thành công
      if (!response.ok) {
        const errorData = await response.json(); // Lấy thông tin lỗi từ server
        throw new Error(errorData.error || "Lỗi không xác định từ máy chủ");
      }

      // Nếu thành công, lấy dữ liệu phản hồi từ server
      const data = await response.json();
      alert(data.message); // Hiển thị thông báo thành công từ server (ví dụ: "Đăng ký thành công")
      navigate("/dang-nhap"); // Chuyển hướng tới trang đăng nhập
    } catch (err) {
      // Xử lý lỗi nếu có vấn đề khi gọi API
      console.error("Lỗi khi gọi API:", err);
      setError(err.message); // Hiển thị thông báo lỗi cho người dùng (ví dụ: "Email đã được sử dụng")
    }
  };

  return (
    <div style={styles.container}>
      <h2>Đăng Ký</h2>
      {error && <p style={styles.error}>{error}</p>}
      <form onSubmit={handleRegister} style={styles.form}>
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
        <div style={styles.formGroup}>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={styles.input}
          />
        </div>
        <div style={styles.formGroup}>
          <label>Họ tên:</label>
          <input
            type="text"
            value={ho_ten}
            onChange={(e) => setHoTen(e.target.value)}
            required
            style={styles.input}
          />
        </div>
        <div style={styles.formGroup}>
          <label>Số điện thoại:</label>
          <input
            type="text"
            value={so_dien_thoai}
            onChange={(e) => setSoDienThoai(e.target.value)}
            required
            style={styles.input}
          />
        </div>
        <button type="submit" style={styles.button}>
          Đăng Ký
        </button>
      </form>
      <p>
        Đã có tài khoản? <Link to="/dang-nhap">Đăng nhập ngay</Link>
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

export default UserRegister;
