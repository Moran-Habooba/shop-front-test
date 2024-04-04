import httpService from "./httpService";
import config from "../config.json";
import { refreshTokenHeader } from "./usersService";

export async function getInventoryItems() {
  refreshTokenHeader();

  try {
    const response = await httpService.get(
      config.apiUrlGetInventoryiWithDetails
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching inventory:", error);
    throw error;
  }
}

export function adjustInventoryQuantity(cardId, quantity) {
  refreshTokenHeader();

  const url = config.apiUrlAdjustInventoryQuantity.replace("{cardId}", cardId);
  return httpService.patch(url, { adjustment: quantity });
}
export function getInventoryByCardId(cardId) {
  return httpService.get(`${config.apiUrlGetInventoryiByCardId}${cardId}`);
}

const inventoryService = {
  getInventoryItems,
  adjustInventoryQuantity,
  getInventoryByCardId,
};

export default inventoryService;
