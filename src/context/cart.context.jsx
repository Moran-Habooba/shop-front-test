import React, { createContext, useState, useContext, useEffect } from "react";
import { getCartItems } from "../services/cartService";
import { refreshTokenHeader, getJWT } from "../services/usersService";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [totalItemsInCart, setTotalItemsInCart] = useState(0);

  useEffect(() => {
    const fetchCartItems = async () => {
      const token = getJWT();
      if (!token) {
        return;
      }
      refreshTokenHeader();
      try {
        const response = await getCartItems();
        setCartItems(response.data.cart?.items || []);
      } catch (error) {
        console.error("שגיאה בטעינת פריטים מהעגלה:", error);
      }
    };

    fetchCartItems();
  }, []);

  const updateTotalItemsInCart = () => {
    const totalItems = cartItems.reduce(
      (total, item) => total + item.quantity,
      0
    );
    setTotalItemsInCart(totalItems);
  };

  useEffect(() => {
    const totalItems = cartItems.reduce(
      (total, item) => total + item.quantity,
      0
    );
    setTotalItemsInCart(totalItems);
  }, [cartItems]);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        setCartItems,
        totalItemsInCart,
        updateTotalItemsInCart,
        setTotalItemsInCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
