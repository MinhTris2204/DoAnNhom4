import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../css/TimKiem.css";

function TimKiem({ cart, setCart }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sanPhamList, setSanPhamList] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearched, setIsSearched] = useState(false); // Trạng thái kiểm tra đã nhấn "Tìm Kiếm" chưa
  const navigate = useNavigate();

  const BASE_URL = "http://localhost:3001"; // URL backend

  // Hàm loại bỏ dấu tiếng Việt
  const removeAccents = (str) => {
    return str
      .normalize("NFD") // Chuẩn hóa chuỗi về dạng không dấu
      .replace(/[\u0300-\u036f]/g, "") // Xóa các ký tự dấu
      .replace(/đ/g, "d") // Thay "đ" thành "d"
      .replace(/Đ/g, "D"); // Thay "Đ" thành "D"
  };

  // Hàm định dạng tên sản phẩm cho URL
  const formatProductNameForURL = (name) => {
    return removeAccents(name)
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
  };

  // Hàm định dạng giá
  const formatPrice = (price) => {
    if (price == null || isNaN(Number(price))) {
      // Kiểm tra nếu giá không hợp lệ
      return "N/A"; // Trả về "N/A" nếu không có giá
    }
    const numericPrice = Number(price); // Chuyển giá thành số
    return numericPrice.toLocaleString("vi-VN") + " VND";
  };

  // Lấy danh sách sản phẩm từ API
  useEffect(() => {
    fetch(`${BASE_URL}/api/sanpham`) // Gửi yêu cầu GET tới API sản phẩm
      .then((response) => response.json()) // Chuyển phản hồi thành JSON
      .then((data) => {
        if (Array.isArray(data)) {
          // Kiểm tra xem dữ liệu có phải là mảng không
          setSanPhamList(data); // Lưu danh sách sản phẩm vào state
        } else {
          console.error("Dữ liệu không phải là mảng:", data); // Ghi log lỗi nếu dữ liệu không đúng định dạng
        }
      })
      .catch((error) => console.error("Lỗi khi lấy dữ liệu:", error)); // Xử lý lỗi nếu có vấn đề khi gọi API
  }, []); // Chỉ chạy một lần khi component mount

  // Hàm xử lý tìm kiếm
  const handleSearch = (e) => {
    e.preventDefault(); // Ngăn form gửi yêu cầu mặc định (reload trang)
    setIsSearched(true); // Đánh dấu đã nhấn "Tìm Kiếm"
    if (!searchQuery.trim()) {
      // Kiểm tra nếu ô tìm kiếm rỗng
      setSearchResults([]); // Xóa kết quả tìm kiếm nếu không có truy vấn
      return; // Thoát hàm
    }

    const query = removeAccents(searchQuery.toLowerCase()); // Chuẩn hóa truy vấn: loại dấu, chuyển thành chữ thường
    const results = sanPhamList.filter((sanPham) => {
      // Lọc danh sách sản phẩm
      // Chuẩn hóa tên sản phẩm
      const tenSanPham = removeAccents(sanPham.ten_san_pham.toLowerCase());
      // Chuẩn hóa mã sản phẩm (nếu có)
      const maSanPham = sanPham.ma_san_pham
        ? sanPham.ma_san_pham.toString().toLowerCase()
        : "";
      // Kiểm tra xem truy vấn có trong tên hoặc mã sản phẩm không
      return tenSanPham.includes(query) || maSanPham.includes(query);
    });
    setSearchResults(results); // Lưu kết quả tìm kiếm vào state
  };

  // Hàm xử lý khi nhấn vào sản phẩm
  const handleProductClick = (sanPham) => {
    const formattedName = formatProductNameForURL(sanPham.ten_san_pham); // Định dạng tên sản phẩm cho URL
    navigate(`/san-pham/${formattedName}`); // Chuyển hướng tới trang chi tiết sản phẩm
  };

  // Hàm thêm vào giỏ hàng
  const addToCart = (product) => {
    setCart([...cart, product]); // Thêm sản phẩm vào giỏ hàng (state cart)
    alert(`${product.ten_san_pham} đã được thêm vào giỏ hàng!`); // Hiển thị thông báo
    navigate("/gio-hang"); // Chuyển hướng tới trang giỏ hàng
  };

  return (
    <div className="timkiem-container">
      <h1 className="timkiem-title">Tìm Kiếm Sản Phẩm</h1>
      <form onSubmit={handleSearch} className="search-form">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setIsSearched(false); // Reset trạng thái khi đang nhập
          }}
          placeholder="Nhập tên hoặc mã sản phẩm..."
          className="search-input"
        />
        <button type="submit" className="search-btn">
          Tìm Kiếm
        </button>
      </form>

      {searchResults.length > 0 ? (
        <div className="search-results">
          {searchResults.map((sanPham) => (
            <div
              key={sanPham.ma_san_pham}
              className="search-item"
              onClick={() => handleProductClick(sanPham)}
            >
              <img
                src={
                  sanPham.hinh_anh
                    ? `${BASE_URL}${sanPham.hinh_anh}`
                    : "/default-image.jpg"
                }
                alt={sanPham.ten_san_pham}
                className="search-image"
                onError={(e) => (e.target.src = "/default-image.jpg")}
              />
              <div className="search-info">
                <h2 className="search-name">{sanPham.ten_san_pham}</h2>
                <p className="search-code">
                  Mã sản phẩm: {sanPham.ma_san_pham || "N/A"}
                </p>
                <p className="search-price">
                  Giá: {formatPrice(sanPham.gia_san_pham)}
                </p>
                <button
                  className="add-to-cart-btn"
                  onClick={(e) => {
                    e.stopPropagation(); // Ngăn sự kiện click lan lên div cha
                    addToCart(sanPham);
                  }}
                >
                  Thêm vào giỏ hàng
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        isSearched &&
        searchQuery && (
          <p className="no-results">Không tìm thấy sản phẩm nào.</p>
        )
      )}
    </div>
  );
}

export default TimKiem;
