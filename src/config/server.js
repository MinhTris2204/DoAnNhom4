// -----------------------------
// Khai báo module
// - Các thư viện được nhập vào để sử dụng trong ứng dụng
const express = require("express"); // Framework để xây dựng ứng dụng web và API
const mysql = require("mysql2"); // Thư viện để kết nối và tương tác với cơ sở dữ liệu MySQL
const cors = require("cors"); // Middleware để cho phép yêu cầu từ các nguồn khác (cross-origin)
const dotenv = require("dotenv"); // Thư viện để tải biến môi trường từ file .env
const bodyParser = require("body-parser"); // Middleware để phân tích dữ liệu JSON từ body của request
const session = require("express-session"); // Middleware để quản lý phiên (session) người dùng
const multer = require("multer"); // Middleware để xử lý upload file (như hình ảnh)
const path = require("path"); // Module Node.js để làm việc với đường dẫn tệp
const fs = require("fs"); // Module Node.js để làm việc với hệ thống tệp (file system)
const jwt = require("jsonwebtoken"); // Thư viện để tạo và xác thực JSON Web Token (JWT) cho xác thực
const bcrypt = require("bcrypt"); // Thư viện để mã hóa mật khẩu

const saltRounds = 10; // Số vòng mã hóa cho bcrypt (càng cao càng an toàn nhưng chậm hơn)
const app = express(); // Khởi tạo ứng dụng Express
const port = 3001; // Cổng mà server sẽ chạy

// -----------------------------
// Cấu hình môi trường
// - Tải các biến môi trường từ file .env để sử dụng trong ứng dụng
dotenv.config();

// Cấu hình thư mục lưu trữ ảnh
// - Tạo thư mục 'images' nếu chưa tồn tại để lưu trữ các file hình ảnh được upload
const uploadDir = path.join(__dirname, "images"); // Đường dẫn đến thư mục 'images'
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir); // Tạo thư mục nếu chưa có
  console.log("Thư mục 'images' đã được tạo.");
}

// -----------------------------
// Middleware
// - Các middleware được áp dụng cho mọi request đi qua server
app.use(cors({ origin: "http://localhost:3000", credentials: true })); // Cho phép yêu cầu từ localhost:3000 và gửi cookie
app.use(bodyParser.json()); // Phân tích body của request thành định dạng JSON
app.use("/images", express.static(path.join(__dirname, "images"))); // Phục vụ file tĩnh từ thư mục 'images'
app.use(
  session({
    secret: process.env.SESSION_SECRET || "your-secret-key", // Khóa bí mật để mã hóa session
    resave: false, // Không lưu lại session nếu không có thay đổi
    saveUninitialized: true, // Lưu session mới ngay cả khi chưa có dữ liệu
    cookie: { secure: false }, // Cookie không yêu cầu HTTPS (chỉ dùng trong dev)
  })
);

// -----------------------------
// Cấu hình Multer để upload file
// - Cấu hình cách lưu trữ file hình ảnh khi upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images/"); // Đặt thư mục đích là 'images'
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9); // Tạo tên file duy nhất bằng thời gian + số ngẫu nhiên
    const ext = path.extname(file.originalname); // Lấy đuôi file (ví dụ: .jpg, .png)
    cb(null, file.fieldname + "-" + uniqueSuffix + ext); // Đặt tên file: fieldname-timestamp-random.ext
  },
});
const upload = multer({ storage: storage }); // Khởi tạo Multer với cấu hình trên

// -----------------------------
// Kết nối cơ sở dữ liệu MySQL
// - Thiết lập kết nối tới cơ sở dữ liệu MySQL sử dụng thông tin từ biến môi trường
const connection = mysql.createConnection({
  host: process.env.DB_HOST, // Địa chỉ host của MySQL
  port: process.env.DB_PORT, // Cổng MySQL
  user: process.env.DB_USER, // Tên người dùng MySQL
  password: process.env.DB_PASSWORD, // Mật khẩu MySQL
  database: process.env.DB_DATABASE, // Tên cơ sở dữ liệu
});

