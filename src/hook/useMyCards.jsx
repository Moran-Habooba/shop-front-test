import { useEffect, useState, useCallback } from "react";
import cardsService from "../services/cardsService";

// export const useMyCards = () => {
//   const [cards, setCards] = useState([]);
//   const [ServerError, setServerError] = useState("");
//   useEffect(() => {
//     loadCards();
//   }, []);

//   const loadCards = async () => {
//     try {
//       const { data } = await cardsService.getAll();
//       setCards(data);
//     } catch (error) {
//       if (error.response?.status === 404) {
//       } else {
//         setServerError("An error occurred. Please try again later.");
//         console.log(ServerError);
//       }
//     }
//   };

//   return { cards, loadCards };
// };
export const useMyCards = () => {
  const [cards, setCards] = useState([]);
  const [ServerError, setServerError] = useState("");

  const loadCards = useCallback(async () => {
    try {
      const { data } = await cardsService.getAll();
      setCards(data);
    } catch (error) {
      if (error.response?.status !== 404) {
        setServerError("An error occurred. Please try again later.");
      }
    }
  }, []);

  useEffect(() => {
    loadCards();
  }, [loadCards]);

  return { cards, loadCards, ServerError };
};
