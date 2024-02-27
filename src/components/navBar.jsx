import React from "react";
import "./styls/navBar.css";
import { NavLink, Link } from "react-router-dom";
import { useAuth } from "../context/auth.context";
import { useEffect, useState } from "react";
import { getUserById } from "../services/usersService";
import { useDarkMode } from "../context/darkMode.context";
import { useSearch } from "../context/searchContext";
import { useSearchBarRef } from "../context/useSearchBarRef";
import { getAllCategories } from "../services/categoryService";
import { useCart } from "../context/cart.context";

const Navbar = () => {
  const { user } = useAuth();
  const searchInput = useSearchBarRef();
  const [categories, setCategories] = useState([]);
  const { totalItemsInCart = 0 } = useCart();
  const [isNavExpanded, setIsNavExpanded] = useState(false);
  const isRegularUser = user && !user.isBusiness && !user.isAdmin;

  const { darkMode, setDarkMode } = useDarkMode();

  const { setSearchTerm } = useSearch();
  const [userName, setUserName] = useState("");

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
      try {
        getUserById(user._id).then((userData) => {
          setUserName(`${userData.data.first_name}`);
        });
      } catch (error) {
        console.error(error);
      }
    }
  }, [user]);
  useEffect(() => {
    try {
      getAllCategories().then(({ data }) => {
        setCategories(data);
      });
    } catch (error) {
      if (!error.response || error.response.status !== 429) {
        console.error("Error fetching data:", error);
      }
    }
  }, []);
  const handleNavLinkClick = () => {
    setIsNavExpanded(false);
  };
  return (
    <nav
      className="navbar navbar-expand-lg  navbar-light"
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
          onClick={() => setIsNavExpanded(!isNavExpanded)}
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded={isNavExpanded ? "true" : "false"}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div
          className={`collapse navbar-collapse ${isNavExpanded ? "show" : ""}`}
          id="navbarSupportedContent"
        >
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <NavLink
                to="/"
                className="nav-link with-underline  "
                aria-current="page"
                onClick={handleNavLinkClick}
              >
                דף הבית
              </NavLink>
            </li>
            <li className="nav-item ">
              <NavLink
                to="/about"
                className="nav-link with-underline"
                onClick={handleNavLinkClick}
              >
                אודות
              </NavLink>
            </li>
            <li className="nav-item ">
              <NavLink
                to="/contact-Us"
                className="nav-link with-underline"
                onClick={handleNavLinkClick}
              >
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
                onClick={handleNavLinkClick}
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
                      onClick={handleNavLinkClick}
                    >
                      {category.name}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </li>
            {isRegularUser && (
              <>
                <li className="nav-item">
                  <NavLink
                    to="/my-favorites"
                    onClick={handleNavLinkClick}
                    className="nav-link with-underline"
                  >
                    המועדפים שלי
                  </NavLink>
                </li>
              </>
            )}

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
                    className="nav-link dropdown-toggle  "
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
                    onClick={handleNavLinkClick}
                    className="dropdown-menu "
                    aria-labelledby="navbarDropdown "
                  >
                    <>
                      <li>
                        <NavLink to="/sign-up" className="dropdown-item ">
                          הירשם
                        </NavLink>
                      </li>
                      <li>
                        <NavLink to="/sign-in" className="dropdown-item ">
                          התחבר
                        </NavLink>
                      </li>
                    </>
                  </ul>
                </>
              )}
            </li>
            {user ? (
              <li>
                <Link to="/user-edit">
                  <img
                    className="ms-2 mt-1"
                    src="/DefaultImg.svg.png"
                    alt="Default profile"
                    width="30"
                    height="30"
                    onClick={handleNavLinkClick}
                  />
                </Link>
                <span
                  className="navbar-text ms-3 fw-bold "
                  style={{ color: "#e5b55c" }}
                >
                  שלום, {userName}
                </span>
              </li>
            ) : (
              <li></li>
            )}
          </ul>
          <Link to="/ShoppingCart" style={{ textDecoration: "none" }}>
            <i
              onClick={handleNavLinkClick}
              className="bi bi-cart  fs-3 me-5"
              style={{ cursor: "pointer", color: "#e5b55c" }}
            ></i>
          </Link>
          <span className="cart-item-count me-2">{totalItemsInCart}</span>

          <form
            className="d-flex"
            onSubmit={(e) => {
              e.preventDefault();
              handleInputChange();
            }}
          >
            <button
              className="btn btn-outline-light me-4 btn-search"
              onClick={handleNavLinkClick}
              type="submit"
            >
              חיפוש
            </button>
            <input
              ref={searchInput}
              className="form-control me-2"
              type="search"
              placeholder="חיפוש"
              onInput={(e) => {
                if (!e.target.value) setSearchTerm("");
              }}
              aria-label="Search"
              name="search"
            />
            <span>
              <NavLink onClick={toggleDarkMode}>
                <i
                  onClick={handleNavLinkClick}
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

export default Navbar;
