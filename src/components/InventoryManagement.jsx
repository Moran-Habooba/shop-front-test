import React, { useEffect, useState } from "react";
import { getInventoryItems } from "../services/inventoryService";
import { getCardsCountInStore } from "../services/cardsService";

function InventoryManagement() {
  // eslint-disable-next-line no-unused-vars
  const [cardsCountInStore, setCardsCountInStore] = useState(0);
  const [inventoryItems, setInventoryItems] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const inventory = await getInventoryItems();
        setInventoryItems(inventory);
        const cardsCount = await getCardsCountInStore();
        setCardsCountInStore(cardsCount);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };
    fetchData();
    const interval = setInterval(() => {
      getCardsCountInStore().then(setCardsCountInStore).catch(console.error);
    }, 300000);
    return () => clearInterval(interval);
  }, []);
  const availableInventoryCount = inventoryItems.filter(
    (item) => item.quantity > 0
  ).length;

  const unavailableInventoryCount = inventoryItems.filter(
    (item) => item.quantity <= 0
  ).length;
  return (
    <div>
      <h1 className="text-center">ניהול מלאי</h1>

      <table className="table table-bordered">
        <thead>
          <tr>
            <th>כמות כל המוצרים בחנות:</th>
            <th>כמות מוצרים זמינים במלאי:</th>
            <th>כמות מוצרים שלא במלאי:</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td data-label="כל המוצרים ">{inventoryItems.length}</td>
            <td data-label="במלאי">{availableInventoryCount}</td>
            <td data-label="לא במלאי">{unavailableInventoryCount}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default InventoryManagement;
