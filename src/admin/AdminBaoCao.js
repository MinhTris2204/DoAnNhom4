import React, { useState, useEffect } from "react";

function AdminBaoCao() {
  // Khai báo các state để quản lý dữ liệu
  const [report, setReport] = useState([]); // Lưu trữ dữ liệu báo cáo từ API
  const [filter, setFilter] = useState("day"); // Bộ lọc: theo ngày hoặc tháng
  const [loading, setLoading] = useState(true); // Trạng thái tải dữ liệu
  const [error, setError] = useState(null); // Lưu trữ thông báo lỗi nếu có
  const [viewMode, setViewMode] = useState("table"); // Chế độ xem: bảng hoặc biểu đồ

  // Tải dữ liệu báo cáo từ API
  useEffect(() => {
    const fetchReport = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token"); // Lấy token từ localStorage
        if (!token) throw new Error("Vui lòng đăng nhập để xem báo cáo!");

        // Gửi yêu cầu GET tới API với tham số `filter`
        const response = await fetch(
          `http://localhost:3001/api/admin/revenue?filter=${filter}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`, // Xác thực bằng token
              "Content-Type": "application/json",
            },
          }
        );

        // Kiểm tra phản hồi từ API
        if (!response.ok) {
          throw new Error("Không thể lấy dữ liệu báo cáo!");
        }

        const data = await response.json(); // Chuyển đổi dữ liệu JSON
        setReport(data); // Cập nhật state với dữ liệu báo cáo
      } catch (err) {
        console.error("Lỗi khi lấy báo cáo:", err);
        setError(err.message); // Lưu lỗi vào state
      } finally {
        setLoading(false); // Tắt trạng thái đang tải
      }
    };

    fetchReport(); // Gọi hàm tải dữ liệu
  }, [filter]); // Dependency: chạy lại khi `filter` thay đổi

  // Hàm xử lý thay đổi bộ lọc (ngày/tháng)
  const handleFilterChange = (e) => {
    setFilter(e.target.value); // Cập nhật giá trị bộ lọc
  };

  // Hàm xử lý thay đổi chế độ xem (bảng/biểu đồ)
  const handleViewModeChange = (e) => {
    setViewMode(e.target.value); // Cập nhật chế độ xem
  };

  // Hàm định dạng ngày/tháng cho hiển thị
  const formatDate = (period, filterType) => {
    const date = new Date(period);
    switch (filterType) {
      case "day":
        return date.toLocaleDateString("vi-VN", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }); // Định dạng ngày: DD/MM/YYYY
      case "month":
        return date.toLocaleDateString("vi-VN", {
          month: "long",
          year: "numeric",
        }); // Định dạng tháng: Tháng Năm
      default:
        return period; // Trả về nguyên gốc nếu không khớp
    }
  };

  // Tính giá trị doanh thu tối đa để làm chuẩn cho biểu đồ
  const maxRevenue = Math.max(
    ...report.map((item) => Number(item.totalRevenue)),
    1 // Đặt mặc định là 1 để tránh lỗi khi không có dữ liệu
  );

  // **Hàm hiển thị bảng báo cáo**
  const renderTable = () => (
    <table style={styles.reportTable}>
      <thead>
        <tr>
          <th style={styles.tableHeader}>
            {filter === "day" ? "Ngày" : "Tháng"}{" "}
            {/* Tiêu đề cột thay đổi theo bộ lọc */}
          </th>
          <th style={styles.tableHeader}>Tổng doanh thu (VND)</th>
          <th style={styles.tableHeader}>Số đơn hàng</th>
        </tr>
      </thead>
      <tbody>
        {report.map((item, index) => (
          <tr
            key={index}
            style={index % 2 === 0 ? styles.rowEven : styles.rowOdd} // Tô màu xen kẽ
          >
            <td style={styles.tableCell}>{formatDate(item.period, filter)}</td>
            <td style={styles.tableCell}>
              {Number(item.totalRevenue).toLocaleString("vi-VN")}{" "}
              {/* Định dạng số */}
            </td>
            <td style={styles.tableCell}>{item.orderCount}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );

  // **Hàm hiển thị biểu đồ cột**
  const renderChart = () => {
    return (
      <div style={styles.chartContainer}>
        <h3 style={styles.chartTitle}>
          Biểu đồ Doanh thu ({filter === "day" ? "Theo ngày" : "Theo tháng"})
        </h3>
        <div style={styles.chart}>
          {report.map((item, index) => {
            // Tính chiều cao cột dựa trên tỷ lệ doanh thu tối đa
            const barHeight = (Number(item.totalRevenue) / maxRevenue) * 200;
            return (
              <div key={index} style={styles.barWrapper}>
                <div
                  style={{
                    ...styles.bar,
                    height: `${barHeight}px`, // Chiều cao cột
                    backgroundColor: index % 2 === 0 ? "#4bc0c0" : "#36a2eb", // Màu xen kẽ
                  }}
                  title={`Doanh thu: ${Number(item.totalRevenue).toLocaleString(
                    "vi-VN"
                  )} VND`} // Hiển thị tooltip
                />
                <span style={styles.barLabel}>
                  {formatDate(item.period, filter)} {/* Nhãn dưới cột */}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Giao diện chính
  return (
    <div style={styles.adminBaoCao}>
      <h2>Báo cáo Doanh thu</h2>
      <div style={styles.filterSection}>
        {/* Bộ lọc ngày/tháng */}
        <label style={styles.filterLabel}>Lọc theo: </label>
        <select
          value={filter}
          onChange={handleFilterChange} // Gọi hàm khi thay đổi bộ lọc
          style={styles.select}
          disabled={loading} // Vô hiệu hóa khi đang tải
        >
          <option value="day">Theo ngày</option>
          <option value="month">Theo tháng</option>
        </select>
        {/* Chọn chế độ xem */}
        <label style={{ ...styles.filterLabel, marginLeft: "20px" }}>
          Chế độ xem:{" "}
        </label>
        <select
          value={viewMode}
          onChange={handleViewModeChange} // Gọi hàm khi thay đổi chế độ xem
          style={styles.select}
          disabled={loading} // Vô hiệu hóa khi đang tải
        >
          <option value="table">Bảng</option>
          <option value="chart">Biểu đồ cột</option>
        </select>
      </div>

      {/* Hiển thị trạng thái hoặc dữ liệu */}
      {loading ? (
        <div style={styles.loading}>Đang tải dữ liệu báo cáo...</div>
      ) : error ? (
        <div style={styles.error}>Lỗi: {error}</div>
      ) : report.length === 0 ? (
        <p style={styles.noData}>Chưa có dữ liệu doanh thu.</p>
      ) : viewMode === "table" ? (
        renderTable() // Hiển thị bảng
      ) : (
        renderChart() // Hiển thị biểu đồ
      )}
    </div>
  );
}

// Styles cho giao diện
const styles = {
  adminBaoCao: {
    padding: "20px",
    fontFamily: "Arial, sans-serif",
  },
  filterSection: {
    marginBottom: "20px",
    display: "flex",
    alignItems: "center",
  },
  filterLabel: {
    marginRight: "10px",
    fontWeight: "500",
  },
  select: {
    padding: "5px 10px",
    fontSize: "16px",
    borderRadius: "4px",
    border: "1px solid #ccc",
  },
  reportTable: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "20px",
  },
  tableHeader: {
    border: "1px solid #ddd",
    padding: "12px",
    textAlign: "left",
    backgroundColor: "#f4f4f4",
    fontWeight: "bold",
  },
  tableCell: {
    border: "1px solid #ddd",
    padding: "12px",
    textAlign: "left",
  },
  rowEven: {
    backgroundColor: "#f9f9f9",
  },
  rowOdd: {
    backgroundColor: "#fff",
  },
  chartContainer: {
    marginTop: "20px",
    textAlign: "center",
  },
  chartTitle: {
    marginBottom: "15px",
    fontSize: "18px",
  },
  chart: {
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-end",
    gap: "15px",
    maxWidth: "100%",
    overflowX: "auto",
    padding: "10px",
  },
  barWrapper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    width: "50px",
  },
  bar: {
    width: "40px",
    transition: "height 0.3s ease",
    borderRadius: "4px 4px 0 0",
  },
  barLabel: {
    marginTop: "5px",
    fontSize: "12px",
    textAlign: "center",
    wordWrap: "break-word",
    maxWidth: "50px",
  },
  loading: {
    textAlign: "center",
    color: "#666",
    padding: "20px",
  },
  error: {
    textAlign: "center",
    color: "#d32f2f",
    padding: "20px",
  },
  noData: {
    textAlign: "center",
    color: "#666",
    padding: "20px",
  },
};

export default AdminBaoCao;
