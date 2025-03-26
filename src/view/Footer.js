import React from "react";

function Footer() {
  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        {/* Copyright Section */}
        <div style={styles.section}>
          <p style={styles.text}>
            © {new Date().getFullYear()} Trang Sức Việt Nam. All rights
            reserved.
          </p>
        </div>

        {/* Contact Information Section */}
        <div style={styles.section}>
          <h3 style={styles.heading}>Liên Hệ Với Chúng Tôi</h3>
          <p style={styles.contactText}>
            Email:{" "}
            <a href="mailto:info@trangsucvn.com" style={styles.link}>
              info@trangsucvn.com
            </a>
          </p>
          <p style={styles.contactText}>
            Hotline:{" "}
            <a href="tel:+84987654321" style={styles.link}>
              0987 654 321
            </a>
          </p>
          <p style={styles.contactText}>
            Địa chỉ: 123 Đường Trang Sức, Quận 1, TP. Hồ Chí Minh, Việt Nam
          </p>
        </div>

        {/* Social Media Section */}
        <div style={styles.section}>
          <h3 style={styles.heading}>Theo Dõi Chúng Tôi</h3>
          <p style={styles.contactText}>
            <a
              href="https://facebook.com/trangsucvn"
              style={styles.link}
              target="_blank"
              rel="noopener noreferrer"
            >
              Facebook
            </a>{" "}
            |{" "}
            <a
              href="https://instagram.com/trangsucvn"
              style={styles.link}
              target="_blank"
              rel="noopener noreferrer"
            >
              Instagram
            </a>{" "}
            |{" "}
            <a
              href="https://zalo.me/0987654321"
              style={styles.link}
              target="_blank"
              rel="noopener noreferrer"
            >
              Zalo
            </a>
          </p>
        </div>

        {/* Certification Section */}
        <div style={styles.section}>
          <h3 style={styles.heading}>Chứng Nhận</h3>
          <p style={styles.contactText}>Chứng nhận ISO 9001:2015</p>
          <p style={styles.contactText}>
            Chứng nhận GIA (Gemological Institute of America)
          </p>
          <p style={styles.contactText}>
            Đạt tiêu chuẩn chất lượng Bộ Công Thương
          </p>
        </div>
      </div>
    </footer>
  );
}

const styles = {
  footer: {
    backgroundColor: "#f8f9fa",
    padding: "30px 15px",
    color: "#333",
    boxShadow: "0 -4px 6px rgba(0, 0, 0, 0.1)",
    marginTop: "30px",
  },
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-around",
    gap: "20px",
  },
  section: {
    flex: "1",
    minWidth: "250px",
    textAlign: "center",
  },
  text: {
    fontSize: "1rem",
    color: "#b8860b",
    fontWeight: "bold",
    marginBottom: "10px",
  },
  heading: {
    fontSize: "1.2rem",
    color: "#b8860b",
    fontWeight: "bold",
    marginBottom: "15px",
  },
  contactText: {
    fontSize: "0.9rem",
    color: "#333",
    margin: "8px 0",
    lineHeight: "1.5",
  },
  link: {
    color: "#b8860b",
    textDecoration: "none",
    transition: "color 0.3s",
  },
};

export default Footer;
