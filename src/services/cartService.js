import httpService from "./httpService";
import config from "../config.json";
import { refreshTokenHeader } from "./usersService";
import Swal from "sweetalert2";

export async function addToCart(card_id, quantity) {
  refreshTokenHeader();
  const data = { card_id, quantity };

  try {
    const response = await httpService.post(config.apiUrlAddToCart, data);
    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error("Response status is not 200");
    }
  } catch (error) {
    console.error("Error adding item to cart:", error);
    throw error;
  }
}

export async function getCartItems() {
  try {
    refreshTokenHeader();
    const response = await httpService.get(config.apiUrlGetAllCartItems);
    return response;
  } catch (error) {
    if (error.response && error.response.status === 401) {
      console.error("Access denied. No token provided.");
      return { data: { cart: { items: [] } } };
    }
    throw error;
  }
}

export function updateCart(itemsToUpdate) {
  refreshTokenHeader();
  const data = { itemsToUpdate };
  return httpService.put(config.apiUrlUpdateCart, data);
}

export function cancelCart() {
  refreshTokenHeader();

  return httpService.post(config.apiUrlCancelCart);
}

export function completeOrder(orderDetails) {
  refreshTokenHeader();

  return httpService.post(config.apiUrlCompleteCart, orderDetails);
}

export function removeFromCart(cardId) {
  refreshTokenHeader();

  return httpService.delete(config.apiUrlRemoveFromCart + `/${cardId}`);
}

export function getMyOrders() {
  refreshTokenHeader();

  return httpService.get(config.apiUrlGetMyOrders);
}

export async function getClosedOrders() {
  refreshTokenHeader();
  try {
    const response = await httpService.get(config.apiUrlGetAllClosedOrders);
    return response.data;
  } catch (error) {
    console.error("Error fetching closed orders:", error);
    throw error;
  }
}

// export async function getClosedOrders() {
//   refreshTokenHeader();
//   try {
//     const response = await httpService.get(config.apiUrlGetAllClosedOrders);
//     if (response.data && response.data.length > 0) {
//       return response.data;
//     } else {
//       Swal.fire({
//         title: "אין הזמנות ",
//         text: "טרם בוצעו הזמנות באתר.",
//         icon: "info",
//         confirmButtonText: "סגור",
//       });
//     }
//   } catch (error) {
//     console.error("Error fetching closed orders:", error);
//     Swal.fire({
//       title: "שים לב",
//       text: "טרם בוצעו הזמנות ",
//       icon: "warning",
//       confirmButtonText: "סגור",
//     });
//     throw error;
//   }
// }
