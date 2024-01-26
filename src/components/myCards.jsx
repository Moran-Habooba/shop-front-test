import PageHeader from "../common/pageHeader";
import { Link } from "react-router-dom";
import Card from "./card";
import { useMyCards } from "../hook/useMyCards";
import { useState, useMemo } from "react";
import cardsService from "../services/cardsService";
import { useSearch } from "../context/searchContext";

const MyCards = () => {
  const { cards, loadCards } = useMyCards();
  const { searchTerm } = useSearch();

  const [serverError, setServerError] = useState("");

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
    if (!searchTerm) return cards;
    return cards.filter((card) =>
      card.title.toLowerCase().startsWith(searchTerm.toLowerCase())
    );
  }, [cards, searchTerm]);

  return (
    <>
      <PageHeader
        title="My Cards"
        description={
          <>
            Welcome to your personal card creation hub! On this page, you can
            effortlessly craft and manage a variety of cards designed to
            showcase your services or products to potential customers.
            <br />
            Each card you create here acts as a unique window, offering a
            glimpse into what you have to offer. Navigate through your
            collection, edit details, or delete cards that are no longer needed.
            <br />
            This is your creative space to attract and engage with your
            audience. Start creating and let your offerings shine!
            <div className="text-center mt-3 ">
              <i className="bi bi-arrow-down-circle  text-info fs-1 "></i>
            </div>
          </>
        }
      />
      {serverError && <div className="alert alert-danger">{serverError}</div>}

      <div className="row">
        <Link
          to="/create-card"
          className="mb-5 btn fw-bold fs-3"
          style={{ backgroundColor: "#0a4275", color: "#e5b55c" }}
        >
          Click Here To Create a New Card
        </Link>
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
