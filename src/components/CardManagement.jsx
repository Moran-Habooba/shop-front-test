import React, { useEffect, useState } from "react";
import {
  getAll,
  deleteCard,
  getCardBizNumber,
  updateCardBizNumber,
} from "../services/cardsService";
import "./styls/CardManagement.css";

const CardManagement = () => {
  const [cards, setCards] = useState([]);
  const [editBizNumber, setEditBizNumber] = useState(null);
  const [newBizNumber, setNewBizNumber] = useState("");
  const [error, setError] = useState("");
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const [hasStartedEditing, setHasStartedEditing] = useState(false);

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const { data } = await getAll();
        const cardsWithBizNumber = await Promise.all(
          data.map(async (card) => {
            const bizNumberResponse = await getCardBizNumber(card._id);
            return { ...card, bizNumber: bizNumberResponse.data.bizNumber };
          })
        );
        setCards(cardsWithBizNumber);
      } catch (error) {
        console.error("Error fetching cards:", error);
      }
    };

    fetchCards();
  }, []);

  const handleDeleteCard = async (id) => {
    await deleteCard(id);
    setCards(cards.filter((card) => card._id !== id));
  };

  const handleEditBizNumber = (id) => {
    const card = cards.find((card) => card._id === id);
    setEditBizNumber(id);
    setNewBizNumber(card.bizNumber);
    setHasStartedEditing(false);
  };

  const handleUpdateBizNumber = async (id) => {
    if (newBizNumber.length < 7 || newBizNumber.length > 7) {
      setError("מספר מזהה לא חוקי. חייב להיות 7 ספרות בדיוק");
      setIsButtonDisabled(true);
      return;
    }
    setIsButtonDisabled(false);
    try {
      const response = await updateCardBizNumber(id, newBizNumber);
      if (response.status === 200) {
        setCards(
          cards.map((card) =>
            card._id === id ? { ...card, bizNumber: newBizNumber } : card
          )
        );
      } else {
        setError("Failed to update the biz number on the server.");
      }
    } catch (error) {
      console.error("Error updating biz number:", error);
      setError("An error occurred while updating the biz number.");
    }
    setIsButtonDisabled(false);
    setEditBizNumber(null);
    setError("");
  };
  useEffect(() => {
    if (hasStartedEditing) {
      if (newBizNumber.length === 7) {
        setIsButtonDisabled(false);
        setError("");
      } else {
        setIsButtonDisabled(true);
        setError("מספר מזהה לא חוקי. חייב להיות 7 ספרות בדיוק");
      }
    }
  }, [newBizNumber, hasStartedEditing]);

  // const handleDeleteCategory = async (categoryName) => {
  //   try {
  //     await Category.deleteOne({ name: categoryName });
  //     // Additional logic...
  //   } catch (error) {
  //     console.error("Error deleting category:", error);
  //     // Handle error...
  //   }
  // };

  const handleCancelEdit = () => {
    setEditBizNumber(null);
    setError("");
  };

  return (
    <div>
      <h1 className="text-center">ניהול מוצרים</h1>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>מזהה ID</th>
            <th>כותרת</th>
            <th> קטגוריה</th>
            <th> כמות במלאי החנות</th>
            <th>מספר מזהה של מוצר</th>
            <th>עריכת מספר מזהה / מחיקת מוצר</th>
          </tr>
        </thead>
        <tbody>
          {cards.map((card) => (
            <tr key={card._id}>
              <td data-label="מספר מזהה">{card._id}</td>
              <td data-label="שם המוצר">{card.title}</td>
              <td data-label="קטגוריה">{card.category}</td>
              <td data-label="כמות במלאי">{card.quantity}</td>
              <td>
                {editBizNumber === card._id ? (
                  <>
                    <input
                      type="text"
                      value={newBizNumber}
                      onChange={(e) => {
                        setNewBizNumber(e.target.value);
                        setHasStartedEditing(true);
                      }}
                    />
                    {error && <div style={{ color: "red" }}>{error}</div>}
                  </>
                ) : (
                  card.bizNumber
                )}
              </td>
              <td>
                {editBizNumber === card._id ? (
                  <>
                    <button
                      disabled={isButtonDisabled}
                      className="btn btn-primary"
                      onClick={() => handleUpdateBizNumber(card._id)}
                    >
                      שמירה
                    </button>
                    <button
                      className="btn btn-secondary ms-3"
                      onClick={handleCancelEdit}
                    >
                      ביטול
                    </button>
                  </>
                ) : (
                  <>
                    <div className="button-container">
                      <button
                        className="btn btn-info  ms-2 btn-a"
                        onClick={() => handleEditBizNumber(card._id)}
                      >
                        עריכת מספר מזהה
                      </button>
                      <button
                        className="btn btn-danger me-2 btn-a"
                        onClick={() => handleDeleteCard(card._id)}
                      >
                        מחיקה
                      </button>
                    </div>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CardManagement;