connection.connect((err) => {
  if (err) {
    console.error("Lỗi kết nối MySQL: ", err); // Báo lỗi nếu kết nối thất bại
    return;
  }
  console.log("Kết nối thành công đến MySQL!"); // Thông báo thành công
});

// -----------------------------
// Hàm xác thực token
// - Middleware để kiểm tra token JWT trong header của request
const authenticateToken = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1]; // Lấy token từ header (Bearer <token>)
  if (!token) return res.status(401).json({ error: "Chưa đăng nhập" }); // Không có token -> trả lỗi 401

  jwt.verify(
    token,
    process.env.JWT_SECRET || "your-jwt-secret", // Xác thực token bằng khóa bí mật
    (err, user) => {
      if (err) return res.status(403).json({ error: "Token không hợp lệ" }); // Token không hợp lệ -> lỗi 403
      req.user = user; // Lưu thông tin user từ token vào request
      next(); // Chuyển tiếp request nếu token hợp lệ
    }
  );
};

// -----------------------------
// API Người dùng (User)
// - API đăng ký người dùng mới
app.post("/api/user/register", (req, res) => {
  const { ten_dang_nhap, mat_khau, email, ho_ten, so_dien_thoai } = req.body; // Lấy dữ liệu từ body

  if (!ten_dang_nhap || !mat_khau || !email || !ho_ten || !so_dien_thoai) {
    return res.status(400).json({ error: "Thiếu thông tin cần thiết" }); // Kiểm tra dữ liệu đầy đủ
  }

  bcrypt.hash(mat_khau, saltRounds, (err, hashedPassword) => {
    // Mã hóa mật khẩu
    if (err) {
      console.error("Lỗi mã hóa mật khẩu: ", err);
      return res.status(500).json({ error: "Lỗi server" });
    }

    const query =
      "INSERT INTO nguoidung (ten_dang_nhap, mat_khau, email, ho_ten, so_dien_thoai, ngay_tao) VALUES (?, ?, ?, ?, ?, NOW())";
    connection.query(
      query,
      [ten_dang_nhap, hashedPassword, email, ho_ten, so_dien_thoai], // Thêm user vào bảng nguoidung
      (err, result) => {
        if (err) {
          console.error("Lỗi khi đăng ký người dùng: ", err);
          if (err.code === "ER_DUP_ENTRY") {
            // Kiểm tra lỗi trùng lặp
            if (err.message.includes("ten_dang_nhap")) {
              return res
                .status(400)
                .json({ error: "Tên đăng nhập đã tồn tại" });
            } else if (err.message.includes("email")) {
              return res.status(400).json({ error: "Email đã được sử dụng" });
            }
          }
          return res.status(500).json({
            error: "Không thể đăng ký tài khoản",
            details: err.message,
          });
        }
        res.status(201).json({ message: "Đăng ký thành công" }); // Trả về thành công
      }
    );
  });
});

