import PageHeader from "../common/pageHeader";
import { Link } from "react-router-dom";
import Card from "./card";
import { useMyCards } from "../hook/useMyCards";
import { useState, useMemo, useEffect } from "react";
import cardsService from "../services/cardsService";
import { useSearch } from "../context/searchContext";
import categoryService from "../services/categoryService";

const MyCards = () => {
  const { cards, loadCards } = useMyCards();
  const { searchTerm } = useSearch();

  const [serverError, setServerError] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    categoryService
      .getAllCategories()
      .then(({ data }) => {
        setCategories(data);
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
      });
  }, []);
  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const onLiked = async (card) => {
    try {
      await cardsService.likeCard(card._id);

      await loadCards();
    } catch (err) {
      if (err.response?.status === 400) {
        setServerError(err.response.data);
      } else {
        console.error(err);
        setServerError("An error occurred.");
      }
    }
  };

  const filteredCards = useMemo(() => {
    if (!searchTerm && !selectedCategory) return cards;
    return cards.filter((card) =>
      card.title.toLowerCase().startsWith(searchTerm.toLowerCase())
    );
  }, [cards, searchTerm, selectedCategory]);

  return (
    <>
      <PageHeader
        title="המוצרים בחנות "
        description={
          <>
            בעמוד זה תוכלו ליצור ולנהל ללא מאמץ מוצרים חדשים לאתר שנועדו להציג
            את
            <br />
            המוצרים שלכם ללקוחות פוטנציאליים.
            <br />
            ערוך פרטים או מחק מוצרים שאינם רלוונטים עוד.
            <div className="text-center mt-3 "></div>
          </>
        }
      />
      {serverError && <div className="alert alert-danger">{serverError}</div>}

      <div className="row">
        <Link
          to="/create-card"
          className="mb-5 btn fw-bold fs-3"
          style={{ backgroundColor: "#3b5d50", color: "#e5b55c" }}
        >
          לחץ כאן להוספת מוצר חדש לחנות
          <i className="bi bi-plus-circle-fill me-2"></i>
        </Link>
      </div>
      <div className="row">
        <div className="col-12 col-md-4 mb-3">
          <h5 className="fs-6">מיין לפי קטגוריה:</h5>
          <select
            value={selectedCategory}
            onChange={handleCategoryChange}
            className="form-select"
            style={{ width: "auto" }}
          >
            <option value="">הצג את כל הקטגוריות</option>
            {categories.map((category) => (
              <option key={category._id} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="row">
        {!filteredCards.length ? (
          <p className="text-danger fw-bold fs-5 text-center">
            No cards...
            <br />
            <i className="bi bi-exclamation-triangle fs-3"></i>
          </p>
        ) : (
          filteredCards.map((card) => (
            <Card
              onLiked={() => onLiked(card)}
              card={card}
              key={card._id}
              liked={card.likes.includes(card.user_id)}
            />
          ))
        )}
      </div>
    </>
  );
};

export default MyCards;
