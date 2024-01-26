import { useEffect, useState } from "react";
import cardsService from "../services/cardsService";

export const useMyCards = () => {
  const [cards, setCards] = useState([]);
  const [ServerError, setServerError] = useState("");
  useEffect(() => {
    loadCards();
  }, []);

  // const loadCards = async () => {
  //   const { data } = await cardsService.getAllMyCards();
  //   setCards(data);
  // };
  const loadCards = async () => {
    try {
      const { data } = await cardsService.getAllMyCards();
      setCards(data);
    } catch (error) {
      if (error.response?.status === 404) {
      } else {
        setServerError("An error occurred. Please try again later.");
        console.log(ServerError);
      }
    }
  };

  return { cards, loadCards };
};
