import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import cardsService from "../services/cardsService";

const CardDelete = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const deleteCard = async () => {
      try {
        await cardsService.deleteCard(id);
      } catch (e) {
        console.log("no such card");
      } finally {
        navigate("/my-cards");
      }
    };

    deleteCard();
  }, [id, navigate]);

  return null;
};

export default CardDelete;
