import axios from "axios";
import config from "../config.json";

axios.defaults.baseURLUsersLogin = config.apiUrlUsersLogin;
axios.defaults.baseUrlUsersRegister = config.apiUrlUsersRegister;
axios.defaults.baseUrlUserById = config.apiUrlUserById;
axios.defaults.baseUrlAllUser = config.apiUrlAllUser;
axios.defaults.baseUrlUpdateUser = config.apiUrlUpdateUser;
axios.defaults.baseUrlDeleteUser = config.apiUrlDeleteUser;
axios.defaults.baseUrlUserBusiness = config.apiUrlUserBusiness;

axios.defaults.baseUrlAllCards = config.apiUrlAllCards;
axios.defaults.baseUrlCardById = config.apiUrlCardById;
axios.defaults.baseUrlAllMyCards = config.apiUrlAllMyCards;
axios.defaults.baseUrlCreateCard = config.apiUrlCreateCard;
axios.defaults.baseUrlUpdateCard = config.apiUrlUpdateCard;
axios.defaults.baseUrlLikeCard = config.apiUrlLikeCard;
axios.defaults.baseUrlCardsBizNumber = config.apiUrlCardsBizNumber;
axios.defaults.baseUrlDeleteCard = config.apiUrlDeleteCard;

axios.defaults.baseUrlAddCategory = config.apiUrlAddCategory;
axios.defaults.baseUrlGetAllCategories = config.apiUrlGetAllCategories;
axios.defaults.baseUrlRemoveCategory = config.apiUrlRemoveCategory;
axios.defaults.baseUrlGetProductsCountInCategory =
  config.apiUrlGetProductsCountInCategory;

axios.defaults.baseUrlAddToCart = config.apiUrlAddToCart;
axios.defaults.baseUrlUpdateCart = config.apiUrlUpdateCart;
axios.defaults.baseUrlCancelCart = config.apiUrlCancelCart;
axios.defaults.baseUrlCompleteCart = config.apiUrlCompleteCart;
axios.defaults.baseUrlAllCartItems = config.apiUrlGetAllCartItems;
axios.defaults.baseUrlRemoveFromCart = config.apiUrlRemoveFromCart;
axios.defaults.baseUrlCreateOrder = config.apiUrlCreateOrder;
axios.defaults.baseUrlGetMyOrders = config.apiUrlGetMyOrders;

export function setCommonHeader(headerName, headerValue) {
  axios.defaults.headers.common[headerName] = headerValue;
}

const httpService = {
  get: axios.get,
  post: axios.post,
  patch: axios.patch,
  put: axios.put,
  delete: axios.delete,
  setCommonHeader,
};

export default httpService;