// - API đăng nhập người dùng
app.post("/api/user/login", (req, res) => {
  const { ten_dang_nhap, mat_khau } = req.body; // Lấy thông tin đăng nhập

  if (!ten_dang_nhap || !mat_khau) {
    return res.status(400).json({ error: "Thiếu thông tin cần thiết" });
  }

  const query = "SELECT * FROM nguoidung WHERE ten_dang_nhap = ?";
  connection.query(query, [ten_dang_nhap], (err, results) => {
    // Tìm user trong cơ sở dữ liệu
    if (err) {
      console.error("Lỗi khi đăng nhập: ", err);
      return res.status(500).json({ error: "Lỗi server" });
    }

    if (results.length === 0) {
      return res.status(401).json({ error: "Tên đăng nhập không tồn tại" });
    }

    const user = results[0];
    bcrypt.compare(mat_khau, user.mat_khau, (err, isMatch) => {
      // So sánh mật khẩu
      if (err) {
        console.error("Lỗi kiểm tra mật khẩu: ", err);
        return res.status(500).json({ error: "Lỗi server" });
      }

      if (!isMatch) {
        return res.status(401).json({ error: "Mật khẩu không đúng" });
      }

      const token = jwt.sign(
        {
          ma_nguoi_dung: user.ma_nguoi_dung,
          ten_dang_nhap: user.ten_dang_nhap,
        },
        process.env.JWT_SECRET || "your-jwt-secret",
        { expiresIn: "1h" } // Tạo token với thời hạn 1 giờ
      );

      res.json({
        message: "Đăng nhập thành công",
        token,
        user: {
          ten_dang_nhap: user.ten_dang_nhap,
          ho_ten: user.ho_ten,
          so_dien_thoai: user.so_dien_thoai,
          dia_chi: user.dia_chi,
          email: user.email,
        },
      }); // Trả về token và thông tin user
    });
  });
});

// -----------------------------
// API Admin
// - API đăng ký admin
app.post("/api/auth/register", (req, res) => {
  const { ten_dang_nhap, mat_khau, email } = req.body;

  if (!ten_dang_nhap || !mat_khau || !email) {
    return res.status(400).json({ error: "Thiếu thông tin cần thiết" });
  }

  const query =
    "INSERT INTO admins (ten_dang_nhap, mat_khau, email) VALUES (?, ?, ?)";
  connection.query(query, [ten_dang_nhap, mat_khau, email], (err, result) => {
    // Thêm admin vào bảng admins
    if (err) {
      console.error("Lỗi khi đăng ký: ", err);
      return res.status(500).json({ error: "Không thể đăng ký tài khoản" });
    }
    res.status(201).json({ message: "Đăng ký thành công" });
  });
});

// - API đăng nhập admin
app.post("/api/auth/login", (req, res) => {
  const { ten_dang_nhap, mat_khau } = req.body;

  if (!ten_dang_nhap || !mat_khau) {
    return res.status(400).json({ error: "Thiếu thông tin cần thiết" });
  }

  const query = "SELECT * FROM admins WHERE ten_dang_nhap = ?";
  connection.query(query, [ten_dang_nhap], (err, results) => {
    if (err) {
      console.error("Lỗi khi đăng nhập: ", err);
      return res.status(500).json({ error: "Lỗi server" });
    }

    if (results.length === 0) {
      return res.status(401).json({ error: "Tên đăng nhập không tồn tại" });
    }

    const admin = results[0];
    if (mat_khau !== admin.mat_khau) {
      // So sánh mật khẩu dạng plaintext (không mã hóa)
      return res.status(401).json({ error: "Mật khẩu không đúng" });
    }

    const token = jwt.sign(
      { ma_admin: admin.ma_admin, ten_dang_nhap: admin.ten_dang_nhap },
      process.env.JWT_SECRET || "your-jwt-secret",
      { expiresIn: "1h" }
    );

    res.json({ message: "Đăng nhập thành công", token });
  });
});

// - API đăng xuất admin
app.post("/api/auth/logout", (req, res) => {
  req.session.destroy((err) => {
    // Hủy session của admin
    if (err) {
      return res.status(500).json({ error: "Không thể đăng xuất" });
    }
    res.json({ message: "Đăng xuất thành công" });
  });
});

// - API dashboard admin (yêu cầu xác thực)
app.get("/api/admin/dashboard", authenticateToken, (req, res) => {
  res.json({ message: "Chào mừng đến Admin Dashboard", user: req.user }); // Trả về thông tin user từ token
});

// -----------------------------
// API Quản lý người dùng (Admin)
// - Lấy danh sách người dùng
app.get("/api/admin/users", authenticateToken, (req, res) => {
  const query = "SELECT * FROM nguoidung";
  connection.query(query, (err, results) => {
    if (err) {
      console.error("Lỗi khi lấy danh sách người dùng: ", err);
      return res
        .status(500)
        .json({ error: "Không thể lấy danh sách người dùng" });
    }
    res.json(results); // Trả về tất cả người dùng
  });
});

