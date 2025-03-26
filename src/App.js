// App.js
import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./view/Header.js";
import TrangChu from "./view/trangchu";
import GioiThieu from "./view/gioithieu";
import SanPham from "./view/sanpham";
import LienHe from "./view/lienhe";
import Footer from "./view/Footer";
import GioHang from "./view/giohang";
import ThanhToan from "./view/thanhtoan";
import TimKiem from "./view/TimKiem";
import AdminLayout from "./admin/AdminLayout";
import AdminDashboard from "./admin/AdminDashboard";
import AdminProductManagement from "./admin/AdminProductManagement";
import AdminNguoiDung from "./admin/AdminNguoiDung"; // Thêm import
import AdminDonHang from "./admin/AdminDonHang";
import AdminBaoCao from "./admin/AdminBaoCao";
import Register from "./admin/Register";
import Login from "./admin/Login";
import UserLogin from "./view/UserLogin.js";
import UserRegister from "./view/UserRegister.js";
import "./css/App.css";

// Layout cho trang khách hàng
const CustomerLayout = ({ children, cart, isAuthenticated, handleLogout }) => (
  <div className="container">
    <Header
      cart={cart}
      isAuthenticated={isAuthenticated}
      handleLogout={handleLogout}
    />
    <main className="content">{children}</main>
    <Footer />
  </div>
);

function App() {
  const [cart, setCart] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("token")
  );

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    window.location.href = "/dang-nhap";
  };

  return (
    <Routes>
      {/* Routes cho trang khách hàng */}
      <Route
        path="/"
        element={
          <CustomerLayout
            cart={cart}
            isAuthenticated={isAuthenticated}
            handleLogout={handleLogout}
          >
            <TrangChu />
          </CustomerLayout>
        }
      />
      <Route
        path="/gioi-thieu"
        element={
          <CustomerLayout
            cart={cart}
            isAuthenticated={isAuthenticated}
            handleLogout={handleLogout}
          >
            <GioiThieu />
          </CustomerLayout>
        }
      />
      <Route
        path="/san-pham"
        element={
          <CustomerLayout
            cart={cart}
            isAuthenticated={isAuthenticated}
            handleLogout={handleLogout}
          >
            <SanPham cart={cart} setCart={setCart} />
          </CustomerLayout>
        }
      />
      <Route
        path="/san-pham/:tenSanPham"
        element={
          <CustomerLayout
            cart={cart}
            isAuthenticated={isAuthenticated}
            handleLogout={handleLogout}
          >
            <SanPham cart={cart} setCart={setCart} />
          </CustomerLayout>
        }
      />
      <Route
        path="/lien-he"
        element={
          <CustomerLayout
            cart={cart}
            isAuthenticated={isAuthenticated}
            handleLogout={handleLogout}
          >
            <LienHe />
          </CustomerLayout>
        }
      />
      <Route
        path="/gio-hang"
        element={
          <CustomerLayout
            cart={cart}
            isAuthenticated={isAuthenticated}
            handleLogout={handleLogout}
          >
            <GioHang cart={cart} setCart={setCart} />
          </CustomerLayout>
        }
      />
      <Route
        path="/thanh-toan"
        element={
          <CustomerLayout
            cart={cart}
            isAuthenticated={isAuthenticated}
            handleLogout={handleLogout}
          >
            <ThanhToan cart={cart} setCart={setCart} />
          </CustomerLayout>
        }
      />
      <Route
        path="/tim-kiem"
        element={
          <CustomerLayout
            cart={cart}
            isAuthenticated={isAuthenticated}
            handleLogout={handleLogout}
          >
            <TimKiem cart={cart} setCart={setCart} />
          </CustomerLayout>
        }
      />
      <Route
        path="/dang-nhap"
        element={
          <CustomerLayout
            cart={cart}
            isAuthenticated={isAuthenticated}
            handleLogout={handleLogout}
          >
            <UserLogin setIsAuthenticated={setIsAuthenticated} />
          </CustomerLayout>
        }
      />
      <Route
        path="/dang-ky"
        element={
          <CustomerLayout
            cart={cart}
            isAuthenticated={isAuthenticated}
            handleLogout={handleLogout}
          >
            <UserRegister />
          </CustomerLayout>
        }
      />

      {/* Routes cho trang quản trị */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="sanpham" element={<AdminProductManagement />} />
        <Route path="nguoidung" element={<AdminNguoiDung />} />{" "}
        {/* Route mới */}
        <Route path="donhang" element={<AdminDonHang />} />
        <Route path="baocao" element={<AdminBaoCao />} />
      </Route>

      {/* Routes không cần xác thực */}
      <Route path="/admin/register" element={<Register />} />
      <Route
        path="/admin/login"
        element={<Login setIsAuthenticated={setIsAuthenticated} />}
      />
    </Routes>
  );
}

export default App;
