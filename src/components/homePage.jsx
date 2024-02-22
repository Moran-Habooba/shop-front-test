import React, { useState, useEffect, useCallback } from "react";
import cardsService, { getAll } from "../services/cardsService";
import Card from "./card";
import { Link, useNavigate } from "react-router-dom";
import "./styls/homePage.css";
import "./styls/carousel.css";
import { getUser } from "../services/usersService";
import { useSearch } from "../context/searchContext";
import Swal from "sweetalert2";
import { useAuth } from "../context/auth.context";
import CardsTable from "./TableCardList";
import { getAllCategories } from "../services/categoryService";

const HomePage = () => {
  const [cards, setCards] = useState([]);
  const [visible, setVisible] = useState(8);
  const { searchTerm } = useSearch();

  const [sortOrder, setSortOrder] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [originalCards, setOriginalCards] = useState([]);

  const { user } = useAuth();
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState("grid");
  // eslint-disable-next-line no-unused-vars
  const [likedCards, setLikedCards] = useState([]);
  /////////
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data: fetchedCards } = await getAll();
        setOriginalCards(fetchedCards);
        setCards(fetchedCards);
        const { data } = await getAllCategories();
        setCategories(data);
      } catch (error) {
        if (!error.response || error.response.status !== 429) {
          console.error("Error fetching data:", error);
        }
      }
    };
    fetchData();
  }, []);

  // סינון ומיון הכרטיסים בהתאם לבחירות
  useEffect(() => {
    let filteredCards = [...originalCards];

    if (searchTerm) {
      filteredCards = filteredCards.filter((card) =>
        card.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory) {
      filteredCards = filteredCards.filter(
        (card) => card.category === selectedCategory
      );
    }

    if (sortOrder) {
      filteredCards.sort((a, b) =>
        sortOrder === "priceAsc" ? a.price - b.price : b.price - a.price
      );
    }

    setCards(filteredCards.slice(0, visible));
  }, [originalCards, searchTerm, selectedCategory, sortOrder, visible]);

  ////////

  // useEffect(() => {
  //   try {
  //     getAll().then((fetchedCards) => {
  //       setCards(fetchedCards.data);
  //     });
  //   } catch (error) {
  //     if (!error.response || error.response.status !== 429) {
  //       console.error(error);
  //     }
  //   }
  // }, [viewMode]);

  // useEffect(() => {
  //   getAll()
  //     .then((fetchedCards) => {
  //       setCards(fetchedCards.data);
  //     })
  //     .catch((error) => {
  //       if (!error.response || error.response.status !== 429) {
  //         console.error(error);
  //       }
  //     });
  // }, [viewMode]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedCards = await getAll();
        setCards(fetchedCards.data);
      } catch (error) {
        if (!error.response || error.response.status !== 429) {
          console.error(error);
        }
      }
    };
    fetchData();
  }, [viewMode]);

  const showMoreCards = () => {
    setVisible((prevVisible) => prevVisible + 4);
  };

  const toggleViewMode = async (mode) => {
    setViewMode(mode);

    if (mode === "table") {
      const response = await getAll();
      setLikedCards(
        response.data.filter((updatedCard) =>
          updatedCard.likes.includes(user?._id)
        )
      );
    }
  };

  const onLiked = async (card) => {
    try {
      await cardsService.likeCard(card._id);
      const response = await getAll();
      setCards(response.data);
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => {
    const fetchAndFilterCards = async () => {
      const { data } = await getAll();
      const filteredCards = data.filter((card) =>
        card.title.toLowerCase().startsWith(searchTerm.toLowerCase())
      );
      setCards(filteredCards);
    };

    if (searchTerm) {
      fetchAndFilterCards();
    } else {
      try {
        getAll().then((fetchedCards) => {
          setCards(fetchedCards.data);
        });
      } catch (error) {
        if (!error.response || error.response.status !== 429) {
          console.error(error);
        }
      }
    }
  }, [searchTerm]);

  const CardList = useCallback(() => {
    const visibleCards = cards.slice(0, visible);
    if (visibleCards.length === 0) {
      return (
        <div className="fs-3 text-danger fw-bold">
          לא נמצאו מוצרים התואמים לחיפוש שלך...
        </div>
      );
    }

    return (
      <>
        {visibleCards.map((card) => {
          const user = getUser();
          const isLiked = user ? card.likes.includes(user._id) : false;
          return card.title ? (
            <Card
              key={card._id}
              card={card}
              onLiked={() => onLiked(card)}
              liked={isLiked}
            />
          ) : null;
        })}
      </>
    );
  }, [cards, visible]);

  const handleSignUpClick = (e) => {
    e.preventDefault();

    if (user) {
      Swal.fire({
        title: "אתה כבר משתמש רשום 😊",
        icon: "info",
        timer: 1300,
        timerProgressBar: true,
      });
    } else {
      navigate("/sign-up");
    }
  };

  return (
    <>
      <div
        id="myCarousel"
        className="carousel slide"
        data-bs-ride="carousel"
        style={{
          zIndex: 2,
        }}
      >
        <div className="carousel-inner">
          <div className="carousel-item active">
            <img
              src="baner.png"
              alt="baner "
              // style={{ width: "100%" }}
              className="img-fluid"
            />

            {/* <svg
              className="bd-placeholder-img"
              width="100%"
              height="100%"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
              preserveAspectRatio="xMidYMid slice"
              focusable="false"
            >
              <rect
                width="100%"
                height="100%"
                fill="var(--bs-secondary-color)"
              ></rect>
            </svg> */}
            <div className="container">
              <div className="carousel-caption text-end">
                <p>
                  <Link
                    to="/sign-up"
                    onClick={handleSignUpClick}
                    className="btn btn-lg btn-primary btnbanner"
                  >
                    הירשם עכשיו
                  </Link>
                </p>
              </div>
            </div>
          </div>
          <div className="carousel-item">
            <img
              src="baner2.png"
              alt="banner "
              // style={{ width: "100%" }}
              className="img-fluid"
            />

            {/* <svg
              className="bd-placeholder-img"
              width="100%"
              height="100%"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
              preserveAspectRatio="xMidYMid slice"
              focusable="false"
            >
              <rect
                width="100%"
                height="100%"
                fill="var(--bs-secondary-color)"
              ></rect>
            </svg> */}
            <div className="container"></div>
          </div>
        </div>
        <button
          className="carousel-control-prev "
          type="button"
          data-bs-target="#myCarousel"
          data-bs-slide="prev"
        >
          <span
            className="carousel-control-prev-icon"
            aria-hidden="true"
          ></span>
        </button>
        <button
          className="carousel-control-next"
          type="button"
          data-bs-target="#myCarousel"
          data-bs-slide="next"
        >
          <span
            className="carousel-control-next-icon"
            aria-hidden="true"
          ></span>
        </button>
      </div>
      {/* ----------- */}
      <div>
        <div className="image-text-container">
          <div className="image-text-item ">
            <img src="minilogo.png" alt="Shipments" />
            <p className="minibaner"> משלוחים עד הבית</p>
          </div>
          <div className="image-text-item">
            <img
              className="img-banner"
              src="minilogo2.png"
              alt="Description2"
            />
            <p className="minibaner"> קנייה מאובטחת</p>
          </div>
          <div className="image-text-item">
            <img
              className="img-banner"
              src="minilogo3.png"
              alt="Description3"
            />
            <p className="minibaner"> מגוון מוצרים איכותיים</p>
          </div>
          <div className="image-text-item">
            <img
              className="img-banner"
              src="minilogo4.png"
              alt="Description4"
            />
            <p className="minibaner"> שרות לקוחות</p>
          </div>
        </div>
      </div>
      <div>
        <h1
          className="text-center mb-5 p-3 border "
          style={{ backgroundColor: "#3b5d50", color: "#e5b55c" }}
        >
          הנבחרים שלנו
        </h1>
      </div>
      {viewMode === "grid" && (
        <div className="filter-container">
          {/* סינון לפי קטגוריה */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="form-select mb-3 "
            style={{ width: "200px" }}
          >
            <option value="">בחר קטגוריה</option>
            {categories.map((category) => (
              <option key={category._id} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>

          {/* מיון לפי מחיר */}
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="form-select mb-3"
            style={{ width: "200px" }}
          >
            <option value="">מיין לפי מחיר</option>
            <option value="priceAsc">מחיר מנמוך לגבוה</option>
            <option value="priceDesc">מחיר מגבוה לנמוך</option>
          </select>
        </div>
      )}
      <div className="view-mode-container">
        <span className="btn-view-mode-text">תצוגה:</span>
        <button
          className="btn btn-view-mode"
          onClick={() => toggleViewMode("table")}
        >
          <i className="bi bi-list"></i>
        </button>
        <button
          className="btn btn-view-mode"
          onClick={() => toggleViewMode("grid")}
        >
          <i className="bi bi-grid"></i>
        </button>
      </div>

      <div className="row">
        {viewMode === "grid" ? <CardList /> : <CardsTable />}
      </div>

      <div className="d-flex justify-content-center my-3">
        <button
          className="btn btn-info mb-4 fw-bold LoadMoreBtn"
          onClick={showMoreCards}
          style={{
            backgroundColor: "#3b5d50",
            color: "#e5b55c",
            border: "none",
          }}
        >
          טען עוד מוצרים
        </button>
      </div>
      {/* </div> */}
    </>
  );
};

export default HomePage;