// - Xóa người dùng
app.delete("/api/admin/users/:ma_nguoi_dung", authenticateToken, (req, res) => {
  const ma_nguoi_dung = req.params.ma_nguoi_dung;
  const query = "DELETE FROM nguoidung WHERE ma_nguoi_dung = ?";
  connection.query(query, [ma_nguoi_dung], (err, result) => {
    if (err) {
      console.error("Lỗi khi xóa người dùng: ", err);
      return res.status(500).json({ error: "Không thể xóa người dùng" });
    }
    if (result.affectedRows === 0) {
      // Kiểm tra nếu không có user nào bị xóa
      return res.status(404).json({ error: "Người dùng không tồn tại" });
    }
    res.json({ message: "Xóa người dùng thành công" });
  });
});

// -----------------------------
// API Sản phẩm
// - Lấy tất cả sản phẩm
app.get("/api/sanpham", (req, res) => {
  connection.query("SELECT * FROM sanpham", (err, results) => {
    if (err) {
      console.error("Lỗi truy vấn SQL: ", err);
      res.status(500).json({ error: "Không thể lấy dữ liệu sản phẩm" });
    } else {
      res.json(results); // Trả về danh sách sản phẩm
    }
  });
});

// - Thêm sản phẩm mới
app.post("/api/sanpham", upload.single("hinh_anh"), (req, res) => {
  const {
    ma_san_pham,
    ten_san_pham,
    loai_san_pham,
    gioi_tinh,
    gia_san_pham,
    mo_ta,
  } = req.body;
  const hinh_anh = req.file ? `/images/${req.file.filename}` : null; // Lấy đường dẫn ảnh nếu có

  if (!ma_san_pham) {
    return res.status(400).json({ error: "Mã sản phẩm là bắt buộc" });
  }

  const query =
    "INSERT INTO sanpham (ma_san_pham, ten_san_pham, loai_san_pham, gioi_tinh, gia_san_pham, mo_ta, hinh_anh) VALUES (?, ?, ?, ?, ?, ?, ?)";
  const values = [
    ma_san_pham,
    ten_san_pham,
    loai_san_pham,
    gioi_tinh,
    gia_san_pham,
    mo_ta,
    hinh_anh,
  ];

  connection.query(query, values, (err, result) => {
    if (err) {
      console.error("Lỗi khi thêm sản phẩm: ", err);
      res.status(500).json({ error: "Không thể thêm sản phẩm" });
    } else {
      res.json({
        ma_san_pham,
        ten_san_pham,
        loai_san_pham,
        gioi_tinh,
        gia_san_pham,
        mo_ta,
        hinh_anh,
      }); // Trả về thông tin sản phẩm vừa thêm
    }
  });
});

