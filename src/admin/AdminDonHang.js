import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function AdminDonHang() {
  // Khai báo các state để quản lý dữ liệu
  const [orders, setOrders] = useState([]); // Lưu trữ toàn bộ đơn hàng từ API
  const [filteredOrders, setFilteredOrders] = useState([]); // Lưu trữ danh sách đơn hàng đã lọc
  const [loading, setLoading] = useState(true); // Trạng thái tải dữ liệu
  const [error, setError] = useState(null); // Lưu trữ thông báo lỗi nếu có
  const [searchTerm, setSearchTerm] = useState(""); // Giá trị ô tìm kiếm
  const navigate = useNavigate(); // Hook điều hướng của React Router

  //Tải danh sách đơn hàng từ API
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token"); // Lấy token từ localStorage
        if (!token) {
          throw new Error("Chưa đăng nhập. Vui lòng đăng nhập lại.");
        }

        // Gửi yêu cầu GET tới API để lấy danh sách đơn hàng
        const response = await fetch("http://localhost:3001/api/admin/orders", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`, // Xác thực bằng token
            "Content-Type": "application/json",
          },
        });

        // Kiểm tra phản hồi từ API
        if (!response.ok) {
          const errorData = await response.json();
          if (response.status === 401 || response.status === 403) {
            throw new Error(
              "Token không hợp lệ hoặc đã hết hạn. Vui lòng đăng nhập lại."
            );
          }
          throw new Error(errorData.error || "Không thể lấy dữ liệu đơn hàng!");
        }

        const data = await response.json(); // Chuyển đổi dữ liệu JSON
        setOrders(data); // Cập nhật state với danh sách đơn hàng
        setFilteredOrders(data); // Cập nhật danh sách lọc ban đầu
        setLoading(false); // Tắt trạng thái đang tải
      } catch (err) {
        console.error("Lỗi khi lấy đơn hàng:", err);
        setError(err.message); // Lưu lỗi vào state
        setLoading(false); // Tắt trạng thái đang tải
        if (err.message.includes("Token không hợp lệ")) {
          localStorage.removeItem("token"); // Xóa token nếu không hợp lệ
          navigate("/dang-nhap"); // Chuyển hướng về trang đăng nhập
        }
      }
    };

    fetchOrders(); // Gọi hàm tải dữ liệu
  }, [navigate]);

  // **Hàm xử lý tìm kiếm đơn hàng**
  // Lọc đơn hàng dựa trên từ khóa nhập vào ô tìm kiếm
  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase(); // Lấy giá trị tìm kiếm và chuyển về chữ thường
    setSearchTerm(term); // Cập nhật state ô tìm kiếm

    // Lọc danh sách đơn hàng dựa trên các trường dữ liệu
    const filtered = orders.filter(
      (order) =>
        [
          String(order.ma_don_hang || ""),
          String(order.ma_san_pham || ""),
          String(order.ten_san_pham || ""),
          String(order.ho_ten || ""),
          String(order.dia_chi || ""),
          String(order.so_dien_thoai || ""),
        ].some((field) => field.toLowerCase().includes(term)) // Kiểm tra từ khóa trong các trường
    );
    setFilteredOrders(filtered); // Cập nhật danh sách đơn hàng đã lọc
  };

  // Hiển thị giao diện khi đang tải dữ liệu
  if (loading)
    return <div style={styles.loading}>Đang tải dữ liệu đơn hàng...</div>;

  // Hiển thị thông báo lỗi nếu có
  if (error) return <div style={styles.error}>Lỗi: {error}</div>;

  // Giao diện chính: Hiển thị bảng danh sách đơn hàng
  return (
    <div style={styles.adminDonHang}>
      <h2>Quản lý Đơn hàng</h2>
      <div style={styles.searchContainer}>
        {/* Ô tìm kiếm */}
        <input
          type="text"
          placeholder="Tìm kiếm đơn hàng (mã, sản phẩm, khách hàng...)"
          value={searchTerm}
          onChange={handleSearch} // Gọi hàm tìm kiếm khi người dùng nhập
          style={styles.searchInput}
        />
      </div>
      {filteredOrders.length === 0 ? (
        <p>Không tìm thấy đơn hàng nào.</p>
      ) : (
        // Bảng hiển thị danh sách đơn hàng
        <table style={styles.orderTable}>
          <thead>
            <tr>
              <th style={styles.tableHeader}>Mã đơn hàng</th>
              <th style={styles.tableHeader}>Mã sản phẩm</th>
              <th style={styles.tableHeader}>Tên sản phẩm</th>
              <th style={styles.tableHeader}>Giá sản phẩm</th>
              <th style={styles.tableHeader}>Họ tên</th>
              <th style={styles.tableHeader}>Địa chỉ</th>
              <th style={styles.tableHeader}>Số điện thoại</th>
              <th style={styles.tableHeader}>Tổng tiền</th>
              <th style={styles.tableHeader}>Ngày đặt hàng</th>
              <th style={styles.tableHeader}>Hình thức thanh toán</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order, index) => (
              <tr
                key={order.ma_don_hang}
                style={index % 2 === 0 ? styles.rowEven : styles.rowOdd} // Tô màu xen kẽ các dòng
              >
                <td style={styles.tableCell}>{order.ma_don_hang}</td>
                <td style={styles.tableCell}>{order.ma_san_pham}</td>
                <td style={styles.tableCell}>{order.ten_san_pham}</td>
                <td style={styles.tableCell}>
                  {Number(order.gia_san_pham).toLocaleString()} VND{" "}
                  {/* Định dạng số */}
                </td>
                <td style={styles.tableCell}>{order.ho_ten}</td>
                <td style={styles.tableCell}>{order.dia_chi}</td>
                <td style={styles.tableCell}>{order.so_dien_thoai}</td>
                <td style={styles.tableCell}>
                  {Number(order.tong_tien).toLocaleString()} VND{" "}
                  {/* Định dạng số */}
                </td>
                <td style={styles.tableCell}>
                  {new Date(order.ngay_dat_hang).toLocaleString()}{" "}
                  {/* Định dạng ngày giờ */}
                </td>
                <td style={styles.tableCell}>
                  {order.hinh_thuc_thanh_toan === "chuyen_khoan"
                    ? "Chuyển khoản"
                    : "Tiền mặt"}{" "}
                  {/* Hiển thị hình thức thanh toán */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

// Styles cho giao diện
const styles = {
  adminDonHang: {
    padding: "20px",
    maxWidth: "1200px",
    margin: "0 auto",
  },
  searchContainer: {
    marginBottom: "20px",
  },
  searchInput: {
    width: "100%",
    maxWidth: "400px",
    padding: "10px",
    fontSize: "16px",
    border: "1px solid #ddd",
    borderRadius: "4px",
  },
  orderTable: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "20px",
  },
  tableHeader: {
    border: "1px solid #ddd",
    padding: "10px",
    textAlign: "left",
    backgroundColor: "#f4f4f4",
    fontWeight: "bold",
  },
  tableCell: {
    border: "1px solid #ddd",
    padding: "10px",
    textAlign: "left",
  },
  rowEven: {
    backgroundColor: "#f9f9f9",
  },
  rowOdd: {
    backgroundColor: "#fff",
  },
  loading: {
    textAlign: "center",
    padding: "20px",
    fontSize: "18px",
  },
  error: {
    textAlign: "center",
    padding: "20px",
    color: "red",
    fontSize: "18px",
  },
};

export default AdminDonHang;
