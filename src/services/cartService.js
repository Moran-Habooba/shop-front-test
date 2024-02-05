import httpService from "./httpService";
import config from "../config.json";
import { refreshTokenHeader } from "./usersService";

// export function addToCart(card_id, quantity) {
//   refreshTokenHeader();

//   const data = { card_id, quantity };
//   return httpService.post(config.apiUrlAddToCart, data);
// }

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

// export function getCartItems() {
//   refreshTokenHeader();

//   return httpService.get(config.apiUrlGetAllCartItems);
// }

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
  console.log("Updating cart with items:", itemsToUpdate);
  const data = { itemsToUpdate };
  return httpService.put(config.apiUrlUpdateCart, data);
}

export function cancelCart() {
  refreshTokenHeader();

  return httpService.post(config.apiUrlCancelCart);
}

export function completeOrder() {
  refreshTokenHeader();

  return httpService.post(config.apiUrlCompleteCart);
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
