import React from "react";

function LienHe() {
  return (
    <div style={styles.container}>
      {/* Tiêu đề */}
      <div style={styles.header}>
        <h2 style={styles.heading}>Liên Hệ Với Chúng Tôi</h2>
        <p style={styles.subHeading}>
          Chúng tôi luôn sẵn sàng hỗ trợ bạn. Hãy liên hệ qua các kênh dưới đây!
        </p>
      </div>

      {/* Phần Thông Tin và Bản Đồ */}
      <div style={styles.contactSection}>
        {/* Thông Tin Liên Hệ */}
        <div style={styles.infoCard}>
          <h3 style={styles.infoTitle}>Thông Tin Liên Lạc</h3>
          <p style={styles.infoText}>
            <strong>Email:</strong>{" "}
            <a href="mailto:info@trangsucvn.com" style={styles.link}>
              info@trangsucvn.com
            </a>
          </p>
          <p style={styles.infoText}>
            <strong>Hotline:</strong>{" "}
            <a href="tel:+84987654321" style={styles.link}>
              0987 654 321
            </a>
          </p>
          <p style={styles.infoText}>
            <strong>Địa chỉ:</strong> 123 Đường Trang Sức, Quận 1, TP. Hồ Chí
            Minh, Việt Nam
          </p>
          <p style={styles.infoText}>
            <strong>Giờ làm việc:</strong> Thứ 2 - Thứ 7, 9:00 - 18:00
          </p>
        </div>

        {/* Bản Đồ */}
        <div style={styles.mapCard}>
          <h3 style={styles.infoTitle}>Vị Trí Của Chúng Tôi</h3>
          <iframe
            style={styles.map}
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.630723957907!2d106.69832561480088!3d10.76262299231995!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f38f8ed56f1%3A0x4d8d8b8b8b8b8b8b!2sHo%20Chi%20Minh%20City!5e0!3m2!1sen!2s!4v1601234567890!5m2!1sen!2s"
            allowFullScreen=""
            loading="lazy"
            title="Bản đồ Trang Sức Việt Nam"
          ></iframe>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "40px 20px",
    fontFamily: "Arial, sans-serif",
  },
  header: {
    textAlign: "center",
    marginBottom: "40px",
  },
  heading: {
    fontSize: "2.5rem",
    color: "#b8860b",
    marginBottom: "10px",
  },
  subHeading: {
    fontSize: "1.2rem",
    color: "#666",
  },
  contactSection: {
    display: "flex",
    flexWrap: "wrap",
    gap: "30px",
    justifyContent: "center", // Căn giữa hai phần khi bỏ biểu mẫu
  },
  infoCard: {
    flex: "1",
    minWidth: "300px",
    maxWidth: "400px", // Giới hạn chiều rộng để cân đối với bản đồ
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.05)",
  },
  mapCard: {
    flex: "1",
    minWidth: "300px",
    maxWidth: "600px", // Tăng chiều rộng bản đồ để cân đối
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "8px",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.05)",
  },
  infoTitle: {
    fontSize: "1.5rem",
    color: "#b8860b",
    marginBottom: "20px",
  },
  infoText: {
    fontSize: "1rem",
    color: "#333",
    margin: "12px 0",
    lineHeight: "1.6",
  },
  link: {
    color: "#b8860b",
    textDecoration: "none",
    transition: "color 0.3s",
  },
  map: {
    width: "100%",
    height: "350px",
    border: "none",
    borderRadius: "8px",
  },
};

export default LienHe;
