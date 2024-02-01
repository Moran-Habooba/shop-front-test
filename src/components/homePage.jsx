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
const HomePage = () => {
  const [cards, setCards] = useState([]);
  const [visible, setVisible] = useState(8);
  const { searchTerm } = useSearch();

  const { user } = useAuth();
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState("grid");
  // eslint-disable-next-line no-unused-vars
  const [likedCards, setLikedCards] = useState([]);
  useEffect(() => {
    getAll().then((fetchedCards) => {
      setCards(fetchedCards.data);
    });
  }, []);

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
      getAll().then((fetchedCards) => {
        setCards(fetchedCards.data);
      });
    }
  }, [searchTerm]);

  const CardList = useCallback(() => {
    const visibleCards = cards.slice(0, visible);
    if (visibleCards.length === 0) {
      return (
        <div className="fs-3 text-danger fw-bold">
          No cards matching your search...
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
          position: "absolute",
          top: "34%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 2,
        }}
      >
        <div className="carousel-indicators">
          <button
            type="button"
            data-bs-target="#myCarousel"
            data-bs-slide-to="0"
            className="active"
            aria-label="Slide 1"
            aria-current="true"
          ></button>
          <button
            type="button"
            data-bs-target="#myCarousel"
            data-bs-slide-to="1"
            aria-label="Slide 2"
            className=""
          ></button>
        </div>
        <div className="carousel-inner">
          <div className="carousel-item active">
            <img src="baner.png" alt="abner " style={{ width: "100%" }} />
            <svg
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
            </svg>
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
            <img src="baner2.png" alt="banner " style={{ width: "100%" }} />

            <svg
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
            </svg>
            <div className="container"></div>
          </div>
        </div>
        <button
          className="carousel-control-prev"
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
      <div className="image-text-container mt-5 ">
        <div className="image-text-container">
          <div className="image-text-item me-5">
            <img src="minilogo.png" alt="Shipments" />
            <p className="minibaner"> משלוחים עד הבית</p>
          </div>
          <div className="image-text-item me-5">
            <img src="minilogo2.png" alt="Description2" />
            <p className="minibaner"> קנייה מאובטחת</p>
          </div>
          <div className="image-text-item me-5">
            <img src="minilogo3.png" alt="Description3" />
            <p className="minibaner"> מגוון מוצרים איכותיים</p>
          </div>
          <div className="image-text-item me-5">
            <img src="minilogo4.png" alt="Description4" />
            <p className="minibaner"> שרות לקוחות</p>
          </div>
        </div>
      </div>
      <div>
        <h1
          className="text-center mb-5 p-3 border"
          style={{ backgroundColor: "#3b5d50", color: "#e5b55c" }}
        >
          הנבחרים שלנו
        </h1>
      </div>
      <div>
        <button
          className="btn btn-primary ms-1 mb-2 btn-sm"
          onClick={() => toggleViewMode("table")}
        >
          <i className="bi bi-list ms-1"></i>
        </button>
        <button
          className="btn btn-primary  mb-2 btn-sm"
          onClick={() => toggleViewMode("grid")}
        >
          <i className="bi bi-grid ms-1 "></i>
        </button>
        <div className="row">
          {viewMode === "grid" ? <CardList /> : <CardsTable />}
        </div>
        <div>{/* <CardsTable /> */}</div>
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
      </div>
    </>
  );
};

export default HomePage;
