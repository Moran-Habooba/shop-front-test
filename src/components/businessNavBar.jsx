import React, { useState } from "react";
import { NavLink, Link } from "react-router-dom";
import { useAuth } from "../context/auth.context";
import { useEffect } from "react";

import { useDarkMode } from "../context/darkMode.context";
import { useSearch } from "../context/searchContext";
import { useSearchBarRef } from "../context/useSearchBarRef";
import { getAllCategories } from "../services/categoryService";
import { getUserById } from "../services/usersService";
import "./styls/search.css";
const BusinessNavBar = () => {
  const { user } = useAuth();
  const { darkMode, setDarkMode } = useDarkMode();
  const { setSearchTerm } = useSearch();
  const searchInput = useSearchBarRef();

  const [categories, setCategories] = useState([]);

  const [userName, setUserName] = useState("");
  const [userProfileImage, setUserProfileImage] = useState("");

  const handleInputChange = () => {
    setSearchTerm(searchInput.current.value);
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add("dark-mode");
    } else {
      document.body.classList.remove("dark-mode");
    }
  }, [darkMode]);

  useEffect(() => {
    if (user && user._id) {
      getUserById(user._id).then((userData) => {
        setUserName(`${userData.data.first_name}`);
        setUserProfileImage(userData.data.image_file.path || "");
      });
    }
  }, [user]);

  useEffect(() => {
    getAllCategories().then(({ data }) => {
      setCategories(data);
    });
  }, []);

  return (
    <nav
      className="navbar navbar-expand-md  navbar-light"
      style={{ height: "160px" }}
    >
      <div className="container-fluid mt-5">
        <div className="logo mb-5 ">
          <Link to={"/"} className="navbar-brand">
            <div className="logo ">
              <img src="/logo.png" alt="Logo" height="300" />
            </div>
          </Link>
        </div>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <NavLink to="/" className="nav-link" aria-current="page">
                דף הבית
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/about" className="nav-link">
                אודות
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/contact-Us" className="nav-link">
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
            <li className="nav-item">
              <NavLink to="/my-favorites" className="nav-link">
                המועדפים שלי
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/ShoppingCart" className="nav-link">
                עגלת קניות
              </NavLink>
            </li>

            <li className="nav-item dropdown">
              {user ? (
                <NavLink to="/sign-out" className="nav-link dropdown-item">
                  <i className="bi bi-box-arrow-left me-2"></i>
                  התנתק
                </NavLink>
              ) : (
                <>
                  {/* Signed out drop down (with button) */}
                  <span
                    className="nav-link dropdown-toggle"
                    href="#"
                    id="navbarDropdown"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <span>
                      <i className="bi bi-box-arrow-in-right me-2"></i>
                    </span>
                    הרשמה/התחברות
                  </span>
                  <ul
                    className="dropdown-menu"
                    aria-labelledby="navbarDropdown"
                  >
                    <>
                      <li>
                        <NavLink to="/sign-up" className="dropdown-item">
                          הירשם
                        </NavLink>
                      </li>
                      <li>
                        <NavLink to="/sign-in" className="dropdown-item">
                          התחבר
                        </NavLink>
                      </li>
                      <li></li>
                    </>
                  </ul>
                </>
              )}
            </li>
            {user ? (
              <li>
                <Link to="/user-edit">
                  <img
                    src={
                      userProfileImage
                        ? `http://localhost:3000/${userProfileImage}`
                        : "/DefaultImg.svg.png"
                    }
                    className="ms-2 mt-1  rounded-circle"
                    alt="Profile "
                    width="30"
                    height="30"
                  />
                </Link>
                <span
                  className="navbar-text ms-3 fw-bold  "
                  style={{ color: "#e5b55c" }}
                >
                  שלום, {userName}
                </span>
              </li>
            ) : (
              <li></li>
            )}
          </ul>
          {/* עגלת קניות------------ */}
          <Link to="/ShoppingCart" style={{ textDecoration: "none" }}>
            <i
              className="bi bi-cart  fs-3 me-5"
              style={{ cursor: "pointer", color: "#e5b55c" }}
            ></i>
          </Link>
          <span className="cart-item-count me-2">1</span>

          <form
            className="d-flex"
            onSubmit={(e) => {
              e.preventDefault();
              handleInputChange();
            }}
          >
            <button
              className="btn btn-outline-light me-4 btn-search"
              type="submit"
            >
              חיפוש
            </button>
            <input
              ref={searchInput}
              className="form-control me-2 search"
              type="search"
              placeholder="חיפוש"
              aria-label="Search"
              name="search"
              onInput={(e) => {
                if (!e.target.value) setSearchTerm("");
              }}
            />
            <span>
              <NavLink onClick={toggleDarkMode}>
                <i
                  className={`bi bi-moon-stars-fill me-3  ${
                    darkMode ? "dark-mode-icon" : "light-mode-icon"
                  }`}
                ></i>
              </NavLink>
            </span>
          </form>
        </div>
      </div>
    </nav>
  );
};

export default BusinessNavBar;
