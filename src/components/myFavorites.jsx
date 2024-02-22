import React, { useCallback, useEffect, useState } from "react";
import Card from "./card";
import cardsService from "../services/cardsService";
import { useSearch } from "../context/searchContext";
import { getUser } from "../services/usersService";
import PageHeader from "../common/pageHeader";

const FavoriteCards = () => {
  const [favoriteCards, setFavoriteCards] = useState([]);
  const { searchTerm } = useSearch();
  const loggedUserId = getUser()._id;

  useEffect(() => {
    if (searchTerm) {
      const filteredCards = favoriteCards.filter((card) =>
        card.title.toLowerCase().startsWith(searchTerm.toLowerCase())
      );
      setFavoriteCards(filteredCards);
    } else {
      loadFavoriteCards();
    }
  }, [searchTerm]);

  useEffect(() => {
    loadFavoriteCards();
  }, []);

  const loadFavoriteCards = async () => {
    const { data } = await cardsService.getAll();
    const likedCards = data.filter((card) =>
      card.likes.includes(getUser()._id)
    );
    setFavoriteCards(likedCards);
  };

  const onLiked = useCallback(async (card) => {
    try {
      await cardsService.likeCard(card._id);
      loadFavoriteCards();
    } catch (err) {
      console.error(err);
    }
  }, []);

  const FavoriteCards = useCallback(() => {
    if (favoriteCards.length === 0 && searchTerm) {
      return (
        <p className="text-danger fw-bold fs-5 text-center">
          לא נמצאו תוצאות מתאימות ל - "{searchTerm}"...
          <br />
          <i className="bi bi-exclamation-triangle fs-3"></i>
        </p>
      );
    } else if (favoriteCards.length === 0) {
      return (
        <p className="text-danger fw-bold fs-5 text-center">
          עדיין אין לך מוצרים ברשימת המועדפים
          <br />
          <i className="bi bi-exclamation-triangle fs-3"></i>
        </p>
      );
    } else
      return (
        <>
          {favoriteCards.map((card) => (
            <Card
              key={card._id}
              card={card}
              onLiked={() => onLiked(card)}
              liked={true}
              isCreator={loggedUserId === card.user_id}
            />
          ))}
        </>
      );
  }, [favoriteCards, loggedUserId, onLiked]);

  return (
    <div>
      <PageHeader
        title=" המועדפים  שלי"
        description=" כאן תוכל לראות את כל המוצרים שאהבת"
      />
      <div className="row">
        <FavoriteCards />
      </div>
    </div>
  );
};

export default FavoriteCards;
