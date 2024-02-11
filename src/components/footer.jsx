import React, { useState } from "react";
import "./styls/footer.css";
import { NavLink, Link } from "react-router-dom";
import { useAuth } from "../context/auth.context";
import { getAllCategories } from "../services/categoryService";
import { useEffect } from "react";

const Footer = () => {
  const { user } = useAuth();
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    try {
      getAllCategories().then(({ data }) => {
        setCategories(data);
      });
    } catch (error) {
      console.error(error);
    }
  }, []);
  return (
    <footer className="footer py-3" style={{ position: "relative" }}>
      <Link to={"/"} className="navbar-brand custom">
        <img
          src="/logo.png"
          alt="Logo"
          style={{ maxHeight: "100%", height: "250px" }}
        />
      </Link>
      <ul className="nav justify-content-center mb-3">
        <li className="nav-item">
          <NavLink to="/" className="nav-link px-2">
            דף הבית
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/about" className="nav-link px-2">
            אודות
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/contact-Us" className="nav-link px-2">
            צור קשר
          </NavLink>
        </li>
        <li className="nav-item dropdown">
          <NavLink
            to="/categories"
            className="nav-link dropdown-toggle"
            id="navbarDropdownCategories"
            role="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            קטגוריות
          </NavLink>
          <ul
            className="dropdown-menu"
            aria-labelledby="navbarDropdownCategories"
          >
            {categories.map((category) => (
              <li key={category._id}>
                <NavLink
                  to={`/categories/${category.name}`}
                  className="dropdown-item"
                >
                  {category.name}
                </NavLink>
              </li>
            ))}
          </ul>
        </li>
        {user && !user.isAdmin && (
          <li className="nav-item">
            <NavLink to="/my-favorites" className="nav-link px-2">
              המועדפים שלי
            </NavLink>
          </li>
        )}
        {user && user.isAdmin && (
          <li className="nav-item">
            <NavLink to="/my-cards" className="nav-link px-2">
              הוספת מוצר
            </NavLink>
          </li>
        )}
        {user && user.isAdmin && (
          <li className="nav-item">
            <NavLink to="/my-cards" className="nav-link px-2">
              מוצרים
            </NavLink>
          </li>
        )}

        {user && user.isAdmin && (
          <li className="nav-item">
            <NavLink to="/sand-box" className="nav-link px-2">
              ניהול החנות
            </NavLink>
          </li>
        )}
      </ul>
      <div
        style={{
          fontSize: "20px",
          textAlign: "center",
          display: "flex",
          justifyContent: "center",
          height: "55px",
        }}
      >
        אתר שומר שבת
        <img
          src="/candles.png"
          alt="candles"
          style={{
            marginLeft: "10px",
            marginTop: "2px",
            height: "25px",
            marginRight: "7px",
          }}
        />
      </div>
      <p className="text-center">
        © {new Date().getFullYear()} Moran Habooba, Inc
      </p>
    </footer>
  );
};

export default Footer;
