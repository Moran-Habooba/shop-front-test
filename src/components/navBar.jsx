import React from "react";
import "./styls/navBar.css";
import { NavLink, Link } from "react-router-dom";
import { useAuth } from "../context/auth.context";
import { useEffect, useState } from "react";
import { getUserById } from "../services/usersService";
import { useDarkMode } from "../context/darkMode.context";
import { useSearch } from "../context/searchContext";
import { useSearchBarRef } from "../context/useSearchBarRef";
const Navbar = () => {
  const { user } = useAuth();
  const searchInput = useSearchBarRef();

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
      getUserById(user._id).then((userData) => {
        setUserName(`${userData.data.first_name}`);
      });
    }
  }, [user]);
  return (
    <nav
      className="navbar navbar-expand-sm  navbar-light"
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
              <NavLink
                to="/"
                className="nav-link with-underline  "
                aria-current="page"
              >
                דף הבית
              </NavLink>
            </li>
            <li className="nav-item ">
              <NavLink to="/about" className="nav-link with-underline">
                אודות
              </NavLink>
            </li>
            <li className="nav-item ">
              <NavLink to="/contact-Us" className="nav-link with-underline">
                צור קשר
              </NavLink>
            </li>
            {isRegularUser && (
              <>
                <li className="nav-item">
                  <NavLink
                    to="/my-favorites"
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
                      <i className="bi bi-box-arrow-in-right me-2 "></i>
                    </span>
                    הרשמה/התחברות
                  </span>
                  <ul
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
          <i
            className="bi bi-cart  fs-3 me-5"
            style={{ cursor: "pointer", color: "#e5b55c" }}
          ></i>

          <form
            className="d-flex"
            onSubmit={(e) => {
              e.preventDefault();
              handleInputChange();
            }}
          >
            <div className="cart-icon">
              <i className="bi bi-cart cart"></i>
            </div>

            <button
              className="btn btn-outline-light me-4 btn-search"
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
