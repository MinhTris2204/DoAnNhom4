import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../css/AdminProductManagement.css"; // Nhập file CSS

function AdminProductManagement() {
  const [sanPhamList, setSanPhamList] = useState([]);
  const [newProduct, setNewProduct] = useState({
    ma_san_pham: "",
    ten_san_pham: "",
    loai_san_pham: "",
    gioi_tinh: "",
    gia_san_pham: "",
    mo_ta: "",
    hinh_anh: null,
  });
  const [editingProduct, setEditingProduct] = useState(null);
  const [previewImage, setPreviewImage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
  const [itemsPerPage] = useState(6); // Số sản phẩm trên mỗi trang
  const navigate = useNavigate();

  const BASE_URL = "http://localhost:3001";

  // Hàm định dạng giá VND
  const formatPrice = (price) => {
    return Number(price).toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });
  };

  // Lấy danh sách sản phẩm từ server
  useEffect(() => {
    fetchSanPham(); // Gọi hàm lấy danh sách sản phẩm khi component mount
  }, []);

  const fetchSanPham = async () => {
    setLoading(true); // Đặt trạng thái đang tải
    try {
      const response = await fetch(`${BASE_URL}/api/sanpham`); // Gửi yêu cầu GET tới API
      if (!response.ok) {
        throw new Error(`Không thể lấy dữ liệu sản phẩm: ${response.status}`); // Kiểm tra nếu phản hồi không thành công
      }
      const data = await response.json(); // Chuyển phản hồi thành JSON
      console.log("Dữ liệu sản phẩm từ server:", data); // Log để debug
      setSanPhamList(data); // Lưu danh sách sản phẩm vào state
      setError(""); // Xóa thông báo lỗi
    } catch (error) {
      console.error("Lỗi khi lấy dữ liệu:", error); // Log lỗi nếu có
      setError(error.message); // Hiển thị thông báo lỗi
    } finally {
      setLoading(false); // Tắt trạng thái tải
    }
  };

  // Xử lý thay đổi hình ảnh
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        setError("Vui lòng chọn một file hình ảnh hợp lệ (JPG, PNG, v.v.)");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError("Kích thước file không được vượt quá 5MB");
        return;
      }
      setPreviewImage(URL.createObjectURL(file));
      if (editingProduct) {
        setEditingProduct({ ...editingProduct, hinh_anh: file });
      } else {
        setNewProduct({ ...newProduct, hinh_anh: file });
      }
      setError("");
    }
  };

  // Xử lý thay đổi dữ liệu trong form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (editingProduct) {
      setEditingProduct({ ...editingProduct, [name]: value });
    } else {
      setNewProduct({ ...newProduct, [name]: value });
    }
    setError("");
  };

  // Kiểm tra dữ liệu form
  const validateForm = (product) => {
    if (!product.ma_san_pham && !editingProduct) {
      setError("Mã sản phẩm là bắt buộc khi thêm mới!");
      return false;
    }
    if (!product.ten_san_pham) {
      setError("Tên sản phẩm là bắt buộc!");
      return false;
    }
    if (!product.loai_san_pham) {
      setError("Vui lòng chọn loại sản phẩm!");
      return false;
    }
    if (!product.gioi_tinh) {
      setError("Vui lòng chọn giới tính!");
      return false;
    }
    if (
      !product.gia_san_pham ||
      isNaN(product.gia_san_pham) ||
      product.gia_san_pham <= 0
    ) {
      setError("Giá phải là số dương!");
      return false;
    }
    return true;
  };

  // Thêm sản phẩm mới
  const handleAddProduct = async () => {
    if (!validateForm(newProduct)) return; // Kiểm tra dữ liệu form trước khi thêm

    setLoading(true); // Đặt trạng thái đang tải
    const formData = new FormData(); // Tạo FormData để gửi dữ liệu (bao gồm file)
    formData.append("ma_san_pham", newProduct.ma_san_pham); // Thêm mã sản phẩm
    formData.append("ten_san_pham", newProduct.ten_san_pham); // Thêm tên sản phẩm
    formData.append("loai_san_pham", newProduct.loai_san_pham); // Thêm loại sản phẩm
    formData.append("gioi_tinh", newProduct.gioi_tinh); // Thêm giới tính
    formData.append("gia_san_pham", newProduct.gia_san_pham); // Thêm giá sản phẩm
    formData.append("mo_ta", newProduct.mo_ta); // Thêm mô tả
    if (newProduct.hinh_anh) {
      formData.append("hinh_anh", newProduct.hinh_anh); // Thêm hình ảnh nếu có
    }

    try {
      const response = await fetch(`${BASE_URL}/api/sanpham`, {
        method: "POST", // Phương thức HTTP là POST
        body: formData, // Dữ liệu gửi đi dưới dạng FormData
      });
      if (!response.ok) {
        const err = await response.json(); // Lấy thông tin lỗi từ server
        throw new Error(err.error || "Lỗi khi thêm sản phẩm"); // Ném lỗi
      }
      const data = await response.json(); // Lấy dữ liệu phản hồi từ server
      console.log("Sản phẩm mới từ server:", data); // Log để debug
      setSanPhamList([...sanPhamList, data]); // Thêm sản phẩm mới vào danh sách
      resetForm(); // Reset form sau khi thêm thành công
      setError(""); // Xóa thông báo lỗi
    } catch (error) {
      console.error("Lỗi khi thêm sản phẩm:", error); // Log lỗi nếu có
      setError(error.message); // Hiển thị thông báo lỗi
    } finally {
      setLoading(false); // Tắt trạng thái tải
    }
  };

  // Xóa sản phẩm
  const handleDeleteProduct = async (ma_san_pham) => {
    setLoading(true); // Đặt trạng thái đang tải
    try {
      const response = await fetch(`${BASE_URL}/api/sanpham/${ma_san_pham}`, {
        method: "DELETE", // Phương thức HTTP là DELETE
      });
      if (!response.ok) {
        const err = await response.json(); // Lấy thông tin lỗi từ server
        throw new Error(err.error || "Lỗi khi xóa sản phẩm"); // Ném lỗi
      }
      await response.text(); // Đọc phản hồi từ server (nếu có)
      // Cập nhật danh sách sản phẩm sau khi xóa
      setSanPhamList(
        sanPhamList.filter((product) => product.ma_san_pham !== ma_san_pham)
      );
      setError(""); // Xóa thông báo lỗi
      console.log("Đã xóa sản phẩm thành công:", ma_san_pham); // Log để debug
      const totalItems = sanPhamList.length - 1; // Tính tổng số sản phẩm sau khi xóa
      const totalPages = Math.ceil(totalItems / itemsPerPage); // Tính tổng số trang
      if (currentPage > totalPages) {
        setCurrentPage(totalPages > 0 ? totalPages : 1); // Điều chỉnh trang hiện tại nếu cần
      }
    } catch (error) {
      console.error("Lỗi khi xóa sản phẩm:", error); // Log lỗi nếu có
      setError(error.message); // Hiển thị thông báo lỗi
    } finally {
      setLoading(false); // Tắt trạng thái tải
    }
  };

  // Cập nhật sản phẩm
  const handleUpdateProduct = async () => {
    if (!validateForm(editingProduct)) return; // Kiểm tra dữ liệu form trước khi cập nhật

    setLoading(true); // Đặt trạng thái đang tải
    const formData = new FormData(); // Tạo FormData để gửi dữ liệu
    formData.append("ten_san_pham", editingProduct.ten_san_pham); // Thêm tên sản phẩm
    formData.append("loai_san_pham", editingProduct.loai_san_pham); // Thêm loại sản phẩm
    formData.append("gioi_tinh", editingProduct.gioi_tinh); // Thêm giới tính
    formData.append("gia_san_pham", editingProduct.gia_san_pham); // Thêm giá sản phẩm
    formData.append("mo_ta", editingProduct.mo_ta); // Thêm mô tả
    if (editingProduct.hinh_anh instanceof File) {
      formData.append("hinh_anh", editingProduct.hinh_anh); // Thêm hình ảnh mới nếu có
    }

    try {
      const response = await fetch(
        `${BASE_URL}/api/sanpham/${editingProduct.ma_san_pham}`,
        {
          method: "PUT", // Phương thức HTTP là PUT
          body: formData, // Dữ liệu gửi đi dưới dạng FormData
        }
      );
      if (!response.ok) {
        const err = await response.json(); // Lấy thông tin lỗi từ server
        throw new Error(err.error || "Lỗi khi cập nhật sản phẩm"); // Ném lỗi
      }
      const data = await response.json(); // Lấy dữ liệu phản hồi từ server
      console.log("Sản phẩm đã cập nhật từ server:", data); // Log để debug
      // Cập nhật danh sách sản phẩm với sản phẩm đã chỉnh sửa
      setSanPhamList(
        sanPhamList.map((product) =>
          product.ma_san_pham === editingProduct.ma_san_pham ? data : product
        )
      );
      resetForm(); // Reset form sau khi cập nhật thành công
      setError(""); // Xóa thông báo lỗi
    } catch (error) {
      console.error("Lỗi khi cập nhật sản phẩm:", error); // Log lỗi nếu có
      setError(error.message); // Hiển thị thông báo lỗi
    } finally {
      setLoading(false); // Tắt trạng thái tải
    }
  };

  // Reset form
  const resetForm = () => {
    setNewProduct({
      ma_san_pham: "",
      ten_san_pham: "",
      loai_san_pham: "",
      gioi_tinh: "",
      gia_san_pham: "",
      mo_ta: "",
      hinh_anh: null,
    });
    setEditingProduct(null);
    setPreviewImage("");
  };

  // Tính toán phân trang
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sanPhamList.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sanPhamList.length / itemsPerPage);

  // Xử lý chuyển trang
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="admin-product-management">
      <h1>Quản lý sản phẩm</h1>
      {loading && <p>Đang tải...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {/* Form thêm/sửa sản phẩm */}
      <div className="add-product-form">
        <h2>{editingProduct ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"}</h2>
        {!editingProduct && (
          <input
            type="text"
            name="ma_san_pham"
            placeholder="Mã sản phẩm"
            value={newProduct.ma_san_pham}
            onChange={handleInputChange}
          />
        )}
        <input
          type="text"
          name="ten_san_pham"
          placeholder="Tên sản phẩm"
          value={
            editingProduct
              ? editingProduct.ten_san_pham
              : newProduct.ten_san_pham
          }
          onChange={handleInputChange}
        />
        {/* Menu thả xuống cho loại sản phẩm */}
        <select
          name="loai_san_pham"
          value={
            editingProduct
              ? editingProduct.loai_san_pham
              : newProduct.loai_san_pham
          }
          onChange={handleInputChange}
        >
          <option value="">Chọn loại sản phẩm</option>
          <option value="Dây chuyền">Dây chuyền</option>
          <option value="Nhẫn">Nhẫn</option>
          <option value="Lắc">Lắc</option>
        </select>
        {/* Menu thả xuống cho giới tính */}
        <select
          name="gioi_tinh"
          value={
            editingProduct ? editingProduct.gioi_tinh : newProduct.gioi_tinh
          }
          onChange={handleInputChange}
        >
          <option value="">Chọn giới tính</option>
          <option value="Nam">Nam</option>
          <option value="Nữ">Nữ</option>
        </select>
        <input
          type="number"
          name="gia_san_pham"
          placeholder="Giá"
          value={
            editingProduct
              ? editingProduct.gia_san_pham
              : newProduct.gia_san_pham
          }
          onChange={handleInputChange}
          min="0"
        />
        <input
          type="text"
          name="mo_ta"
          placeholder="Mô tả"
          value={editingProduct ? editingProduct.mo_ta : newProduct.mo_ta}
          onChange={handleInputChange}
        />
        <input
          type="file"
          name="hinh_anh"
          accept="image/*"
          onChange={handleImageChange}
        />
        {previewImage && (
          <img
            src={previewImage}
            alt="Xem trước"
            style={{ maxWidth: "200px", margin: "10px 0" }}
          />
        )}
        {editingProduct ? (
          <>
            <button onClick={handleUpdateProduct} disabled={loading}>
              {loading ? "Đang cập nhật..." : "Cập nhật"}
            </button>
            <button
              onClick={resetForm}
              style={{ marginLeft: "10px" }}
              disabled={loading}
            >
              Hủy
            </button>
          </>
        ) : (
          <button onClick={handleAddProduct} disabled={loading}>
            {loading ? "Đang thêm..." : "Thêm sản phẩm"}
          </button>
        )}
      </div>
      {/* Danh sách sản phẩm */}
      <div className="product-list">
        {loading ? (
          <p>Đang tải danh sách sản phẩm...</p>
        ) : currentItems.length === 0 ? (
          <p>Không có sản phẩm nào để hiển thị.</p>
        ) : (
          currentItems.map((product) => (
            <div key={product.ma_san_pham} className="product-item">
              <h3>{product.ten_san_pham}</h3>
              <p>Mã sản phẩm: {product.ma_san_pham}</p>
              <p>Loại: {product.loai_san_pham}</p>
              <p>Giới tính: {product.gioi_tinh}</p>
              <p>Giá: {formatPrice(product.gia_san_pham)}</p>{" "}
              {/* Định dạng giá */}
              <p>Mô tả: {product.mo_ta}</p>
              {product.hinh_anh && (
                <img
                  src={`${BASE_URL}${product.hinh_anh}`}
                  alt={product.ten_san_pham}
                  style={{ maxWidth: "200px" }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "/default-image.jpg";
                  }}
                />
              )}
              <div className="product-actions">
                <button
                  onClick={() => setEditingProduct(product)}
                  disabled={loading}
                >
                  Sửa
                </button>
                <button
                  onClick={() => handleDeleteProduct(product.ma_san_pham)}
                  style={{ marginLeft: "10px" }}
                  disabled={loading}
                >
                  Xóa
                </button>
              </div>
            </div>
          ))
        )}
      </div>
      {/* Phân trang */}
      {sanPhamList.length > 0 && (
        <div className="pagination">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1 || loading}
          >
            Trang trước
          </button>
          <span>
            Trang {currentPage} / {totalPages}
          </span>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages || loading}
          >
            Trang sau
          </button>
        </div>
      )}
    </div>
  );
}

export default AdminProductManagement;
