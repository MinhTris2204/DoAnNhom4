import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../css/GioHang.css";

function GioHang({ cart, setCart }) {
  const navigate = useNavigate();
  const BASE_URL = "http://localhost:3001";
  const [cartData, setCartData] = useState([]);

  // Hàm định dạng giá tiền
  const formatPrice = (price) => {
    if (price == null || isNaN(Number(price))) {
      // Kiểm tra nếu giá không hợp lệ
      return "N/A"; // Trả về "N/A" nếu không có giá
    }
    return Number(price).toLocaleString("vi-VN") + " VND"; // Định dạng giá theo kiểu Việt Nam (VD: 1.000.000 VND)
  };

  // Cập nhật số lượng sản phẩm
  const updateQuantity = (maGioHang, maSanPham, newQuantity) => {
    if (newQuantity < 0) return; // Không cho số lượng nhỏ hơn 0

    if (newQuantity === 0) {
      // Nếu số lượng bằng 0
      // Xóa sản phẩm khỏi giỏ hàng
      const updatedCart = cartData.filter(
        (item) => item.ma_san_pham !== maSanPham
      );
      setCartData(updatedCart); // Cập nhật state cartData
      setCart(updatedCart); // Cập nhật state cart từ props

      // Gửi yêu cầu xóa lên server
      axios
        .delete(`${BASE_URL}/giohang/${maGioHang}/${maSanPham}`) // Gửi yêu cầu DELETE tới API
        .then(() => {
          console.log(`Đã xóa sản phẩm ${maSanPham} khỏi giỏ hàng`); // Log thành công
        })
        .catch((error) => {
          console.error("Lỗi khi xóa sản phẩm:", error); // Log lỗi nếu có
        });
    } else {
      // Nếu số lượng lớn hơn 0
      // Cập nhật số lượng sản phẩm
      const updatedCart = cartData.map((item) =>
        item.ma_san_pham === maSanPham
          ? { ...item, so_luong: newQuantity } // Cập nhật số lượng mới
          : item
      );
      setCartData(updatedCart); // Cập nhật state cartData
      setCart(updatedCart); // Cập nhật state cart từ props

      // Gửi yêu cầu cập nhật số lượng lên server
      axios
        .put(`${BASE_URL}/giohang/${maGioHang}/${maSanPham}`, {
          so_luong: newQuantity, // Dữ liệu gửi đi: số lượng mới
        })
        .then(() => {
          console.log(`Đã cập nhật số lượng sản phẩm ${maSanPham}`); // Log thành công
        })
        .catch((error) => {
          console.error("Lỗi khi cập nhật số lượng:", error); // Log lỗi nếu có
        });
    }
  };

  // Tính tổng tiền
  const totalPrice = cartData.reduce((sum, item) => {
    return sum + Number(item.gia_san_pham || 0) * (item.so_luong || 1); // Tính tổng: giá * số lượng
  }, 0);

  // Chuyển đến trang thanh toán
  const handleCheckout = () => {
    if (cartData.length > 0) {
      // Kiểm tra giỏ hàng có sản phẩm không
      setCart(cartData); // Cập nhật cart trước khi chuyển trang
      navigate("/thanh-toan"); // Chuyển hướng tới trang thanh toán
    } else {
      alert("Giỏ hàng trống! Vui lòng thêm sản phẩm."); // Thông báo nếu giỏ hàng trống
    }
  };

  // Lấy dữ liệu giỏ hàng từ API và gộp sản phẩm trùng khi component mount
  useEffect(() => {
    axios
      .get(`${BASE_URL}/giohang`) // Gửi yêu cầu GET tới API để lấy giỏ hàng
      .then((response) => {
        const apiCart = response.data; // Lấy dữ liệu từ API

        // Gộp sản phẩm trùng từ props cart
        const mergedCart = [];
        cart.forEach((item) => {
          const existingItem = mergedCart.find(
            (cartItem) => cartItem.ma_san_pham === item.ma_san_pham
          );
          if (existingItem) {
            // Nếu sản phẩm đã tồn tại trong mergedCart
            existingItem.so_luong += item.so_luong || 1; // Tăng số lượng
          } else {
            // Nếu sản phẩm chưa tồn tại
            const apiItem = apiCart.find(
              (api) => api.ma_san_pham === item.ma_san_pham
            );
            mergedCart.push({
              ...item,
              so_luong: apiItem ? apiItem.so_luong : item.so_luong || 1, // Lấy số lượng từ API hoặc mặc định
              ma_gio_hang: apiItem ? apiItem.ma_gio_hang : null, // Lấy mã giỏ hàng từ API
            });
          }
        });

        setCartData(mergedCart); // Cập nhật state cartData
        setCart(mergedCart); // Cập nhật state cart từ props
      })
      .catch((error) => {
        console.error("Lỗi khi lấy giỏ hàng:", error); // Log lỗi nếu có
        // Gộp sản phẩm trùng ngay cả khi API lỗi
        const mergedCart = [];
        cart.forEach((item) => {
          const existingItem = mergedCart.find(
            (cartItem) => cartItem.ma_san_pham === item.ma_san_pham
          );
          if (existingItem) {
            existingItem.so_luong += item.so_luong || 1;
          } else {
            mergedCart.push({ ...item, so_luong: item.so_luong || 1 });
          }
        });
        setCartData(mergedCart); // Cập nhật state cartData
      });
  }, [cart, setCart]); // Chạy lại khi cart hoặc setCart thay đổi

  return (
    <div className="giohang-container">
      <h1 className="giohang-title">Giỏ hàng của bạn</h1>
      {cartData.length === 0 ? (
        <p>Giỏ hàng trống.</p>
      ) : (
        <>
          <div className="giohang-list">
            {cartData.map((item, index) => (
              <div key={item.ma_san_pham} className="giohang-item">
                <span className="giohang-stt">{index + 1}</span> {/* STT */}
                <img
                  src={
                    item.hinh_anh
                      ? `${BASE_URL}${
                          item.hinh_anh.startsWith("/images/")
                            ? item.hinh_anh
                            : `/images/${item.hinh_anh}`
                        }`
                      : "/default-image.jpg"
                  }
                  alt={item.ten_san_pham || "Sản phẩm"}
                  className="giohang-image"
                  onError={(e) => (e.target.src = "/default-image.jpg")}
                />
                <div className="giohang-info">
                  <h2>{item.ten_san_pham || "Không có tên"}</h2>
                  <p>Mã sản phẩm: {item.ma_san_pham || "N/A"}</p>
                  <div className="quantity-control">
                    <button
                      onClick={() =>
                        updateQuantity(
                          item.ma_gio_hang,
                          item.ma_san_pham,
                          item.so_luong - 1
                        )
                      }
                    >
                      -
                    </button>
                    <span>{item.so_luong || 1}</span>
                    <button
                      onClick={() =>
                        updateQuantity(
                          item.ma_gio_hang,
                          item.ma_san_pham,
                          (item.so_luong || 1) + 1
                        )
                      }
                    >
                      +
                    </button>
                  </div>
                  <p>Giá: {formatPrice(item.gia_san_pham)}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="giohang-summary">
            <h3>Tổng tiền: {formatPrice(totalPrice)}</h3>
            <button className="checkout-btn" onClick={handleCheckout}>
              Thanh toán
            </button>
          </div>
        </>
      )}
      <button className="back-btn" onClick={() => navigate("/san-pham")}>
        Tiếp tục mua sắm
      </button>
    </div>
  );
}

export default GioHang;
