// src/admin/AdminDashboard.js
import React from "react";

function AdminDashboard() {
  return (
    <main className="main-content">
      <h2>Chào mừng đến với Trang chủ quản trị viên</h2>
      <section className="regulations">
        <h3>Quy định chung</h3>
        <ul>
          <li>Không được phép chia sẻ thông tin nội bộ ra bên ngoài.</li>
          <li>Chỉ sử dụng hệ thống cho mục đích công việc được phê duyệt.</li>
          <li>Mọi hành vi chỉnh sửa dữ liệu phải được ghi log đầy đủ.</li>
          <li>
            Tài khoản quản trị chỉ được sử dụng bởi cá nhân được cấp quyền.
          </li>
          <li>Báo cáo ngay lập tức mọi hoạt động đáng ngờ cho bộ phận IT.</li>
        </ul>
      </section>
    </main>
  );
}

export default AdminDashboard;
