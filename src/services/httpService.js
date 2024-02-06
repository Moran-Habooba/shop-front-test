import axios from "axios";
import config from "../config.json";
import Swal from "sweetalert2";

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

axios.defaults.baseUrlGetInventoryiByCardId =
  config.apiUrlGetInventoryiByCardId;
axios.defaults.baseUrlAdjustInventoryQuantity =
  config.apiUrlAdjustInventoryQuantity;
axios.defaults.baseGetInventoryiWithDetails =
  config.apiUrlGetInventoryiWithDetails;

axios.defaults.baseUrlGetAllClosedOrders = config.apiUrlGetAllClosedOrders;

// axios.interceptors.response.use(
//   (response) => response,
//   (error) => {
//
//     if (error.response && error.response.status === 429) {
//       const retryAfter = error.response.headers["retry-after"];
//       const waitTime = retryAfter
//         ? ` Please try again in ${retryAfter} seconds.`
//         : "";
//       return new Promise((resolve, reject) => {
//         Swal.fire({
//           title: "Too Many Requests",
//           text: `You have reached the limit of requests.${waitTime}`,
//           icon: "error",
//           confirmButtonText: "OK",
//         }).then(() => {
//           resolve(Promise.reject(error));
//         });
//       });
//     }
//     // המשך לטפל בשגיאות אחרות או החזר את השגיאה
//     return Promise.reject(error);
//   }
// );

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
