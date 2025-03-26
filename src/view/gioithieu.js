import React, { useState } from "react";
import { Link } from "react-router-dom";

function GioiThieu() {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  return (
    <div style={styles.container}>
      {/* Tiêu đề */}
      <div style={styles.header}>
        <h2 style={styles.title}>Về Trang Sức Việt Nam</h2>
        <p style={styles.subtitle}>
          Nơi lưu giữ vẻ đẹp truyền thống và phong cách hiện đại
        </p>
      </div>

      {/* Nội dung giới thiệu */}
      <div style={styles.content}>
        <p style={styles.description}>
          <strong>Trang Sức Việt Nam</strong> tự hào mang đến những tuyệt tác
          trang sức cao cấp, nơi vẻ đẹp truyền thống hòa quyện cùng thiết kế
          hiện đại. Mỗi sản phẩm là kết tinh từ bàn tay tài hoa của các nghệ
          nhân giàu kinh nghiệm, sử dụng chất liệu quý như vàng 18K, kim cương
          tự nhiên và đá quý thượng hạng.
        </p>
        <p style={styles.description}>
          Chúng tôi không chỉ tạo ra trang sức, mà còn lan tỏa giá trị văn hóa
          Việt qua từng chi tiết tinh xảo. Dù là món quà ý nghĩa cho người thân
          yêu hay biểu tượng phong cách cá nhân,{" "}
          <strong>Trang Sức Việt Nam</strong> luôn là lựa chọn hoàn hảo.
        </p>
      </div>

      {/* Cam kết */}
      <div style={styles.commitment}>
        <h3 style={styles.sectionTitle}>Cam Kết Của Chúng Tôi</h3>
        <ul style={styles.list}>
          <li style={styles.listItem}>Chất lượng đạt chuẩn quốc tế</li>
          <li style={styles.listItem}>Bảo hành trọn đời cho mọi sản phẩm</li>
          <li style={styles.listItem}>Dịch vụ thiết kế riêng theo yêu cầu</li>
        </ul>
      </div>

      {/* Button */}
      <Link
        to="/san-pham"
        style={{
          ...styles.button,
          backgroundColor: isHovered ? "#b8860b" : "#d4a373",
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        Khám Phá Bộ Sưu Tập
      </Link>

      {/* Icon Tin Nhắn */}
      <div style={styles.chatIcon} onClick={toggleChat}>
        <img
          src="https://cdn-icons-png.flaticon.com/512/134/134718.png"
          alt="Chat"
          style={styles.chatIconImg}
        />
      </div>

      {/* Popup Liên Hệ */}
      {isChatOpen && (
        <div style={styles.chatPopup}>
          <a
            href="https://zalo.me/0987654321"
            target="_blank"
            rel="noopener noreferrer"
            style={styles.chatLink}
          >
            <img
              src="https://cdn-icons-png.flaticon.com/512/2111/2111728.png"
              alt="Zalo"
              style={styles.chatOption}
              onMouseEnter={(e) => (e.target.style.transform = "scale(1.1)")}
              onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
            />
          </a>
          <a
            href="https://facebook.com/trangsucvn"
            target="_blank"
            rel="noopener noreferrer"
            style={styles.chatLink}
          >
            <img
              src="https://cdn-icons-png.flaticon.com/512/733/733547.png"
              alt="Facebook"
              style={styles.chatOption}
              onMouseEnter={(e) => (e.target.style.transform = "scale(1.1)")}
              onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
            />
          </a>
          <a href="mailto:info@trangsucvn.com" style={styles.chatLink}>
            <img
              src="https://cdn-icons-png.flaticon.com/512/732/732200.png"
              alt="Gmail"
              style={styles.chatOption}
              onMouseEnter={(e) => (e.target.style.transform = "scale(1.1)")}
              onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
            />
          </a>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "900px", // Giảm maxWidth để bố cục gọn hơn khi không có ảnh
    margin: "0 auto",
    padding: "50px 20px",
    fontFamily: "'Arial', sans-serif",
    backgroundColor: "#fff",
    borderRadius: "10px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
  },
  header: {
    textAlign: "center",
    marginBottom: "40px",
  },
  title: {
    fontSize: "2.8rem",
    color: "#b8860b",
    fontWeight: "bold",
    marginBottom: "10px",
  },
  subtitle: {
    fontSize: "1.3rem",
    color: "#666",
    fontStyle: "italic",
  },
  content: {
    marginBottom: "30px",
  },
  description: {
    fontSize: "1.1rem",
    lineHeight: "1.8",
    color: "#444",
    marginBottom: "20px",
    textAlign: "justify",
  },
  commitment: {
    backgroundColor: "#f9f9f9",
    padding: "20px",
    borderRadius: "8px",
    marginBottom: "40px",
  },
  sectionTitle: {
    fontSize: "1.6rem",
    color: "#b8860b",
    marginBottom: "15px",
    fontWeight: "bold",
    textAlign: "center",
  },
  list: {
    listStyleType: "none",
    padding: "0",
    textAlign: "left",
    maxWidth: "500px",
    margin: "0 auto",
  },
  listItem: {
    fontSize: "1.1rem",
    color: "#555",
    margin: "10px 0",
    position: "relative",
    paddingLeft: "25px",
  },
  button: {
    display: "inline-block",
    padding: "14px 30px",
    fontSize: "1.2rem",
    color: "#fff",
    backgroundColor: "#d4a373",
    border: "none",
    borderRadius: "5px",
    textDecoration: "none",
    cursor: "pointer",
    transition: "background-color 0.3s, transform 0.2s",
    boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
    margin: "0 auto",
    display: "block", // Đảm bảo button nằm giữa
  },
  chatIcon: {
    position: "fixed",
    bottom: "20px",
    right: "20px",
    width: "60px",
    height: "60px",
    backgroundColor: "#b8860b",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
    animation: "blink 1.5s infinite",
    zIndex: "1000",
  },
  chatIconImg: {
    width: "35px",
    height: "35px",
  },
  chatPopup: {
    position: "fixed",
    bottom: "90px",
    right: "20px",
    backgroundColor: "#fff",
    borderRadius: "10px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
    padding: "15px",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    zIndex: "1000",
  },
  chatLink: {
    textDecoration: "none",
  },
  chatOption: {
    width: "40px",
    height: "40px",
    transition: "transform 0.3s",
  },
};

// Thêm keyframes cho hiệu ứng nhấp nháy
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = `
  @keyframes blink {
    0% { opacity: 1; }
    50% { opacity: 0.5; }
    100% { opacity: 1; }
  }
`;
document.head.appendChild(styleSheet);

export default GioiThieu;
