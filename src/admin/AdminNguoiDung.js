// admin/AdminNguoiDung.js
import React, { useState, useEffect } from "react";
import "../css/AdminNguoiDung.css";

function AdminNguoiDung() {
  const [users, setUsers] = useState([]); // State lưu danh sách người dùng
  const [loading, setLoading] = useState(true); // State kiểm tra trạng thái tải dữ liệu
  const [error, setError] = useState(null); // State lưu thông báo lỗi
  const [searchTerm, setSearchTerm] = useState(""); // State lưu từ khóa tìm kiếm
  const token = localStorage.getItem("token"); // Lấy token từ localStorage để xác thực

  // Lấy danh sách người dùng khi component mount
  useEffect(() => {
    fetchUsers(); // Gọi hàm lấy danh sách người dùng
  }, []);

  // Hàm lấy danh sách người dùng từ server
  const fetchUsers = async () => {
    try {
      const response = await fetch("http://localhost:3001/api/admin/users", {
        headers: {
          Authorization: `Bearer ${token}`, // Gửi token trong header để xác thực
        },
      });
      if (!response.ok) {
        // Kiểm tra nếu phản hồi không thành công
        throw new Error("Không thể lấy danh sách người dùng");
      }
      const data = await response.json(); // Chuyển phản hồi thành JSON
      setUsers(data); // Lưu danh sách người dùng vào state
      setLoading(false); // Tắt trạng thái tải
    } catch (err) {
      setError(err.message); // Lưu thông báo lỗi
      setLoading(false); // Tắt trạng thái tải
    }
  };

  // Hàm xử lý xóa người dùng
  const handleDelete = async (ma_nguoi_dung) => {
    if (window.confirm("Bạn có chắc muốn xóa người dùng này?")) {
      // Xác nhận trước khi xóa
      try {
        const response = await fetch(
          `http://localhost:3001/api/admin/users/${ma_nguoi_dung}`,
          {
            method: "DELETE", // Phương thức HTTP là DELETE
            headers: {
              Authorization: `Bearer ${token}`, // Gửi token trong header để xác thực
            },
          }
        );
        if (!response.ok) {
          // Kiểm tra nếu phản hồi không thành công
          throw new Error("Không thể xóa người dùng");
        }
        // Cập nhật danh sách người dùng sau khi xóa
        setUsers(users.filter((user) => user.ma_nguoi_dung !== ma_nguoi_dung));
        alert("Xóa người dùng thành công!"); // Thông báo thành công
      } catch (err) {
        setError(err.message); // Lưu thông báo lỗi
      }
    }
  };

  // Hàm xử lý tìm kiếm
  const handleSearch = (e) => {
    setSearchTerm(e.target.value); // Cập nhật từ khóa tìm kiếm
  };

  // Lọc danh sách người dùng dựa trên từ khóa tìm kiếm
  const filteredUsers = users.filter(
    (user) =>
      user.ten_dang_nhap.toLowerCase().includes(searchTerm.toLowerCase()) || // Tìm theo tên đăng nhập
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) || // Tìm theo email
      user.ho_ten.toLowerCase().includes(searchTerm.toLowerCase()) // Tìm theo họ tên
  );

  // Hiển thị trạng thái tải hoặc lỗi
  if (loading) return <div>Đang tải dữ liệu...</div>;
  if (error) return <div>Lỗi: {error}</div>;

  return (
    <div className="admin-users">
      <h2>Quản lý người dùng</h2>

      <div className="search-container">
        <input
          type="text"
          placeholder="Tìm kiếm theo tên, email hoặc họ tên..."
          value={searchTerm}
          onChange={handleSearch}
          className="search-input"
        />
      </div>

      <table className="users-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên đăng nhập</th>
            <th>Họ tên</th>
            <th>Email</th>
            <th>Số điện thoại</th>
            <th>Ngày tạo</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user) => (
            <tr key={user.ma_nguoi_dung}>
              <td>{user.ma_nguoi_dung}</td>
              <td>{user.ten_dang_nhap}</td>
              <td>{user.ho_ten}</td>
              <td>{user.email}</td>
              <td>{user.so_dien_thoai || "Chưa cập nhật"}</td>
              <td>{new Date(user.ngay_tao).toLocaleDateString()}</td>
              <td>
                <button
                  className="delete-btn"
                  onClick={() => handleDelete(user.ma_nguoi_dung)}
                >
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminNguoiDung;
