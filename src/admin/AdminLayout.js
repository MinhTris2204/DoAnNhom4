import React, { useState, useEffect } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import "../css/AdminDashboard.css";

function AdminLayout() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      setLoading(false);
      navigate("/admin/login");
      return;
    }

    fetch("http://localhost:3001/api/admin/dashboard", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Token không hợp lệ!");
        }
        return response.json();
      })
      .then((data) => {
        setUserInfo(data.user);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Lỗi xác thực token: ", error);
        setError(error.message);
        setLoading(false);
        localStorage.removeItem("token");
        setTimeout(() => {
          navigate("/admin/login");
        }, 2000);
      });
  }, [token, navigate]);

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:3001/api/auth/logout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      localStorage.removeItem("token");
      setToken(null);
      setUserInfo(null);
      alert("Đăng xuất thành công!");
      navigate("/admin/login");
    } catch (error) {
      console.error("Lỗi khi đăng xuất:", error);
      alert("Có lỗi xảy ra khi đăng xuất!");
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  if (loading) return <div>Đang xác thực...</div>;
  if (error)
    return (
      <div>Lỗi: {error}. Bạn sẽ được chuyển hướng về trang đăng nhập...</div>
    );
  if (!token) return null;

  return (
    <div className="admin-dashboard">
      <header className="admin-header">
        <div className="header-left">
          <button className="sidebar-toggle-btn" onClick={toggleSidebar}>
            ☰
          </button>
          <Link to="/admin/dashboard" className="header-link">
            <h1>Trang Sức Việt Nam</h1>
          </Link>
        </div>
        <div className="user-info">
          {userInfo && (
            <span className="username">Xin chào, {userInfo.ten_dang_nhap}</span>
          )}
          <button onClick={handleLogout} className="logout-btn">
            Đăng xuất
          </button>
        </div>
      </header>
      <div className="dashboard-container">
        <aside className={`sidebar ${isSidebarOpen ? "open" : "closed"}`}>
          <h2>Quản lý</h2>
          <ul className="sidebar-menu">
            <li>
              <Link to="/admin/dashboard">Trang chủ</Link>
            </li>
            <li>
              <Link to="/admin/sanpham">Quản lý sản phẩm</Link>
            </li>
            <li>
              <Link to="/admin/nguoidung">Quản lý người dùng</Link>
            </li>
            <li>
              <Link to="/admin/donhang">Quản lý đơn hàng</Link>
            </li>
            <li>
              <Link to="/admin/baocao">Báo cáo doanh thu</Link>
            </li>
          </ul>
        </aside>
        <main className="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayout;