// - Cập nhật sản phẩm
app.put("/api/sanpham/:ma_san_pham", upload.single("hinh_anh"), (req, res) => {
  const ma_san_pham = req.params.ma_san_pham;
  const { ten_san_pham, loai_san_pham, gioi_tinh, gia_san_pham, mo_ta } =
    req.body;
  let hinh_anh = null;

  if (req.file) {
    // Nếu có ảnh mới, sử dụng ảnh mới
    hinh_anh = `/images/${req.file.filename}`;
  } else {
    // Nếu không có ảnh mới, giữ ảnh cũ
    const queryGetOldImage =
      "SELECT hinh_anh FROM sanpham WHERE ma_san_pham = ?";
    connection.query(queryGetOldImage, [ma_san_pham], (err, results) => {
      if (err) {
        console.error("Lỗi khi lấy hình ảnh cũ: ", err);
        res.status(500).json({ error: "Không thể cập nhật sản phẩm" });
        return;
      }
      hinh_anh = results[0]?.hinh_anh || null;

      const queryUpdate =
        "UPDATE sanpham SET ten_san_pham = ?, loai_san_pham = ?, gioi_tinh = ?, gia_san_pham = ?, mo_ta = ?, hinh_anh = ? WHERE ma_san_pham = ?";
      const values = [
        ten_san_pham,
        loai_san_pham,
        gioi_tinh,
        gia_san_pham,
        mo_ta,
        hinh_anh,
        ma_san_pham,
      ];

      connection.query(queryUpdate, values, (err, result) => {
        if (err) {
          console.error("Lỗi khi cập nhật sản phẩm: ", err);
          res.status(500).json({ error: "Không thể cập nhật sản phẩm" });
        } else {
          res.json({
            ma_san_pham,
            ten_san_pham,
            loai_san_pham,
            gioi_tinh,
            gia_san_pham,
            mo_ta,
            hinh_anh,
          });
        }
      });
    });
    return;
  }

  const queryUpdate =
    "UPDATE sanpham SET ten_san_pham = ?, loai_san_pham = ?, gioi_tinh = ?, gia_san_pham = ?, mo_ta = ?, hinh_anh = ? WHERE ma_san_pham = ?";
  const values = [
    ten_san_pham,
    loai_san_pham,
    gioi_tinh,
    gia_san_pham,
    mo_ta,
    hinh_anh,
    ma_san_pham,
  ];

  connection.query(queryUpdate, values, (err, result) => {
    if (err) {
      console.error("Lỗi khi cập nhật sản phẩm: ", err);
      res.status(500).json({ error: "Không thể cập nhật sản phẩm" });
    } else {
      res.json({
        ma_san_pham,
        ten_san_pham,
        loai_san_pham,
        gioi_tinh,
        gia_san_pham,
        mo_ta,
        hinh_anh,
      });
    }
  });
});

// - Xóa sản phẩm
app.delete("/api/sanpham/:ma_san_pham", (req, res) => {
  const ma_san_pham = req.params.ma_san_pham;

  const queryGetImage = "SELECT hinh_anh FROM sanpham WHERE ma_san_pham = ?";
  connection.query(queryGetImage, [ma_san_pham], (err, results) => {
    // Lấy đường dẫn ảnh để xóa
    if (err) {
      console.error("Lỗi khi lấy hình ảnh: ", err);
      res.status(500).json({ error: "Không thể xóa sản phẩm" });
      return;
    }

    const hinh_anh = results[0]?.hinh_anh;
    if (hinh_anh) {
      const filePath = path.join(
        __dirname,
        "images",
        hinh_anh.split("/images/")[1]
      );
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath); // Xóa file ảnh khỏi hệ thống
      }
    }

    connection.query(
      "DELETE FROM sanpham WHERE ma_san_pham = ?",
      [ma_san_pham],
      (err, result) => {
        if (err) {
          console.error("Lỗi khi xóa sản phẩm: ", err);
          res.status(500).json({ error: "Không thể xóa sản phẩm" });
        } else {
          res.json({ message: "Xóa sản phẩm thành công" });
        }
      }
    );
  });
});

