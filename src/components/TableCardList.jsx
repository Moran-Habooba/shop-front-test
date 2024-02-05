import React, { useState, useEffect } from "react";
import cardsService from "../services/cardsService";
import Swal from "sweetalert2";
import { useAuth } from "../context/auth.context";
import { addToCart } from "../services/cartService";
import "./styls/cardstable.css";
import { getAllCategories } from "../services/categoryService";

const CardsTable = () => {
  const [cards, setCards] = useState([]);
  const { user } = useAuth();

  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await getAllCategories();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);
  useEffect(() => {
    const fetchCards = async () => {
      try {
        let { data } = await cardsService.getAll();
        if (selectedCategory) {
          data = data.filter((card) => card.category === selectedCategory);
        }
        if (sortOrder === "priceAsc") {
          data.sort((a, b) => a.price - b.price);
        } else if (sortOrder === "priceDesc") {
          data.sort((a, b) => b.price - a.price);
        }
        setCards(data);
      } catch (error) {
        console.error("Error loading cards:", error);
      }
    };

    fetchCards();
  }, [selectedCategory, sortOrder]);

  //////

  useEffect(() => {
    cardsService.getAll().then((res) => {
      const cardsWithQuantityAndLiked = res.data.map((card) => {
        return {
          ...card,
          orderQuantity: 0,
          isLiked: card.likes.includes(user?._id),
        };
      });
      setCards(cardsWithQuantityAndLiked);
    });
  }, [user]);

  const increaseCount = (cardId) => {
    setCards((currentCards) =>
      currentCards.map((card) =>
        card._id === cardId && card.quantity > card.orderQuantity
          ? { ...card, orderQuantity: card.orderQuantity + 1 }
          : card
      )
    );
  };

  const decreaseCount = (cardId) => {
    setCards((currentCards) =>
      currentCards.map((card) =>
        card._id === cardId && card.orderQuantity > 0
          ? { ...card, orderQuantity: card.orderQuantity - 1 }
          : card
      )
    );
  };
  const handleAddToCart = async (cardId, orderQuantity) => {
    if (orderQuantity > 0) {
      try {
        const res = await addToCart(cardId, orderQuantity);
        if (res.status === 200) {
          Swal.fire({
            icon: "success",
            title: "המוצר נוסף לסל בהצלחה!",
            showConfirmButton: false,
            timer: 1000,
            customClass: {
              popup: "small-popup",
            },
          });
        }
      } catch (error) {
        console.error("Error adding product to cart:", error);
        Swal.fire({
          icon: "error",
          title: "שגיאה",
          text: "לא ניתן להוסיף את המוצר לסל.",
          customClass: {
            popup: "small-popup",
          },
        });
      }
    } else {
      Swal.fire({
        icon: "error",
        title: "שגיאה",
        text: "יש לבחור כמות מוצרים להוספה",
        customClass: {
          popup: "small-popup",
        },
      });
    }
  };
  const handleToggleFavorite = async (cardId, isLiked) => {
    try {
      const res = await cardsService.likeCard(cardId, { liked: !isLiked });
      if (res.status === 200) {
        setCards((currentCards) =>
          currentCards.map((card) =>
            card._id === cardId ? { ...card, isLiked: !card.isLiked } : card
          )
        );
      } else {
        throw new Error("Failed to update favorite status");
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  return (
    <div className="custom-table">
      <div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="form-select mb-3"
          style={{ width: "200px" }}
        >
          <option value=""> בחר קטגוריה </option>
          {categories.map((category) => (
            <option key={category._id} value={category.name}>
              {category.name}
            </option>
          ))}
        </select>
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="form-select mb-3"
          style={{ width: "200px" }}
        >
          <option value="">מיון</option>
          <option value="priceAsc">מחיר - מהנמוך לגבוה</option>
          <option value="priceDesc">מחיר - מהגבוה לנמוך</option>
        </select>
      </div>
      {cards.length === 0 ? (
        <p className="text-danger fs-4">אין מוצרים בקטגוריה זו...</p>
      ) : (
        <table className="table table-bordered">
          <thead></thead>
          <tbody>
            {cards.map((card) => (
              <tr key={card._id}>
                <td>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <img
                      src={
                        card.image_file?.path
                          ? `http://localhost:3000/${card.image_file.path}`
                          : "DefaultImg.svg.png"
                      }
                      alt={card.title}
                      style={{
                        width: "100px",
                        marginRight: "10px",
                        marginLeft: "30px",
                      }}
                    />
                    <div>
                      <h4 className="card-title">{card.title}</h4>
                      <p>{card.description}</p>
                      {user && (
                        <div className="d-flex align-items-center me-2">
                          <div className="heart-icon-container ms-1">
                            <button
                              className="button-no-style"
                              onClick={() =>
                                handleToggleFavorite(card._id, card.isLiked)
                              }
                            >
                              <i
                                className={`bi ${
                                  card.isLiked
                                    ? "bi-heart-fill heart-icon"
                                    : "bi-heart heart-icon"
                                }`}
                              ></i>
                            </button>
                          </div>
                          {!user?.isAdmin && (
                            <span className="me-2">
                              {card.isLiked ? "הסר ממועדפים" : "הוסף למועדפים"}
                            </span>
                          )}
                          {user?.isAdmin && (
                            <div className="likes-count">
                              {card.likes.length}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </td>

                <td>
                  <p className="price">מחיר: ₪{card.price}</p>
                  <p className="category">קטגוריה: {card.category}</p>
                  {!user?.isAdmin && (
                    <>
                      <button
                        className="quantity me-2 ms-1"
                        onClick={() => increaseCount(card._id)}
                      >
                        +
                      </button>
                      <span> {card.orderQuantity}</span>
                      <button
                        className="quantity me-2"
                        onClick={() => decreaseCount(card._id)}
                      >
                        -
                      </button>
                      <button
                        className="quantity me-3"
                        onClick={() =>
                          handleAddToCart(card._id, card.orderQuantity)
                        }
                      >
                        הוסף לסל
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default CardsTable;
