import React, { useState, useEffect } from "react";
import { getInventoryItems } from "../services/inventoryService";
import { getAllUsers } from "../services/usersService";
import { getClosedOrders } from "../services/cartService";
import "./styls/SummaryStats.css";
import Swal from "sweetalert2";

const SummaryStats = () => {
  const [productCount, setProductCount] = useState(0);
  const [userCount, setUserCount] = useState(0);
  const [orderCount, setOrderCount] = useState(0);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const inventoryData = await getInventoryItems();
        setProductCount(inventoryData.length);

        const userData = await getAllUsers();
        setUserCount(userData.data.length);

        const ordersData = await getClosedOrders();
        console.log(ordersData);
        setOrderCount(ordersData.closedOrders.length);
      } catch (error) {
        console.error("Error fetching summary stats:", error);
      }
    };

    fetchCounts();
  }, []);

  return (
    <div className="stats-container">
      <div className="stat-card yellow">
        <div className="stat-value">{userCount}</div>

        <div className="stat-label">
          <i className="bi bi-people-fill fs-2 ms-1"></i>משתמשים רשומים
        </div>
      </div>
      <div className="stat-card blue">
        <div className="stat-value">{orderCount}</div>
        <div className="stat-label">
          <i className="bi bi-file-earmark-text fs-2 ms-1"></i>הזמנות שבוצעו
        </div>
      </div>
      <div className="stat-card green">
        <div className="stat-value">{productCount}</div>
        <div className="stat-label">
          <i className="bi bi-cart3 fs-2 ms-1"></i>מוצרים בחנות
        </div>
      </div>
    </div>
  );
};

export default SummaryStats;
