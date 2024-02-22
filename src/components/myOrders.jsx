import React, { useState, useEffect } from "react";
import { getMyOrders } from "../services/cartService";
import "./styls/MyOrders.css";
const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  // eslint-disable-next-line no-unused-vars
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await getMyOrders();
        console.log(response.data.orders);
        setOrders(response.data.orders);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchOrders();
  }, []);

  return (
    <div className="custom-table-responsive">
      <h1>ההזמנות שלי</h1>
      <div class="table-responsive-md">
        <table className="table table-striped table-bordered ">
          <thead>
            <tr>
              <th>מספר ההזמנה</th>
              <th>תאריך הזמנה</th>
              <th>כתובת למשלוח</th>
              <th>סטטוס</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td data-header="מספר ההזמנה:">{order.orderNumber}</td>
                <td data-header="תאריך הזמנה:">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
                <td data-header="כתובת למשלוח:">
                  {order.city}, {order.street},{order.houseNumber}
                </td>
                <td data-header="סטטוס:">{order.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyOrders;