// -----------------------------
// API Thanh toán
// - Lưu thông tin thanh toán (đơn hàng)
app.post("/api/thanh-toan", authenticateToken, (req, res) => {
  const {
    items,
    tong_tien,
    customerInfo,
    ngay_dat_hang,
    hinh_thuc_thanh_toan,
  } = req.body;

  console.log("Dữ liệu nhận được:", req.body);

  if (
    !items ||
    !tong_tien ||
    !customerInfo ||
    !ngay_dat_hang ||
    !hinh_thuc_thanh_toan
  ) {
    return res.status(400).json({ error: "Thiếu thông tin cần thiết" });
  }

  if (!["chuyen_khoan", "tien_mat"].includes(hinh_thuc_thanh_toan)) {
    // Kiểm tra hình thức thanh toán hợp lệ
    return res.status(400).json({ error: "Hình thức thanh toán không hợp lệ" });
  }

  const queries = items.map((item) => {
    // Tạo mảng truy vấn cho từng sản phẩm trong đơn hàng
    const sql = `
      INSERT INTO thanhtoan (
        ma_san_pham, 
        ten_san_pham, 
        gia_san_pham, 
        hinh_anh, 
        so_luong, 
        ho_ten, 
        dia_chi, 
        so_dien_thoai, 
        tong_tien, 
        ngay_dat_hang,
        hinh_thuc_thanh_toan
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [
      item.ma_san_pham,
      item.ten_san_pham,
      parseFloat(item.gia_san_pham),
      item.hinh_anh || null,
      item.so_luong || 1,
      customerInfo.ho_ten,
      customerInfo.dia_chi,
      customerInfo.so_dien_thoai,
      parseFloat(tong_tien),
      new Date(ngay_dat_hang),
      hinh_thuc_thanh_toan,
    ];

    return new Promise((resolve, reject) => {
      // Trả về Promise để xử lý bất đồng bộ
      connection.query(sql, values, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  });

  Promise.all(queries) // Chờ tất cả truy vấn hoàn tất
    .then((results) => {
      res.status(200).json({
        message: "Đơn hàng đã được lưu thành công!",
        insertedIds: results.map((r) => r.insertId), // Trả về ID của các bản ghi vừa thêm
      });
    })
    .catch((err) => {
      console.error("Lỗi khi lưu đơn hàng: ", err);
      res.status(500).json({
        error: "Lỗi khi lưu đơn hàng",
        details: err.message,
      });
    });
});

// -----------------------------
// API Quản lý đơn hàng (Admin)
// - Lấy danh sách đơn hàng
app.get("/api/admin/orders", authenticateToken, (req, res) => {
  const query = "SELECT * FROM thanhtoan ORDER BY ngay_dat_hang DESC";
  connection.query(query, (err, results) => {
    if (err) {
      console.error("Lỗi khi lấy dữ liệu đơn hàng: ", err);
      return res.status(500).json({ error: "Không thể lấy dữ liệu đơn hàng" });
    }
    res.json(results); // Trả về danh sách đơn hàng, sắp xếp theo ngày giảm dần
  });
});

// -----------------------------
// API Báo cáo doanh thu (Admin)
// - Lấy báo cáo doanh thu theo ngày hoặc tháng
app.get("/api/admin/revenue", authenticateToken, (req, res) => {
  const { filter } = req.query; // Lấy tham số filter từ query (day hoặc month)
  let query;

  if (filter === "month") {
    // Báo cáo theo tháng
    query = `
      SELECT 
        DATE_FORMAT(ngay_dat_hang, '%Y-%m') AS period,
        SUM(tong_tien) AS totalRevenue,
        COUNT(ma_don_hang) AS orderCount
      FROM thanhtoan
      GROUP BY DATE_FORMAT(ngay_dat_hang, '%Y-%m')
      ORDER BY period DESC
    `;
  } else {
    // Báo cáo theo ngày (mặc định)
    query = `
      SELECT 
        DATE(ngay_dat_hang) AS period,
        SUM(tong_tien) AS totalRevenue,
        COUNT(ma_don_hang) AS orderCount
      FROM thanhtoan
      GROUP BY DATE(ngay_dat_hang)
      ORDER BY period DESC
    `;
  }

  connection.query(query, (err, results) => {
    if (err) {
      console.error("Lỗi khi lấy báo cáo doanh thu: ", err);
      return res.status(500).json({ error: "Không thể lấy dữ liệu báo cáo" });
    }
    res.json(results); // Trả về dữ liệu tổng hợp (kỳ, doanh thu, số đơn hàng)
  });
});

// -----------------------------
// Khởi động server
// - Khởi chạy server trên cổng đã định nghĩa
app.listen(port, () => {
  console.log(`Server đang chạy tại http://localhost:${port}`);
});
