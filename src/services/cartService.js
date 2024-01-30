import httpService from "./httpService";
import config from "../config.json";
import { refreshTokenHeader } from "./usersService";

export function addToCart(card_id, quantity) {
  refreshTokenHeader();

  const data = { card_id, quantity };
  return httpService.post(config.apiUrlAddToCart, data);
}

export function getCartItems() {
  refreshTokenHeader();

  return httpService.get(config.apiUrlGetAllCartItems);
}

export function updateCart(itemsToUpdate) {
  refreshTokenHeader();

  const data = { itemsToUpdate };
  return httpService.put(config.updateCart, data);
}

export function cancelCart() {
  refreshTokenHeader();

  return httpService.post(config.apiUrlCancelCart);
}

export function completeOrder() {
  refreshTokenHeader();

  return httpService.post(config.apiUrlCompleteCart);
}
