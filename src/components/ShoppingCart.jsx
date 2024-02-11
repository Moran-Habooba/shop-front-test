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
  updateCart,
  completeOrder,
  syncLocalCartWithServer,
} from "../services/cartService";
import React, { useState, useEffect, useMemo } from "react";
import { useAuth } from "../context/auth.context";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/cart.context";
import { adjustInventoryQuantity } from "../services/inventoryService";
import inventoryService from "../services/inventoryService";
import Swal from "sweetalert2";

const ShoppingCart = () => {
  // eslint-disable-next-line no-unused-vars
  const [cartTotal, setCartTotal] = useState(0);
  const [shippingCost, setShippingCost] = useState(15);
  const [couponCode, setCouponCode] = useState("");
  const [isCouponApplied, setIsCouponApplied] = useState(false);
  const { user, userData } = useAuth();
  const navigate = useNavigate();
  const { cartItems, setCartItems, totalItemsInCart } = useCart();
  const [errors, setErrors] = useState({});

  const handleUserLogin = async (user) => {
    try {
      const localCartItems =
        JSON.parse(localStorage.getItem("cartItems")) || [];
      await syncLocalCartWithServer(localCartItems);

      localStorage.removeItem("cartItems");
    } catch (error) {
      console.error("Error syncing local cart with server:", error);
    }
  };

  const handleShippingChange = (event) => {
    const selectedShipping = parseFloat(event.target.value);

    setShippingCost(selectedShipping);

    const subtotal = cartItems.reduce(
      (total, item) => total + item.card_id.price * item.quantity,
      0
    );
    const total = subtotal + selectedShipping;
    setCartTotal(total);
  };

  const calculateTotal = () => {
    const subtotal = cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    const total = subtotal + shippingCost;
    setCartTotal(total);
  };
  const handleCouponSubmit = () => {
    if (user && couponCode.toLowerCase() === "israel") {
      setIsCouponApplied(true);
      calculateTotalWithDiscount();
    } else {
      setIsCouponApplied(false);
    }
  };

  const calculateTotalWithDiscount = () => {
    const subtotal = cartItems.reduce(
      (total, item) => total + item.card_id.price * item.quantity,
      0
    );
    let total = subtotal + shippingCost;
    if (isCouponApplied) {
      total *= 0.9;
    }
    if (total < 0) {
      total = 0;
    }

    setCartTotal(total.toFixed(2));
  };

  // const handleRemoveItem = async (itemToRemove) => {
  //     try {
  //       const productIdToRemove = itemToRemove.card_id._id;
  //       console.log(productIdToRemove);

  //       const response = await removeFromCart(productIdToRemove);

  //       if (response.status === 200) {
  //         const updatedCartItems = cartItems.filter(
  //           (item) => item.card_id._id !== productIdToRemove
  //         );

  //         setCartItems(updatedCartItems);
  //       } else {
  //         console.error("Item not found in the cart");
  //       }
  //     } catch (error) {
  //       console.error("Error removing the item from the cart:", error);
  //     }
  //   };

  // function changeQuantity(item, change) {
  //   console.log(
  //     `Changing quantity for item ${item.card_id._id}, change: ${change}`
  //   );
  //   let newQuantity = item.quantity + change;

  //   if (newQuantity <= 0) {
  //     setCartItems(
  //       cartItems.filter(
  //         (cartItem) => cartItem.card_id._id !== item.card_id._id
  //       )
  //     );
  //     removeFromCart(item.card_id._id)
  //       .then((response) => {
  //         console.log(response.data);
  //       })
  //       .catch((error) => {
  //         console.error("Error removing the item:", error);
  //       });
  //   } else {
  //     newQuantity = Math.max(newQuantity, 0);
  //     const updatedItem = { ...item, quantity: newQuantity };
  //     const updatedItems = cartItems.map((cartItem) =>
  //       cartItem.card_id._id === item.card_id._id ? updatedItem : cartItem
  //     );

  //     setCartItems(updatedItems);

  //     updateCart([{ id: item.card_id._id, quantity: newQuantity }])
  //       .then((response) => {
  //         console.log("Cart updated:", response.data);
  //       })
  //       .catch((error) => {
  //         console.error("Error updating the cart:", error);
  //       });
  //   }
  // }

  // async function changeQuantity(item, change) {
  //   try {
  //     const inventoryResponse = await inventoryService.getInventoryByCardId(
  //       item.card_id._id
  //     );
  //     const inventoryData = inventoryResponse.data;
  //     // console.log("Inventory response:", inventoryData);

  //     const availableInventory = inventoryData.quantity;
  //     // console.log("availableInventory response:", availableInventory);
  //     let newQuantity = item.quantity + change;

  //     if (newQuantity > availableInventory) {
  //       setError("המלאי אזל");
  //       return;
  //     } else {
  //       setError("");
  //     }

  //     if (newQuantity <= 0) {
  //       setCartItems(
  //         cartItems.filter(
  //           (cartItem) => cartItem.card_id._id !== item.card_id._id
  //         )
  //       );
  //       removeFromCart(item.card_id._id)
  //         .then((response) => {
  //           console.log(response.data);
  //         })
  //         .catch((error) => {
  //           console.error("Error removing the item:", error);
  //         });
  //     } else {
  //       newQuantity = Math.max(newQuantity, 0);
  //       const updatedItem = { ...item, quantity: newQuantity };
  //       const updatedItems = cartItems.map((cartItem) =>
  //         cartItem.card_id._id === item.card_id._id ? updatedItem : cartItem
  //       );

  //       setCartItems(updatedItems);

  //       updateCart([{ id: item.card_id._id, quantity: newQuantity }])
  //         .then((response) => {
  //           console.log("Cart updated:", response.data);
  //         })
  //         .catch((error) => {
  //           console.error("Error updating the cart:", error);
  //         });
  //     }
  //   } catch (error) {
  //     console.error("Error fetching inventory for the item:", error);
  //   }
  // }
  // פה שנתי ליוזר לא מחובר
  const handleRemoveItem = async (itemToRemove) => {
    try {
      if (!user) {
        // If the user is not logged in, update the local cart only
        const updatedCartItems = cartItems.filter(
          (item) => item.card_id !== itemToRemove.card_id
        );
        setCartItems(updatedCartItems); // Update local state
        localStorage.setItem("cartItems", JSON.stringify(updatedCartItems)); // Update local storage
        return;
      }

      const productIdToRemove = itemToRemove.card_id._id;
      console.log(productIdToRemove);

      const response = await removeFromCart(productIdToRemove);

      if (response.status === 200) {
        // Remove the specific item from the cart
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

  // async function changeQuantity(item, change) {
  //   try {
  //     const inventoryResponse = await inventoryService.getInventoryByCardId(
  //       item.card_id._id
  //     );
  //     const inventoryData = inventoryResponse.data;

  //     const availableInventory = inventoryData.quantity;

  //     let newQuantity = item.quantity + change;

  //     const newErrors = { ...errors };

  //     if (newQuantity > availableInventory) {
  //       newErrors[item.card_id._id] = "המלאי אזל";
  //       setErrors(newErrors);
  //       return;
  //     } else {
  //       delete newErrors[item.card_id._id];
  //       setErrors(newErrors);
  //     }

  //     if (newQuantity <= 0) {
  //       setCartItems(
  //         cartItems.filter(
  //           (cartItem) => cartItem.card_id._id !== item.card_id._id
  //         )
  //       );
  //       removeFromCart(item.card_id._id)
  //         .then((response) => {
  //           console.log(response.data);
  //         })
  //         .catch((error) => {
  //           console.error("Error removing the item:", error);
  //         });
  //     } else {
  //       newQuantity = Math.max(newQuantity, 0);
  //       const updatedItem = { ...item, quantity: newQuantity };
  //       const updatedItems = cartItems.map((cartItem) =>
  //         cartItem.card_id._id === item.card_id._id ? updatedItem : cartItem
  //       );

  //       setCartItems(updatedItems);

  //       updateCart([{ id: item.card_id._id, quantity: newQuantity }])
  //         .then((response) => {
  //           console.log("Cart updated:", response.data);
  //         })
  //         .catch((error) => {
  //           console.error("Error updating the cart:", error);
  //         });
  //     }
  //   } catch (error) {
  //     console.error("Error fetching inventory for the item:", error);
  //   }
  // }

  // useEffect(() => {
  //   const fetchCartItems = async () => {
  //     try {
  //       const response = await getCartItems();
  //       const cartData = response.data.cart;

  //       if (!cartData) {
  //         return;
  //       }

  //       const cartItemsData = cartData.items;

  //       const updatedCartItems = cartItemsData.map((item) => {
  //         const dynamicImageUrl = `http://localhost:3000/${item.card_id.image_file.path}`;

  //         return {
  //           ...item,
  //           dynamicImageUrl,
  //         };
  //       });

  //       setCartItems(updatedCartItems);
  //     } catch (error) {
  //       console.error("שגיאה בקריאת רשימת המוצרים מהשרת:", error);
  //     }
  //   };

  //   fetchCartItems();
  // }, [setCartItems]);

  // פה שיניתי ליוזר לא מחובר
  async function changeQuantity(item, change) {
    try {
      if (!user) {
        // If the user is not logged in, update the local cart directly
        let newQuantity = item.quantity + change;
        if (newQuantity <= 0) {
          const updatedCartItems = cartItems.filter(
            (cartItem) => cartItem.card_id._id !== item.card_id._id
          );
          setCartItems(updatedCartItems);
          localStorage.setItem("cartItems", JSON.stringify(updatedCartItems)); // Update local storage
        } else {
          const updatedItem = { ...item, quantity: newQuantity };
          const updatedItems = cartItems.map((cartItem) =>
            cartItem.card_id._id === item.card_id._id ? updatedItem : cartItem
          );
          setCartItems(updatedItems);
          localStorage.setItem("cartItems", JSON.stringify(updatedItems)); // Update local storage
        }
        return;
      }

      const inventoryResponse = await inventoryService.getInventoryByCardId(
        item.card_id._id
      );
      const inventoryData = inventoryResponse.data;

      const availableInventory = inventoryData.quantity;

      let newQuantity = item.quantity + change;

      const newErrors = { ...errors };

      if (newQuantity > availableInventory) {
        newErrors[item.card_id._id] = "המלאי אזל";
        setErrors(newErrors);
        return;
      } else {
        delete newErrors[item.card_id._id];
        setErrors(newErrors);
      }

      if (newQuantity <= 0) {
        setCartItems(
          cartItems.filter(
            (cartItem) => cartItem.card_id._id !== item.card_id._id
          )
        );
        removeFromCart(item.card_id._id)
          .then((response) => {
            console.log(response.data);
          })
          .catch((error) => {
            console.error("Error removing the item:", error);
          });
      } else {
        newQuantity = Math.max(newQuantity, 0);
        const updatedItem = { ...item, quantity: newQuantity };
        const updatedItems = cartItems.map((cartItem) =>
          cartItem.card_id._id === item.card_id._id ? updatedItem : cartItem
        );

        setCartItems(updatedItems);

        updateCart([{ id: item.card_id._id, quantity: newQuantity }])
          .then((response) => {
            console.log("Cart updated:", response.data);
          })
          .catch((error) => {
            console.error("Error updating the cart:", error);
          });
      }
    } catch (error) {
      console.error("Error fetching inventory for the item:", error);
    }
  }

  useEffect(() => {
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
            const dynamicImageUrl = `http://localhost:3000/${item.card_id.image_file.path}`;
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

  // const totalCartPrice = useMemo(() => {
  //   if (!Array.isArray(cartItems) || cartItems.length === 0) {
  //     return 0;
  //   }
  //   return cartItems
  //     .reduce((total, item) => total + item.card_id.price * item.quantity, 0)
  //     .toFixed(2);
  // }, [cartItems]);
  /////פה החלפתי כשיוזר לא מחובר
  const totalCartPrice = useMemo(() => {
    if (!Array.isArray(cartItems) || cartItems.length === 0) {
      return 0;
    }
    return cartItems
      .reduce(
        (total, item) =>
          total + (user ? item.card_id.price : item.price) * item.quantity,
        0
      )
      .toFixed(2);
  }, [cartItems, user]);

  const totalPriceWithShipping = useMemo(() => {
    let price = +totalCartPrice + shippingCost;
    if (isCouponApplied) {
      price /= 1.1;
    }

    return price.toFixed(2);
  }, [totalCartPrice, shippingCost, isCouponApplied]);

  // const handleCompleteOrder = async () => {
  //   try {
  //     const response = await completeOrder();
  //     if (response.status === 200) {
  //       setCartItems([]);

  //       navigate("/my-orders");
  //     } else {
  //       console.error("ההזמנה לא הושלמה");
  //     }
  //   } catch (error) {
  //     console.error("Error completing the order:", error);
  //   }
  // };
  // const handleCompleteOrder = async () => {
  //   try {
  //     const response = await completeOrder();

  //     if (response.status === 200) {
  //       setCartItems([]);

  //       cartItems.forEach(async (item) => {
  //         const cardId = item.card_id._id;
  //         const quantity = -item.quantity;

  //         await adjustInventoryQuantity(cardId, quantity);
  //       });

  //       navigate("/my-orders");
  //     } else {
  //       console.error("ההזמנה לא הושלמה");
  //     }
  //   } catch (error) {
  //     console.error("Error completing the order:", error);
  //   }
  // };
  // const handleCompleteOrder = async () => {
  //   try {
  //     if (!user) {
  //       Swal.fire({
  //         icon: "error",
  //         title: "יש להיות משתמש מחובר כדי לבצע הזמנה",
  //         showConfirmButton: false,
  //         timer: 4000,
  //       });
  //       setTimeout(() => {
  //         navigate("/sign-in");
  //       }, 5000);
  //       return;
  //     }

  //     const response = await completeOrder();

  //     if (response.status === 200) {
  //       setCartItems([]);

  //       cartItems.forEach(async (item) => {
  //         const cardId = item.card_id._id;
  //         const quantity = -item.quantity;

  //         await adjustInventoryQuantity(cardId, quantity);
  //       });

  //       navigate("/my-orders");
  //     } else {
  //       console.error("ההזמנה לא הושלמה");
  //     }
  //   } catch (error) {
  //     console.error("Error completing the order:", error);
  //   }
  // };
  const handleCompleteOrder = async () => {
    if (!user) {
      Swal.fire({
        icon: "error",
        title: "יש להיות משתמש מחובר כדי לבצע הזמנה",
        showConfirmButton: false,
        timer: 4000,
      });
      setTimeout(() => {
        navigate("/sign-in");
      }, 5000);
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
        setCartItems([]);
        navigate("/my-orders");
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
    if (userData) console.log(userData);
  }, [userData]);
  const [city, setCity] = useState(userData.city);
  const [street, setStreet] = useState(userData.street);
  const [houseNumber, setHouseNumber] = useState(userData.houseNumber);

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
    console.log("עיר:", city);
    console.log("רחוב:", street);
    console.log("מספר בית:", houseNumber);
  };
  return (
    <section className="h-100 h-custom " style={{ backgroundColor: "#eee" }}>
      <MDBContainer fluid className="py-5 h-100">
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
                          className="fw-bold mb-0 custom-text-colorr"
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
                                // src={
                                //   item.card_id.image_file?.path
                                //     ? `http://localhost:3000/${item.card_id.image_file.path}`
                                //     : "DefaultImg.svg.png"
                                // }
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
                              {/* <img
                                src={
                                  item.card_id.image_file?.path
                                    ? `http://localhost:3000/${item.card_id.image_file.path}`
                                    : "DefaultImg.svg.png"
                                }
                                alt={
                                  item.image_file?.originalname || "Card image"
                                }
                                style={{ maxWidth: "100%", height: "auto" }}
                              /> */}
                            </MDBCol>
                            <MDBCol md="3" lg="3" xl="3">
                              <MDBTypography tag="h6" className="text-muted">
                                {/* {item.card_id.title} */}
                                {user ? item.card_id.title : item.title}
                              </MDBTypography>
                              <MDBTypography
                                tag="h6"
                                className="text-black mb-0"
                              >
                                {/* {item.card_id.description} */}
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
                              {/* <MDBBtn color="link" className="px-2"> */}
                              {/* <MDBIcon fas icon="minus" /> */}
                              <span
                                className="fs-2 minus-sign ms-1"
                                onClick={() => changeQuantity(item, -1)}
                              >
                                -
                              </span>
                              {/* </MDBBtn> */}

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
                                {/* {item.card_id.price} ₪ */}
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
                        {userData && (
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
                        <MDBTypography tag="h5">
                          {totalCartPrice}₪
                        </MDBTypography>
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
                      </div>

                      <hr className="my-4" />

                      <div className="d-flex justify-content-between mb-5">
                        <MDBTypography
                          tag="h5"
                          className="text-uppercase custom-text-color"
                          onClick={calculateTotal}
                        >
                          סה"כ לתשלום
                        </MDBTypography>
                        <MDBTypography className="custom-text-color" tag="h5">
                          {totalPriceWithShipping} ₪
                        </MDBTypography>
                      </div>

                      <button
                        className=" btn custom-button fs-4"
                        size="lg"
                        onClick={handleCompleteOrder}
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
