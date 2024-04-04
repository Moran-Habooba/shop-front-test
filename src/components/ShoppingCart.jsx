import {
  MDBCard,
  MDBCardBody,
  MDBCardImage,
  MDBCardText,
  MDBCol,
  MDBContainer,
  MDBIcon,
  MDBInput,
  MDBRow,
  MDBTypography,
} from "mdb-react-ui-kit";
import "./styls/ShoppingCart.css";
import { Link } from "react-router-dom";
import {
  getCartItems,
  removeFromCart,
  completeOrder,
} from "../services/cartService";
import React, { useState, useEffect } from "react";
import { useAuth } from "../context/auth.context";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/cart.context";
import { adjustInventoryQuantity } from "../services/inventoryService";
import inventoryService from "../services/inventoryService";
import Swal from "sweetalert2";

const ShoppingCart = () => {
  const [shippingCost, setShippingCost] = useState(15);
  const [couponCode, setCouponCode] = useState("");
  const [isCouponApplied, setIsCouponApplied] = useState(false);
  const { user, userData } = useAuth();
  const navigate = useNavigate();
  const { cartItems, setCartItems, totalItemsInCart } = useCart();
  const [errors, setErrors] = useState({});
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [couponAttempted, setCouponAttempted] = useState(false);

  const subtotal = cartItems.reduce((total, item) => {
    if (
      user &&
      item.card_id &&
      item.card_id.price != null &&
      item.quantity != null
    ) {
      return total + item.card_id.price * item.quantity;
    } else if (item.price != null && item.quantity != null) {
      return total + item.price * item.quantity;
    }
    return total;
  }, 0);

  let totalBeforeDiscount = subtotal + shippingCost;
  let total = totalBeforeDiscount;
  if (isCouponApplied) {
    total = total * 0.9;
  }
  if (totalBeforeDiscount < 0) {
    totalBeforeDiscount = 0;
  }
  if (total < 0) {
    total = 0;
  }

  const handleShippingChange = (event) => {
    const selectedShipping = parseFloat(event.target.value);

    setShippingCost(selectedShipping);
  };

  const handleCouponSubmit = () => {
    setCouponAttempted(true);
    if (user && couponCode.toLowerCase() === "israel") {
      setIsCouponApplied(true);
    } else {
      setIsCouponApplied(false);
    }
  };

  const handleRemoveItem = async (itemToRemove) => {
    try {
      if (!user) {
        const updatedCartItems = cartItems.filter(
          (item) => item.card_id !== itemToRemove.card_id
        );
        setCartItems(updatedCartItems);
        localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));
        return;
      }

      const productIdToRemove = itemToRemove.card_id._id;
      console.log(productIdToRemove);

      const response = await removeFromCart(productIdToRemove);

      if (response.status === 200) {
        setCartItems((prevCartItems) =>
          prevCartItems.filter((item) => item.card_id._id !== productIdToRemove)
        );
      } else {
        console.error("Item not found in the cart");
        return;
      }
    } catch (error) {
      console.error("Error removing the item from the cart:", error);
    }
  };

  async function changeQuantity(item, change) {
    console.log("Current item object:", item);

    try {
      let newQuantity = item.quantity + change;

      const inventoryResponse = await inventoryService.getInventoryByCardId(
        user ? item.card_id._id : item.card_id
      );

      console.log(
        "Trying to fetch inventory for item with _id:",
        item.card_id._id
      );
      const inventoryData = inventoryResponse.data;
      const availableInventory = inventoryData.quantity;

      if (newQuantity > availableInventory) {
        setErrors((prevErrors) => ({
          ...prevErrors,
          [item.card_id._id]: "המלאי אזל",
        }));
        return;
      } else {
        setErrors((prevErrors) => {
          const newErrors = { ...prevErrors };
          delete newErrors[item.card_id._id];
          return newErrors;
        });
      }

      if (newQuantity <= 0) {
        const updatedCartItems = cartItems.filter(
          (cartItem) => cartItem.card_id._id !== item.card_id._id
        );
        setCartItems(updatedCartItems);
        localStorage.setItem("cartItems", JSON.stringify(updatedCartItems));
      } else {
        const updatedItem = { ...item, quantity: newQuantity };
        const updatedItems = cartItems.map((cartItem) =>
          cartItem.card_id._id === item.card_id._id ? updatedItem : cartItem
        );
        setCartItems(updatedItems);
        localStorage.setItem("cartItems", JSON.stringify(updatedItems));
      }
    } catch (error) {
      console.error("Error fetching inventory for the item:", error);
    }
  }

  useEffect(() => {
    // eslint-disable-next-line no-unused-vars
    const loadCartFromLocal = () => {
      const localCartItems =
        JSON.parse(localStorage.getItem("cartItems")) || [];
      return localCartItems.map((item) => ({
        ...item,

        dynamicImageUrl: item.image
          ? `http://localhost:3000/${item.image}`
          : "DefaultImg.svg.png",
      }));
    };

    const fetchCartItems = async () => {
      if (user) {
        try {
          const response = await getCartItems();
          const cartData = response.data.cart;

          if (!cartData) {
            return;
          }

          const cartItemsData = cartData.items;

          const updatedCartItems = cartItemsData.map((item) => {
            const dynamicImageUrl =
              item.card_id &&
              item.card_id.image_file &&
              item.card_id.image_file.path
                ? `http://localhost:3000/${item.card_id.image_file.path}`
                : "DefaultImg.svg.png";
            return {
              ...item,
              dynamicImageUrl,
            };
          });

          setCartItems(updatedCartItems);
        } catch (error) {
          console.error("שגיאה בקריאת רשימת המוצרים מהשרת:", error);
        }
      } else {
        const localCartItems =
          JSON.parse(localStorage.getItem("cartItems")) || [];

        const updatedCartItems = localCartItems.map((item) => {
          return {
            card_id: item.card_id,
            title: item.title,
            price: item.price,
            quantity: item.quantity,
            image: item.image,
            description: item.description,
          };
        });
        setCartItems(updatedCartItems);
      }
    };

    fetchCartItems();
  }, [user, setCartItems]);

  const handleCompleteOrder = async () => {
    if (!user) {
      Swal.fire({
        icon: "warning",
        title: "יש להיות משתמש מחובר כדי לבצע הזמנה",
        showConfirmButton: false,
        timer: 1700,
      });
      setTimeout(() => {
        navigate("/sign-in");
      }, 1800);
      return;
    }

    const orderDetails = {
      items: cartItems.map((item) => ({
        cardId: item.card_id._id,
        quantity: item.quantity,
      })),
      city,
      street,
      houseNumber,
    };
    console.log("Sending order details to server:", orderDetails);

    try {
      const response = await completeOrder(orderDetails);
      if (response.status === 200) {
        for (const item of cartItems) {
          try {
            await adjustInventoryQuantity(item.card_id._id, -item.quantity);
          } catch (error) {
            console.error(
              "Failed to adjust inventory for item:",
              item.card_id._id,
              error
            );
          }
        }

        setCartItems([]);
        Swal.fire({
          icon: "success",
          title: "ההזמנה בוצעה בהצלחה",
          text: "אנו עושים את מירב המאמצים לטפל בהזמנתך בהקדם 🙂",
          timer: 2500,
          timerProgressBar: true,
          didClose: () => {
            navigate("/my-orders");
          },
        });
      } else {
        console.error("ההזמנה לא הושלמה");
      }
    } catch (error) {
      console.error("Error completing the order:", error);
    }
  };

  useEffect(() => {
    if (user) {
      Swal.fire({
        icon: "info",
        title: "אל תשכח להשתמש בקופון שלך",
        text: "israel",
        confirmButtonText: "הבנתי",
      });
    }
  }, [user]);

  useEffect(() => {
    if (userData) {
      // console.log(userData);
      if (userData.city) localStorage.setItem("city", userData.city);
      if (userData.street) localStorage.setItem("street", userData.street);
      if (userData.houseNumber)
        localStorage.setItem("houseNumber", userData.houseNumber);

      setCity(userData.city || "");
      setStreet(userData.street || "");
      setHouseNumber(userData.houseNumber || "");
    }
  }, [userData]);

  const [city, setCity] = useState(
    localStorage.getItem("city") || userData?.city || ""
  );
  const [street, setStreet] = useState(
    localStorage.getItem("street") || userData?.street || ""
  );
  const [houseNumber, setHouseNumber] = useState(
    localStorage.getItem("houseNumber") || userData?.houseNumber || ""
  );

  const handleCityChange = (e) => {
    setCity(e.target.value);
  };

  const handleStreetChange = (e) => {
    setStreet(e.target.value);
  };

  const handleHouseNumberChange = (e) => {
    setHouseNumber(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <section className="h-100 h-custom " style={{ backgroundColor: "#eee" }}>
      <MDBContainer fluid className="py-5 h-100 ">
        <MDBRow className="justify-content-center align-items-center h-100">
          <MDBCol size="12">
            <MDBCard
              className="card-registration card-registration-2"
              style={{ borderRadius: "15px", width: "100%" }}
            >
              <MDBCardBody className="p-0">
                <MDBRow className="g-0">
                  <MDBCol lg="8">
                    <div className="p-5">
                      <div className="d-flex justify-content-between align-items-center mb-5">
                        <MDBTypography
                          tag="h1"
                          className="fw-bold mb-0 custom-text-color"
                        >
                          עגלת קניות
                        </MDBTypography>
                        <MDBTypography className="mb-0 text-muted">
                          {totalItemsInCart} מוצרים
                        </MDBTypography>
                      </div>

                      <hr className="my-4" />
                      {cartItems.map((item, index) => (
                        <div key={index}>
                          <MDBRow className="mb-4 d-flex justify-content-between align-items-center">
                            <MDBCol md="2" lg="2" xl="2">
                              <MDBCardImage
                                key={index}
                                src={
                                  user &&
                                  item.card_id.image_file &&
                                  item.card_id.image_file.path
                                    ? `http://localhost:3000/${item.card_id.image_file.path}`
                                    : item.image
                                    ? item.image
                                    : "DefaultImg.svg.png"
                                }
                                fluid
                                className="rounded-3"
                                alt={
                                  item.image_file?.originalname || "Card image"
                                }
                              />
                            </MDBCol>
                            <MDBCol md="3" lg="3" xl="3">
                              <MDBTypography tag="h6" className="text-muted">
                                {user ? item.card_id.title : item.title}
                              </MDBTypography>
                              <MDBTypography
                                tag="h6"
                                className="text-black mb-0"
                              >
                                {user
                                  ? item.card_id.description
                                  : item.description}
                              </MDBTypography>
                            </MDBCol>
                            <MDBCol
                              md="3"
                              lg="3"
                              xl="3"
                              className="d-flex align-items-center"
                            >
                              <span
                                className="fs-2 minus-sign ms-1"
                                onClick={() => changeQuantity(item, -1)}
                              >
                                -
                              </span>

                              <MDBInput
                                type="number"
                                min="0"
                                value={item.quantity}
                                size="sm"
                              />

                              <span
                                className="fs-2 plus-sign ms-1"
                                onClick={() => changeQuantity(item, 1)}
                              >
                                +
                              </span>
                              {errors[item.card_id._id] && (
                                <div
                                  className="alert alert-danger alert-custom  "
                                  role="alert"
                                >
                                  {errors[item.card_id._id]}
                                </div>
                              )}
                            </MDBCol>
                            <MDBCol md="3" lg="2" xl="2" className="text-end">
                              <MDBTypography tag="h6" className="mb-0">
                                {user ? item.card_id.price : item.price} ₪
                              </MDBTypography>
                            </MDBCol>
                            <MDBCol md="2" lg="2" xl="2" className="text-end">
                              <span
                                onClick={() => handleRemoveItem(item)}
                                style={{ cursor: "pointer" }}
                              >
                                <i className="bi bi-trash3"></i>
                              </span>
                            </MDBCol>
                            <MDBCol md="1" lg="1" xl="1" className="text-end">
                              <Link to={"/"} className="text-muted">
                                <MDBIcon fas icon="times" />
                              </Link>
                            </MDBCol>
                          </MDBRow>

                          <hr className="my-4" />
                        </div>
                      ))}

                      <div className="pt-5">
                        {user && userData && (
                          <>
                            <form onSubmit={handleSubmit}>
                              <h5>
                                כתובת למשלוח זהה לכתובת איתה נרשמת? אם לא ניתן
                                לערוך...
                              </h5>
                              <div className="form-group">
                                <label htmlFor="city">עיר:</label>
                                <input
                                  type="text"
                                  id="city"
                                  className="form-control input-small"
                                  value={city}
                                  onChange={handleCityChange}
                                />
                              </div>
                              <div className="form-group">
                                <label htmlFor="street">רחוב:</label>
                                <input
                                  type="text"
                                  id="street"
                                  className="form-control input-small"
                                  value={street}
                                  onChange={handleStreetChange}
                                />
                              </div>
                              <div className="form-group">
                                <label htmlFor="houseNumber">מספר בית:</label>
                                <input
                                  type="text"
                                  id="houseNumber"
                                  className="form-control input-small"
                                  value={houseNumber}
                                  onChange={handleHouseNumberChange}
                                />
                              </div>
                              <button
                                type="submit"
                                className="btn btn-primary mt-3 mb-4"
                              >
                                שמור שינויים
                              </button>
                            </form>
                            {saveSuccess && (
                              <div className="text-success fw-bold">
                                נשמר בהצלחה!
                              </div>
                            )}
                          </>
                        )}
                        <MDBTypography tag="h6" className="mb-0">
                          <MDBCardText className="text-body">
                            <Link to="/" className="text-body">
                              <MDBIcon fas icon="long-arrow-alt-left me-2" />
                              חזרה לחנות
                            </Link>
                          </MDBCardText>
                        </MDBTypography>
                      </div>
                    </div>
                  </MDBCol>
                  <MDBCol lg="4" className="bg-grey">
                    <div className="p-5 ">
                      <MDBTypography
                        tag="h3"
                        className="fw-bold mb-5 mt-2 pt-1 custom-text-color "
                      >
                        סיכום
                      </MDBTypography>

                      <hr className="my-4 custom-text-color" />

                      <div className="d-flex justify-content-between mb-4 custom-text-color">
                        <MDBTypography tag="h5" className="text-uppercase ">
                          {totalItemsInCart} מוצרים
                        </MDBTypography>
                        <MDBTypography tag="h5">{subtotal}</MDBTypography>
                      </div>

                      <MDBTypography
                        tag="h5"
                        className="text-uppercase mb-3 custom-text-color"
                      >
                        בחר משלוח
                      </MDBTypography>

                      <div className="mb-4 pb-2 custom-text-color">
                        <select
                          className="select p-2 rounded bg-grey custom-text-color"
                          style={{ width: "100%", borderColor: "#e5b55c" }}
                          onChange={handleShippingChange}
                        >
                          <option value="15">משלוח בדואר רשום 15 ₪</option>
                          <option value="35">משלוח עד הבית 35 ₪</option>
                          <option value="0">איסוף עצמי 0 ₪ </option>
                        </select>
                      </div>

                      <MDBTypography
                        tag="h5"
                        className="text-uppercase mb-3 custom-text-color"
                      >
                        יש לך קופון?
                      </MDBTypography>

                      <div className="mb-5  ">
                        <MDBInput
                          className=""
                          size="lg"
                          label="הכנס את הקוד"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value)}
                        />
                        <button
                          className="custom-button btn "
                          size="lg"
                          onClick={handleCouponSubmit}
                        >
                          החל קופון
                        </button>
                        {isCouponApplied && (
                          <div
                            className="alert alert-success mt-3"
                            role="alert"
                            style={{ maxWidth: "300px", margin: "0 auto" }}
                          >
                            קופון הופעל בהצלחה!
                          </div>
                        )}
                        {!isCouponApplied && couponAttempted && user && (
                          <div
                            className="alert alert-danger mt-3"
                            role="alert"
                            style={{ maxWidth: "300px", margin: "0 auto" }}
                          >
                            קופון לא קיים
                          </div>
                        )}
                        {!user && couponAttempted && (
                          <div
                            className="alert alert-warning mt-3"
                            role="alert"
                            style={{ maxWidth: "300px", margin: "0 auto" }}
                          >
                            עליך להתחבר כדי להזין קופון
                          </div>
                        )}
                      </div>

                      <hr className="my-4" />

                      <div className="d-flex justify-content-between mb-5">
                        <MDBTypography
                          tag="h5"
                          className="text-uppercase custom-text-color"
                        >
                          סה"כ לתשלום
                        </MDBTypography>
                        <MDBTypography className="custom-text-color" tag="h5">
                          {total} ₪
                        </MDBTypography>
                      </div>

                      <button
                        className=" btn custom-button fs-4"
                        size="lg"
                        onClick={handleCompleteOrder}
                        disabled={cartItems.length === 0}
                      >
                        שלח הזמנה
                      </button>
                    </div>
                  </MDBCol>
                </MDBRow>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    </section>
  );
};
export default ShoppingCart;
