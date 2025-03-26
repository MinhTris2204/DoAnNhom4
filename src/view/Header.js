// src/view/Header.js
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faShoppingCart,
  faUser,
  faSignOutAlt,
} from "@fortawesome/free-solid-svg-icons";

function Header({ cart, isAuthenticated, handleLogout }) {
  const location = useLocation();

  return (
    <header style={styles.header}>
      <div style={styles.brand}>Trang Sức Việt Nam</div>
      <nav>
        <ul style={styles.navLinks}>
          <li>
            <Link
              to="/"
              style={
                location.pathname === "/" ? styles.activeLink : styles.link
              }
            >
              Trang Chủ
            </Link>
          </li>
          <li>
            <Link
              to="/gioi-thieu"
              style={
                location.pathname === "/gioi-thieu"
                  ? styles.activeLink
                  : styles.link
              }
            >
              Giới Thiệu
            </Link>
          </li>
          <li>
            <Link
              to="/san-pham"
              style={
                location.pathname === "/san-pham"
                  ? styles.activeLink
                  : styles.link
              }
            >
              Sản Phẩm
            </Link>
          </li>
          <li>
            <Link
              to="/lien-he"
              style={
                location.pathname === "/lien-he"
                  ? styles.activeLink
                  : styles.link
              }
            >
              Liên Hệ
            </Link>
          </li>
        </ul>
      </nav>
      <div style={styles.icons}>
        <Link to="/tim-kiem" style={styles.iconLink}>
          <FontAwesomeIcon icon={faSearch} style={styles.icon} />
        </Link>
        <Link to="/gio-hang" style={styles.iconLink}>
          <div style={styles.cartContainer}>
            <FontAwesomeIcon icon={faShoppingCart} style={styles.icon} />
            {cart.length > 0 && (
              <span style={styles.cartCount}>{cart.length}</span>
            )}
          </div>
        </Link>
        {isAuthenticated ? (
          <button onClick={handleLogout} style={styles.iconLink}>
            <FontAwesomeIcon icon={faSignOutAlt} style={styles.icon} />
          </button>
        ) : (
          <Link to="/dang-nhap" style={styles.iconLink}>
            <FontAwesomeIcon icon={faUser} style={styles.icon} />
          </Link>
        )}
      </div>
    </header>
  );
}

const styles = {
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "15px 30px",
    backgroundColor: "#f8f9fa",
    color: "#333",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  },
  brand: {
    fontSize: "1.8rem",
    fontWeight: "bold",
    color: "#b8860b",
  },
  navLinks: {
    listStyle: "none",
    display: "flex",
    gap: "20px",
    padding: 0,
    margin: 0,
  },
  link: {
    textDecoration: "none",
    color: "#555",
    fontSize: "1.1rem",
    padding: "8px 12px",
    borderRadius: "5px",
    transition: "color 0.3s, background 0.3s",
  },
  activeLink: {
    textDecoration: "none",
    color: "#fff",
    backgroundColor: "#b8860b",
    fontSize: "1.1rem",
    padding: "8px 12px",
    borderRadius: "5px",
    transition: "background 0.3s",
  },
  icons: {
    display: "flex",
    alignItems: "center",
    gap: "20px",
  },
  icon: {
    cursor: "pointer",
    color: "#b8860b",
    fontSize: "24px",
    transition: "color 0.3s",
  },
  iconLink: {
    textDecoration: "none",
    position: "relative",
  },
  cartContainer: {
    position: "relative",
    display: "inline-block",
  },
  cartCount: {
    position: "absolute",
    top: "-10px",
    right: "-10px",
    backgroundColor: "red",
    color: "white",
    borderRadius: "50%",
    width: "20px",
    height: "20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "12px",
  },
};

export default Header;
