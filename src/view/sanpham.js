import React, { useState, useEffect } from "react"; // Import React và các hook useState, useEffect để quản lý trạng thái và vòng đời component
import { useParams, useNavigate, useLocation } from "react-router-dom"; // Import các hook từ react-router-dom để lấy tham số URL, điều hướng và thông tin vị trí
import "../css/SanPham.css"; // Import file CSS để định dạng giao diện

function SanPham({ cart, setCart }) {
  // Component SanPham nhận cart (giỏ hàng) và setCart (hàm cập nhật giỏ hàng) từ props
  const [sanPhamList, setSanPhamList] = useState([]); // Trạng thái lưu danh sách sản phẩm, mặc định là mảng rỗng
  const [currentPage, setCurrentPage] = useState(1); // Trạng thái lưu trang hiện tại, mặc định là trang 1
  const [filters, setFilters] = useState({
    // Trạng thái lưu các bộ lọc (loại sản phẩm, giới tính, giá)
    loai_san_pham: "",
    gioi_tinh: "",
    minPrice: "",
    maxPrice: "",
  });
  const [loading, setLoading] = useState(true); // Trạng thái hiển thị loading khi đang tải dữ liệu, mặc định là true
  const [isChatOpen, setIsChatOpen] = useState(false); // Trạng thái kiểm soát popup chat, mặc định là đóng

  const { tenSanPham } = useParams(); // Lấy tham số tenSanPham từ URL (ví dụ: /san-pham/ten-san-pham)
  const navigate = useNavigate(); // Hàm điều hướng đến các route khác
  const location = useLocation(); // Lấy thông tin vị trí hiện tại (bao gồm query string)
  const itemsPerPage = 6; // Số sản phẩm hiển thị trên mỗi trang

  const BASE_URL = "http://localhost:3001"; // URL cơ sở của API backend

  // Hàm loại bỏ dấu tiếng Việt để chuẩn hóa tên sản phẩm
  const removeAccents = (str) => {
    return str
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/đ/g, "d")
      .replace(/Đ/g, "D");
  };

  // Hàm định dạng tên sản phẩm cho URL (loại bỏ dấu, chuyển thành chữ thường, thay khoảng trắng bằng dấu gạch ngang)
  const formatProductNameForURL = (name) => {
    return removeAccents(name)
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "");
  };

  // Hàm định dạng giá tiền sang định dạng Việt Nam (ví dụ: 1.000.000 VND)
  const formatPrice = (price) => {
    if (price == null || isNaN(Number(price))) {
      return "N/A"; // Trả về "N/A" nếu giá không hợp lệ
    }
    const numericPrice = Number(price);
    return numericPrice.toLocaleString("vi-VN") + " VND"; // Định dạng số và thêm đơn vị VND
  };

  // Hook useEffect để tải danh sách sản phẩm từ API khi component được mount
  useEffect(() => {
    setLoading(true); // Bật trạng thái loading
    fetch(`${BASE_URL}/api/sanpham`) // Gọi API để lấy danh sách sản phẩm
      .then((response) => response.json()) // Chuyển phản hồi thành JSON
      .then((data) => {
        if (Array.isArray(data)) {
          // Kiểm tra dữ liệu có phải mảng không
          setSanPhamList(data); // Cập nhật danh sách sản phẩm
        } else {
          console.error("Dữ liệu không phải là mảng:", data); // Báo lỗi nếu không phải mảng
        }
      })
      .catch((error) => console.error("Lỗi khi lấy dữ liệu:", error)) // Xử lý lỗi nếu có
      .finally(() => setLoading(false)); // Tắt trạng thái loading dù thành công hay thất bại
  }, []); // Mảng phụ thuộc rỗng, chỉ chạy một lần khi mount

  // Hook useEffect để cập nhật bộ lọc từ query string trong URL
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search); // Lấy các tham số từ query string
    const loaiFromURL = searchParams.get("loai_san_pham"); // Lấy giá trị loai_san_pham từ URL
    if (loaiFromURL) {
      setFilters((prevFilters) => ({
        ...prevFilters,
        loai_san_pham: loaiFromURL, // Cập nhật bộ lọc loại sản phẩm
      }));
    }
  }, [location.search]); // Chạy lại khi query string thay đổi

  // Lọc danh sách sản phẩm dựa trên các bộ lọc
  const filteredProducts = Array.isArray(sanPhamList)
    ? sanPhamList.filter((sanPham) => {
        return (
          (filters.loai_san_pham === "" ||
            sanPham.loai_san_pham === filters.loai_san_pham) && // Lọc theo loại sản phẩm
          (filters.gioi_tinh === "" ||
            sanPham.gioi_tinh === filters.gioi_tinh) && // Lọc theo giới tính
          (filters.minPrice === "" ||
            (sanPham.gia_san_pham &&
              sanPham.gia_san_pham >= Number(filters.minPrice))) && // Lọc giá tối thiểu
          (filters.maxPrice === "" ||
            (sanPham.gia_san_pham &&
              sanPham.gia_san_pham <= Number(filters.maxPrice))) // Lọc giá tối đa
        );
      })
    : []; // Trả về mảng rỗng nếu sanPhamList không phải mảng

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage); // Tính tổng số trang
  const displayedProducts = filteredProducts.slice(
    // Lấy danh sách sản phẩm hiển thị trên trang hiện tại
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Hàm thêm sản phẩm vào giỏ hàng
  const addToCart = (product) => {
    setCart([...cart, product]); // Thêm sản phẩm vào giỏ hàng
    alert(`${product.ten_san_pham} đã được thêm vào giỏ hàng!`); // Hiển thị thông báo
    navigate("/gio-hang"); // Điều hướng đến trang giỏ hàng
  };

  // Hàm xử lý mua ngay, điều hướng đến trang thanh toán với thông tin sản phẩm
  const handleBuyNow = (product) => {
    navigate("/thanh-toan", { state: { buyNowProduct: product } });
  };

  // Hàm xử lý thay đổi bộ lọc
  const handleFilterChange = (e) => {
    const { name, value } = e.target; // Lấy tên và giá trị từ input/select
    setFilters({
      ...filters,
      [name]: value, // Cập nhật bộ lọc tương ứng
    });
    setCurrentPage(1); // Quay về trang 1 khi thay đổi bộ lọc
  };

  // Hàm xử lý khi click vào sản phẩm, điều hướng đến trang chi tiết
  const handleProductClick = (sanPham) => {
    const formattedName = formatProductNameForURL(sanPham.ten_san_pham);
    navigate(`/san-pham/${formattedName}`);
  };

  // Tìm sản phẩm được chọn dựa trên tham số URL
  const selectedProduct = sanPhamList.find(
    (sanPham) => formatProductNameForURL(sanPham.ten_san_pham) === tenSanPham
  );

  // Hàm bật/tắt popup chat
  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  return (
    <div className="sanpham-container">
      {" "}
      {/* Container chính của component */}
      {loading ? ( // Nếu đang tải dữ liệu
        <p className="loading">Đang tải dữ liệu...</p>
      ) : selectedProduct ? ( // Nếu có sản phẩm được chọn (trang chi tiết)
        <div className="product-detail">
          <div className="product-detail-container">
            <div className="product-image-wrapper">
              <img
                src={
                  selectedProduct.hinh_anh
                    ? `${BASE_URL}${selectedProduct.hinh_anh}` // Hiển thị ảnh từ API
                    : "/default-image.jpg" // Ảnh mặc định nếu không có
                }
                alt={selectedProduct.ten_san_pham}
                className="product-detail-image"
                onError={(e) => (e.target.src = "/default-image.jpg")} // Xử lý lỗi tải ảnh
              />
            </div>
            <div className="product-info">
              <h2 className="product-detail-title">
                {selectedProduct.ten_san_pham} {/* Tên sản phẩm */}
              </h2>
              <p className="product-detail-code">
                Mã sản phẩm: {selectedProduct.ma_san_pham || "N/A"}{" "}
                {/* Mã sản phẩm */}
              </p>
              <p className="product-detail-price">
                Giá: {formatPrice(selectedProduct.gia_san_pham)}{" "}
                {/* Giá sản phẩm */}
              </p>
              <p className="product-detail-description">
                Mô tả: {selectedProduct.mo_ta || "Không có mô tả"}{" "}
                {/* Mô tả sản phẩm */}
              </p>
              <div className="product-actions-container">
                <div className="product-actions">
                  <button
                    className="add-to-cart-btn"
                    onClick={() => addToCart(selectedProduct)} // Thêm vào giỏ hàng
                  >
                    Thêm vào giỏ hàng
                  </button>
                  <button
                    className="buy-now-btn"
                    onClick={() => handleBuyNow(selectedProduct)} // Mua ngay
                  >
                    Mua ngay
                  </button>
                </div>
                <button
                  className="back-btn"
                  onClick={() => navigate("/san-pham")} // Quay lại danh sách
                >
                  Quay lại danh sách
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        // Nếu không có sản phẩm được chọn (trang danh sách)
        <>
          <h1 className="sanpham-title">Danh sách sản phẩm</h1>
          <div className="filter-bar">
            {" "}
            {/* Thanh bộ lọc */}
            <select
              name="loai_san_pham"
              value={filters.loai_san_pham}
              onChange={handleFilterChange} // Cập nhật loại sản phẩm
            >
              <option value="">Tất cả loại</option>
              <option value="Dây chuyền">Dây chuyền</option>
              <option value="Nhẫn">Nhẫn</option>
              <option value="Lắc">Lắc</option>
            </select>
            <select
              name="gioi_tinh"
              value={filters.gioi_tinh}
              onChange={handleFilterChange} // Cập nhật giới tính
            >
              <option value="">Tất cả giới tính</option>
              <option value="Nam">Nam</option>
              <option value="Nữ">Nữ</option>
            </select>
            <select
              name="priceRange"
              value={`${filters.minPrice}-${filters.maxPrice}`}
              onChange={(e) => {
                // Cập nhật khoảng giá
                const [min, max] = e.target.value.split("-");
                setFilters({
                  ...filters,
                  minPrice: min === "" ? "" : Number(min),
                  maxPrice: max === "" ? "" : Number(max),
                });
                setCurrentPage(1); // Quay về trang 1
              }}
            >
              <option value="-">Tất cả giá</option>
              <option value="0-10000000">Dưới 10.000.000</option>
              <option value="10000000-20000000">10.000.000 - 20.000.000</option>
              <option value="20000000-30000000">20.000.000 - 30.000.000</option>
              <option value="30000000-">Trên 30.000.000</option>
            </select>
          </div>
          <div className="sanpham-grid">
            {" "}
            {/* Lưới sản phẩm */}
            {displayedProducts.length > 0 ? ( // Nếu có sản phẩm hiển thị
              displayedProducts.map((sanPham) => (
                <div
                  key={sanPham.ma_san_pham}
                  className="sanpham-item"
                  onClick={() => handleProductClick(sanPham)} // Chuyển đến trang chi tiết khi click
                >
                  <img
                    src={
                      sanPham.hinh_anh
                        ? `${BASE_URL}${sanPham.hinh_anh}`
                        : "/default-image.jpg"
                    }
                    alt={sanPham.ten_san_pham}
                    className="sanpham-image"
                    onError={(e) => (e.target.src = "/default-image.jpg")}
                  />
                  <h2 className="sanpham-name">{sanPham.ten_san_pham}</h2>
                  <p className="sanpham-code">
                    Mã sản phẩm: {sanPham.ma_san_pham || "N/A"}
                  </p>
                  <p className="sanpham-price">
                    Giá: {formatPrice(sanPham.gia_san_pham)}
                  </p>
                </div>
              ))
            ) : (
              // Nếu không có sản phẩm nào
              <p className="no-results">Không tìm thấy sản phẩm nào.</p>
            )}
          </div>
          <div className="pagination">
            {" "}
            {/* Phân trang */}
            <button
              disabled={currentPage === 1} // Vô hiệu hóa nếu đang ở trang 1
              onClick={() => setCurrentPage(currentPage - 1)} // Chuyển về trang trước
            >
              Trước
            </button>
            <span>
              Trang {currentPage} / {totalPages}{" "}
              {/* Hiển thị trang hiện tại và tổng số trang */}
            </span>
            <button
              disabled={currentPage === totalPages} // Vô hiệu hóa nếu đang ở trang cuối
              onClick={() => setCurrentPage(currentPage + 1)} // Chuyển đến trang sau
            >
              Tiếp
            </button>
          </div>
        </>
      )}
      {/* Icon Tin Nhắn */}
      <div className="chat-icon" onClick={toggleChat}>
        {" "}
        {/* Icon bật/tắt popup chat */}
        <img
          src="https://cdn-icons-png.flaticon.com/512/134/134718.png"
          alt="Chat"
          className="chat-icon-img"
        />
      </div>
      {/* Popup Liên Hệ */}
      {isChatOpen && ( // Hiển thị popup nếu isChatOpen là true
        <div className="chat-popup">
          <a
            href="https://zalo.me/0987654321"
            target="_blank"
            rel="noopener noreferrer"
            className="chat-link"
          >
            <img
              src="https://cdn-icons-png.flaticon.com/512/2111/2111728.png"
              alt="Zalo"
              className="chat-option"
            />
          </a>
          <a
            href="https://facebook.com/trangsucvn"
            target="_blank"
            rel="noopener noreferrer"
            className="chat-link"
          >
            <img
              src="https://cdn-icons-png.flaticon.com/512/733/733547.png"
              alt="Facebook"
              className="chat-option"
            />
          </a>
          <a href="mailto:info@trangsucvn.com" className="chat-link">
            <img
              src="https://cdn-icons-png.flaticon.com/512/732/732200.png"
              alt="Gmail"
              className="chat-option"
            />
          </a>
        </div>
      )}
    </div>
  );
}

export default SanPham; // Xuất component để sử dụng ở nơi khác
