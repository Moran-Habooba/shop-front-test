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

axios.defaults.baseUrlResetPassword = config.apiUrlResetPassword;

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

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      if (error.response.status === 400) {
        Swal.fire({
          icon: "error",
          title: " בקשות רבות מדי לשרת",
          text: "אופס! עשית יותר מדי בקשות לשרת בזמן קצר מדי. אנא המתן ונסה שוב מחר.",
          // timer: 60000,
          // timerProgressBar: true,
          showConfirmButton: false,
        });
      } else if (error.response.data === "User not found") {
        Swal.fire({
          icon: "warning",
          title: "מייל לא נמצא",
          text: "המייל שהזנת לא נמצא במערכת. אנא בדוק את הכתובת ונסה שנית.",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "שגיאה בבקשה",
          text:
            error.response.data.message ||
            "שגיאה לא צפויה אירעה, אנא נסה שנית.",
        });
      }
    } else if (error.request) {
      Swal.fire({
        icon: "error",
        title: "שגיאת רשת",
        text: "הבקשה לא קיבלה תגובה, בדוק את חיבור האינטרנט שלך.",
      });
    } else {
      Swal.fire({
        icon: "error",
        title: "שגיאה",
        text: "משהו השתבש ביצירת הבקשה, אנא נסה שנית.",
      });
    }
    return new Promise(() => {});
  }
);

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
