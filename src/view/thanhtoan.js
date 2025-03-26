import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../css/ThanhToan.css";

function ThanhToan({ cart, setCart }) {
  const navigate = useNavigate();
  const location = useLocation();

  // Xử lý an toàn khi lấy dữ liệu từ localStorage
  let user;
  try {
    user = JSON.parse(localStorage.getItem("user") || "{}");
  } catch (e) {
    console.error("Lỗi khi parse user từ localStorage:", e);
    user = {};
  }

  const [formData, setFormData] = useState({
    ho_ten: user.ho_ten || "",
    dia_chi: user.dia_chi || "",
    so_dien_thoai: user.so_dien_thoai || "",
    hinh_thuc_thanh_toan: "chuyen_khoan", // Mặc định là chuyển khoản
  });
  const [orderCompleted, setOrderCompleted] = useState(false);
  const [completedOrderInfo, setCompletedOrderInfo] = useState(null);

  const BASE_URL = "http://localhost:3001";
  const API_URL = `${BASE_URL}/api/thanh-toan`;

  const buyNowProduct = location.state?.buyNowProduct;
  const itemsToCheckout = buyNowProduct ? [buyNowProduct] : cart;

  const totalPrice = itemsToCheckout.reduce(
    (sum, item) => sum + Number(item.gia_san_pham || 0) * (item.so_luong || 1),
    0
  );

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/dang-nhap");
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Hàm chính xử lý thanh toán
  const handleSubmit = async (e) => {
    e.preventDefault(); // Ngăn form gửi yêu cầu mặc định (reload trang)

    // Kiểm tra thông tin bắt buộc
    if (!formData.ho_ten || !formData.dia_chi || !formData.so_dien_thoai) {
      alert("Vui lòng điền đầy đủ thông tin!"); // Thông báo nếu thiếu thông tin
      return; // Thoát hàm
    }

    // Chuẩn bị dữ liệu đơn hàng
    const orderItems = itemsToCheckout.map((item) => ({
      ma_san_pham: item.ma_san_pham || "sp-undefined", // Mã sản phẩm
      ten_san_pham: item.ten_san_pham || "Không có tên", // Tên sản phẩm
      gia_san_pham: Number(item.gia_san_pham || 0).toFixed(2), // Giá sản phẩm (định dạng 2 chữ số thập phân)
      hinh_anh: item.hinh_anh || null, // Hình ảnh sản phẩm
      so_luong: item.so_luong || 1, // Số lượng sản phẩm
    }));

    // Tạo đối tượng dữ liệu đơn hàng để gửi lên server
    const orderData = {
      items: orderItems, // Danh sách sản phẩm
      tong_tien: Number(totalPrice).toFixed(2), // Tổng tiền (định dạng 2 chữ số thập phân)
      customerInfo: {
        ho_ten: formData.ho_ten, // Họ tên khách hàng
        dia_chi: formData.dia_chi, // Địa chỉ giao hàng
        so_dien_thoai: formData.so_dien_thoai, // Số điện thoại
      },
      hinh_thuc_thanh_toan: formData.hinh_thuc_thanh_toan, // Hình thức thanh toán
      ngay_dat_hang: new Date().toISOString(), // Ngày đặt hàng
    };

    console.log("Dữ liệu gửi đi:", orderData); // Log dữ liệu để debug

    try {
      const token = localStorage.getItem("token"); // Lấy token xác thực từ localStorage
      // Gửi yêu cầu POST tới API thanh toán
      const response = await fetch(API_URL, {
        method: "POST", // Phương thức HTTP là POST
        headers: {
          "Content-Type": "application/json", // Định dạng dữ liệu là JSON
          Authorization: `Bearer ${token}`, // Gửi token xác thực trong header
        },
        body: JSON.stringify(orderData), // Chuyển dữ liệu đơn hàng thành chuỗi JSON
      });

      // Kiểm tra nếu phản hồi từ server không thành công
      if (!response.ok) {
        const errorData = await response.json(); // Lấy thông tin lỗi từ server
        throw new Error(
          `Lỗi từ server: ${errorData.error || "Không xác định"} - ${
            errorData.details || ""
          }`
        ); // Ném lỗi với thông báo chi tiết
      }

      const result = await response.json(); // Lấy phản hồi từ server nếu thành công
      console.log("Phản hồi từ server:", result); // Log phản hồi để debug

      setCompletedOrderInfo(orderData); // Lưu thông tin đơn hàng đã hoàn tất
      setOrderCompleted(true); // Đánh dấu đơn hàng đã hoàn tất

      // Hiển thị thông báo dựa trên hình thức thanh toán
      alert(
        formData.hinh_thuc_thanh_toan === "chuyen_khoan"
          ? "Đặt hàng thành công! Vui lòng chuyển khoản theo thông tin ngân hàng bên dưới."
          : "Đặt hàng thành công! Vui lòng chuẩn bị tiền mặt khi nhận hàng."
      );

      // Nếu không phải "Mua ngay", xóa giỏ hàng sau khi đặt hàng
      if (!buyNowProduct) {
        setCart([]); // Xóa giỏ hàng
      }
    } catch (error) {
      console.error("Lỗi chi tiết:", error); // Log lỗi để debug
      alert(`Có lỗi xảy ra khi đặt hàng: ${error.message}. Vui lòng thử lại!`); // Thông báo lỗi cho người dùng
    }
  };

  const bankInfo = {
    bankName: "Ngân hàng Vietcombank",
    accountName: "Công ty TNHH XYZ",
    accountNumber: "1234567890",
    branch: "Chi nhánh Hà Nội",
  };

  if (!localStorage.getItem("token")) {
    return null;
  }

  return (
    <div className="thanhtoan-container">
      <h1 className="thanhtoan-title">Thanh toán</h1>

      {orderCompleted ? (
        <div className="order-completed">
          <h3>Đơn hàng của bạn đã được đặt thành công!</h3>
          <div className="completed-order-info">
            <h4>Thông tin đơn hàng:</h4>
            {completedOrderInfo.items.map((item, index) => (
              <div key={item.ma_san_pham || index} className="order-item">
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
                  alt={item.ten_san_pham}
                  className="order-item-image"
                  onError={(e) => (e.target.src = "/default-image.jpg")}
                />
                <div className="order-item-details">
                  <p>
                    <strong>STT:</strong> {index + 1}
                  </p>
                  <p>
                    <strong>Mã sản phẩm:</strong> {item.ma_san_pham}
                  </p>
                  <p>
                    <strong>Tên:</strong> {item.ten_san_pham} -{" "}
                    {Number(item.gia_san_pham).toLocaleString()} VND
                  </p>
                  <p>
                    <strong>Số lượng:</strong> {item.so_luong}
                  </p>
                </div>
              </div>
            ))}
            <h4>
              Tổng tiền: {Number(completedOrderInfo.tong_tien).toLocaleString()}{" "}
              VND
            </h4>
            <p>
              <strong>Ngày đặt hàng:</strong>{" "}
              {new Date(completedOrderInfo.ngay_dat_hang).toLocaleString()}
            </p>
            <p>
              <strong>Hình thức thanh toán:</strong>{" "}
              {completedOrderInfo.hinh_thuc_thanh_toan === "chuyen_khoan"
                ? "Chuyển khoản"
                : "Tiền mặt"}
            </p>
          </div>
          <div className="completed-customer-info">
            <h4>Thông tin khách hàng:</h4>
            <p>
              <strong>Họ và tên:</strong>{" "}
              {completedOrderInfo.customerInfo.ho_ten}
            </p>
            <p>
              <strong>Địa chỉ:</strong>{" "}
              {completedOrderInfo.customerInfo.dia_chi}
            </p>
            <p>
              <strong>Số điện thoại:</strong>{" "}
              {completedOrderInfo.customerInfo.so_dien_thoai}
            </p>
          </div>
          {completedOrderInfo.hinh_thuc_thanh_toan === "chuyen_khoan" && (
            <div className="bank-info">
              <h4>Thông tin chuyển khoản:</h4>
              <p>
                Vui lòng chuyển khoản số tiền{" "}
                <strong>
                  {Number(completedOrderInfo.tong_tien).toLocaleString()} VND
                </strong>{" "}
                theo thông tin sau:
              </p>
              <ul>
                <li>
                  <strong>Tên ngân hàng:</strong> {bankInfo.bankName}
                </li>
                <li>
                  <strong>Chủ tài khoản:</strong> {bankInfo.accountName}
                </li>
                <li>
                  <strong>Số tài khoản:</strong> {bankInfo.accountNumber}
                </li>
                <li>
                  <strong>Chi nhánh:</strong> {bankInfo.branch}
                </li>
              </ul>
              <p>
                Lưu ý: Ghi rõ nội dung chuyển khoản là họ tên và số điện thoại
                của bạn.
              </p>
            </div>
          )}
          {completedOrderInfo.hinh_thuc_thanh_toan === "tien_mat" && (
            <div className="cash-info">
              <h4>Thanh toán tiền mặt:</h4>
              <p>
                Vui lòng chuẩn bị số tiền{" "}
                <strong>
                  {Number(completedOrderInfo.tong_tien).toLocaleString()} VND
                </strong>{" "}
                để thanh toán khi nhận hàng.
              </p>
            </div>
          )}
          <button className="back-btn" onClick={() => navigate("/san-pham")}>
            Quay lại trang sản phẩm
          </button>
        </div>
      ) : (
        <>
          <div className="order-summary">
            <h3>Đơn hàng của bạn</h3>
            {itemsToCheckout.length === 0 ? (
              <p>Không có sản phẩm nào trong đơn hàng.</p>
            ) : (
              itemsToCheckout.map((item, index) => (
                <div key={item.ma_san_pham || index} className="order-item">
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
                    alt={item.ten_san_pham}
                    className="order-item-image"
                    onError={(e) => (e.target.src = "/default-image.jpg")}
                  />
                  <div className="order-item-details">
                    <p>
                      <strong>STT:</strong> {index + 1}
                    </p>
                    <p>
                      <strong>Mã sản phẩm:</strong>{" "}
                      {item.ma_san_pham || "sp-undefined"}
                    </p>
                    <p>
                      <strong>Tên:</strong>{" "}
                      {item.ten_san_pham || "Không có tên"} -{" "}
                      {Number(item.gia_san_pham || 0).toLocaleString()} VND
                    </p>
                    <p>
                      <strong>Số lượng:</strong> {item.so_luong || 1}
                    </p>
                  </div>
                </div>
              ))
            )}
            <h4>Tổng tiền: {totalPrice.toLocaleString()} VND</h4>
          </div>

          <form className="thanhtoan-form" onSubmit={handleSubmit}>
            <h3>Thông tin giao hàng</h3>
            <input
              type="text"
              name="ho_ten"
              placeholder="Họ và tên"
              value={formData.ho_ten}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="dia_chi"
              placeholder="Địa chỉ giao hàng"
              value={formData.dia_chi}
              onChange={handleChange}
              required
            />
            <input
              type="tel"
              name="so_dien_thoai"
              placeholder="Số điện thoại"
              value={formData.so_dien_thoai}
              onChange={handleChange}
              required
            />
            <div className="payment-method">
              <h3>Hình thức thanh toán</h3>
              <label>
                <input
                  type="radio"
                  name="hinh_thuc_thanh_toan"
                  value="chuyen_khoan"
                  checked={formData.hinh_thuc_thanh_toan === "chuyen_khoan"}
                  onChange={handleChange}
                />
                Chuyển khoản
              </label>
              <label>
                <input
                  type="radio"
                  name="hinh_thuc_thanh_toan"
                  value="tien_mat"
                  checked={formData.hinh_thuc_thanh_toan === "tien_mat"}
                  onChange={handleChange}
                />
                Tiền mặt
              </label>
            </div>
            {formData.hinh_thuc_thanh_toan === "chuyen_khoan" && (
              <div className="bank-info">
                <h3>Thông tin chuyển khoản</h3>
                <p>
                  Vui lòng chuyển khoản số tiền{" "}
                  <strong>{totalPrice.toLocaleString()} VND</strong> theo thông
                  tin sau:
                </p>
                <ul>
                  <li>
                    <strong>Tên ngân hàng:</strong> {bankInfo.bankName}
                  </li>
                  <li>
                    <strong>Chủ tài khoản:</strong> {bankInfo.accountName}
                  </li>
                  <li>
                    <strong>Số tài khoản:</strong> {bankInfo.accountNumber}
                  </li>
                  <li>
                    <strong>Chi nhánh:</strong> {bankInfo.branch}
                  </li>
                </ul>
                <p>
                  Lưu ý: Ghi rõ nội dung chuyển khoản là họ tên và số điện thoại
                  của bạn.
                </p>
              </div>
            )}
            {formData.hinh_thuc_thanh_toan === "tien_mat" && (
              <div className="cash-info">
                <h3>Thanh toán tiền mặt</h3>
                <p>
                  Vui lòng chuẩn bị số tiền{" "}
                  <strong>{totalPrice.toLocaleString()} VND</strong> để thanh
                  toán khi nhận hàng.
                </p>
              </div>
            )}
            <button type="submit" className="submit-btn">
              Xác nhận thanh toán
            </button>
          </form>
          <button className="back-btn" onClick={() => navigate("/gio-hang")}>
            Quay lại giỏ hàng
          </button>
        </>
      )}
    </div>
  );
}

export default ThanhToan;
