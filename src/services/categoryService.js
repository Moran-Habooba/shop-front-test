import httpService from "./httpService";
import config from "../config.json";
import { refreshTokenHeader } from "./usersService";

export function addCategory(category) {
  refreshTokenHeader();
  return httpService.post(config.apiUrlAddCategory, category);
}

export function getAllCategories() {
  return httpService.get(config.apiUrlGetAllCategories);
}

export function removeCategory(categoryId) {
  refreshTokenHeader();
  return httpService.delete(`${config.apiUrlRemoveCategory}${categoryId}`);
}

export function getProductsCountInCategory(categoryName) {
  const url = config.apiUrlGetProductsCountInCategory.replace(
    "{categoryName}",
    encodeURIComponent(categoryName)
  );
  return httpService.get(url);
}
export function getProductsByCategory(categoryName) {
  const url = `http://localhost:3000/api/categories/${encodeURIComponent(
    categoryName
  )}/products`;
  return httpService.get(url);
}

const categoryService = {
  addCategory,
  getAllCategories,
  removeCategory,
  getProductsCountInCategory,
  getProductsByCategory,
};
export default categoryService;
