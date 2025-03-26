import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import jewelryBanner from "../image/banner2.png";
import ring from "../image/nhankimcuong1.png";
import necklace from "../image/daychuyen1.png";
import bracelet from "../image/lactaynu1.png";

function TrangChu() {
  const navigate = useNavigate();
  const [isChatOpen, setIsChatOpen] = useState(false); // Trạng thái mở/đóng popup

  // Hàm xử lý khi nhấp vào danh mục trong bộ sưu tập
  const handleCollectionClick = (loai) => {
    navigate(`/san-pham?loai=${loai}`);
  };

  // Hàm toggle popup chat
  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  return (
    <div style={styles.container}>
      {/* Hero Section */}
      <div style={styles.heroSection}>
        <img
          src={jewelryBanner}
          alt="Trang sức cao cấp"
          style={styles.heroImage}
        />
        <div style={styles.heroText}>
          <h1 style={styles.heroTitle}>Vẻ Đẹp Hoàn Hảo - Trang Sức Cao Cấp</h1>
          <p style={styles.heroSubtitle}>
            Khám phá những bộ sưu tập trang sức sang trọng và đẳng cấp nhất
          </p>
          <button
            style={styles.ctaButton}
            onClick={() => navigate("/san-pham")}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = "#8b6508";
              e.target.style.transform = "translateY(-3px)";
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = "#b8860b";
              e.target.style.transform = "translateY(0)";
            }}
          >
            Mua Ngay
          </button>
        </div>
      </div>

      {/* Giới thiệu */}
      <section style={styles.introSection}>
        <h2 style={styles.sectionTitle}>
          Vẻ Đẹp Tinh Tế - Phong Cách Đẳng Cấp
        </h2>
        <p style={styles.sectionText}>
          Chào mừng bạn đến với thế giới của sự tinh xảo và sang trọng. Chúng
          tôi tự hào mang đến những thiết kế trang sức độc đáo, được chế tác từ
          các chất liệu cao cấp như vàng 18K, kim cương tự nhiên, và đá quý chọn
          lọc. Mỗi sản phẩm là một tác phẩm nghệ thuật, giúp bạn tỏa sáng trong
          mọi khoảnh khắc đặc biệt của cuộc sống.
        </p>
      </section>

      {/* Bộ sưu tập */}
      <section style={styles.collectionSection}>
        <h2 style={styles.sectionTitle}>Bộ Sưu Tập Nổi Bật</h2>
        <div style={styles.collectionGrid}>
          <div
            style={styles.collectionItem}
            onClick={() => handleCollectionClick("Nhẫn")}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow =
                "0 6px 15px rgba(0, 0, 0, 0.15)";
              e.currentTarget.style.transform = "translateY(-5px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = "0 4px 10px rgba(0, 0, 0, 0.1)";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <img
              src={ring}
              alt="Nhẫn kim cương"
              style={styles.collectionImage}
            />
            <p style={styles.collectionText}>Nhẫn Kim Cương</p>
          </div>
          <div
            style={styles.collectionItem}
            onClick={() => handleCollectionClick("Dây chuyền")}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow =
                "0 6px 15px rgba(0, 0, 0, 0.15)";
              e.currentTarget.style.transform = "translateY(-5px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = "0 4px 10px rgba(0, 0, 0, 0.1)";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <img
              src={necklace}
              alt="Dây chuyền vàng"
              style={styles.collectionImage}
            />
            <p style={styles.collectionText}>Dây Chuyền Vàng</p>
          </div>
          <div
            style={styles.collectionItem}
            onClick={() => handleCollectionClick("Lắc")}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow =
                "0 6px 15px rgba(0, 0, 0, 0.15)";
              e.currentTarget.style.transform = "translateY(-5px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = "0 4px 10px rgba(0, 0, 0, 0.1)";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <img
              src={bracelet}
              alt="Lắc tay bạc"
              style={styles.collectionImage}
            />
            <p style={styles.collectionText}>Lắc Tay Bạc</p>
          </div>
        </div>
      </section>

      {/* Điểm nổi bật */}
      <section style={styles.highlightSection}>
        <h2 style={styles.sectionTitle}>Tại Sao Chọn Chúng Tôi?</h2>
        <div style={styles.highlightGrid}>
          <div style={styles.highlightItem}>
            <h3 style={styles.highlightTitle}>Chất Lượng Đỉnh Cao</h3>
            <p style={styles.highlightText}>
              Trang sức được chế tác từ nguyên liệu cao cấp, đảm bảo độ bền và
              thẩm mỹ vượt trội.
            </p>
          </div>
          <div style={styles.highlightItem}>
            <h3 style={styles.highlightTitle}>Thiết Kế Độc Quyền</h3>
            <p style={styles.highlightText}>
              Mỗi sản phẩm là sáng tạo riêng, mang đậm dấu ấn cá nhân và phong
              cách hiện đại.
            </p>
          </div>
          <div style={styles.highlightItem}>
            <h3 style={styles.highlightTitle}>Dịch Vụ Chuyên Nghiệp</h3>
            <p style={styles.highlightText}>
              Đội ngũ tư vấn tận tâm, hỗ trợ bạn chọn lựa món trang sức hoàn hảo
              nhất.
            </p>
          </div>
        </div>
      </section>

      {/* Lời kêu gọi hành động */}
      <section style={styles.ctaSection}>
        <h2 style={styles.ctaTitle}>Sẵn Sàng Để Tỏa Sáng?</h2>
        <p style={styles.ctaText}>
          Ghé thăm cửa hàng của chúng tôi ngay hôm nay để khám phá những thiết
          kế độc đáo và sở hữu món trang sức hoàn hảo dành riêng cho bạn.
        </p>
        <button
          style={styles.ctaButton}
          onClick={() => navigate("/san-pham")}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = "#8b6508";
            e.target.style.transform = "translateY(-3px)";
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = "#b8860b";
            e.target.style.transform = "translateY(0)";
          }}
        >
          Khám Phá Ngay
        </button>
      </section>

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
              src="/icons/zalo-icon.png" // Sử dụng icon Zalo bạn đã lưu
              alt="Zalo"
              style={styles.chatOption}
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
            />
          </a>
          <a href="mailto:info@trangsucvn.com" style={styles.chatLink}>
            <img
              src="https://cdn-icons-png.flaticon.com/512/732/732200.png"
              alt="Gmail"
              style={styles.chatOption}
            />
          </a>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    textAlign: "center",
    backgroundColor: "#fffaf0",
    color: "#333",
    paddingTop: "100px",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  heroSection: {
    position: "relative",
    width: "100%",
    height: "600px",
    overflow: "hidden",
    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
  },
  heroImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    objectPosition: "center",
    filter: "brightness(85%)",
  },
  heroText: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    color: "#fff",
    padding: "30px 40px",
    borderRadius: "15px",
    zIndex: "10",
    textAlign: "center",
  },
  heroTitle: {
    fontSize: "2.5rem",
    fontWeight: "700",
    marginBottom: "15px",
    letterSpacing: "1px",
  },
  heroSubtitle: {
    fontSize: "1.2rem",
    marginBottom: "20px",
    fontWeight: "300",
  },
  ctaButton: {
    marginTop: "15px",
    padding: "14px 30px",
    backgroundColor: "#b8860b",
    color: "#fff",
    border: "none",
    borderRadius: "25px",
    cursor: "pointer",
    fontSize: "1.2rem",
    fontWeight: "600",
    transition: "background-color 0.3s ease, transform 0.3s ease",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
  },
  introSection: {
    marginTop: "60px",
    padding: "30px",
    backgroundColor: "#fff",
    borderRadius: "12px",
    maxWidth: "800px",
    marginLeft: "auto",
    marginRight: "auto",
    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.05)",
  },
  sectionTitle: {
    fontSize: "2rem",
    fontWeight: "600",
    color: "#2c3e50",
    marginBottom: "20px",
    letterSpacing: "0.5px",
  },
  sectionText: {
    fontSize: "1.1rem",
    color: "#555",
    lineHeight: "1.6",
    maxWidth: "600px",
    margin: "0 auto",
  },
  collectionSection: {
    marginTop: "60px",
    padding: "30px",
  },
  collectionGrid: {
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap",
    gap: "30px",
    marginTop: "30px",
  },
  collectionItem: {
    textAlign: "center",
    maxWidth: "280px",
    cursor: "pointer",
    backgroundColor: "#fff",
    borderRadius: "12px",
    padding: "15px",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
    transition: "box-shadow 0.3s ease, transform 0.3s ease",
  },
  collectionImage: {
    width: "100%",
    height: "260px",
    objectFit: "cover",
    borderRadius: "10px",
    transition: "transform 0.3s ease",
  },
  collectionText: {
    fontSize: "1.2rem",
    fontWeight: "500",
    color: "#333",
    marginTop: "15px",
  },
  highlightSection: {
    marginTop: "60px",
    padding: "30px",
    backgroundColor: "#f9f9f9",
  },
  highlightGrid: {
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap",
    gap: "30px",
    marginTop: "30px",
  },
  highlightItem: {
    maxWidth: "300px",
    textAlign: "center",
    padding: "20px",
    backgroundColor: "#fff",
    borderRadius: "12px",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.05)",
  },
  highlightTitle: {
    fontSize: "1.5rem",
    fontWeight: "600",
    color: "#2c3e50",
    marginBottom: "10px",
  },
  highlightText: {
    fontSize: "1rem",
    color: "#666",
    lineHeight: "1.5",
  },
  ctaSection: {
    marginTop: "60px",
    padding: "40px",
    backgroundColor: "#fff",
    borderRadius: "12px",
    maxWidth: "800px",
    marginLeft: "auto",
    marginRight: "auto",
    marginBottom: "60px",
    boxShadow: "0 4px 15px rgba(0, 0, 0, 0.05)",
  },
  ctaTitle: {
    fontSize: "2rem",
    fontWeight: "600",
    color: "#2c3e50",
    marginBottom: "15px",
  },
  ctaText: {
    fontSize: "1.1rem",
    color: "#555",
    lineHeight: "1.6",
    marginBottom: "20px",
  },
  // Thêm styles cho icon tin nhắn và popup
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
    animation: "blink 1.5s infinite", // Hiệu ứng nhấp nháy
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
    padding: "10px",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
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

export default TrangChu;
