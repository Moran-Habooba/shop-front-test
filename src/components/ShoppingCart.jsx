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
} from "../services/cartService";
import React, { useState, useEffect, useMemo } from "react";
import { useAuth } from "../context/auth.context";

const ShoppingCart = () => {
  const [cartTotal, setCartTotal] = useState(0);
  const [shippingCost, setShippingCost] = useState(15);
  const [cartItems, setCartItems] = useState([]);
  const [couponCode, setCouponCode] = useState("");
  const [isCouponApplied, setIsCouponApplied] = useState(false);
  const { user } = useAuth();

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

    setCartTotal(total);
  };

  const handleRemoveItem = async (itemToRemove) => {
    try {
      const productIdToRemove = itemToRemove.card_id._id;
      console.log(productIdToRemove);

      const response = await removeFromCart(productIdToRemove);

      if (response.status === 200) {
        const updatedCartItems = cartItems.filter(
          (item) => item.card_id._id !== productIdToRemove
        );

        setCartItems(updatedCartItems);
      } else {
        console.error("Item not found in the cart");
      }
    } catch (error) {
      console.error("Error removing the item from the cart:", error);
    }
  };

  function changeQuantity(item, change) {
    console.log(
      `Changing quantity for item ${item.card_id._id}, change: ${change}`
    );
    let newQuantity = item.quantity + change;

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
  }

  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const response = await getCartItems();
        const cartItemsData = response.data.cart.items;

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
    };

    fetchCartItems();
  }, []);

  const totalCartPrice = useMemo(() => {
    return cartItems
      .reduce((total, item) => total + item.card_id.price * item.quantity, 0)
      .toFixed(2);
  }, [cartItems]);

  const totalPriceWithShipping = useMemo(() => {
    let price = +totalCartPrice + shippingCost;
    if (isCouponApplied) {
      price /= 1.1;
    }

    return price.toFixed(2);
  }, [totalCartPrice, shippingCost, isCouponApplied]);

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
                          {cartItems.length} מוצרים
                        </MDBTypography>
                      </div>

                      <hr className="my-4" />
                      {cartItems.map((item, index) => (
                        <div key={index}>
                          <MDBRow className="mb-4 d-flex justify-content-between align-items-center">
                            <MDBCol md="2" lg="2" xl="2">
                              <MDBCardImage
                                src={item.dynamicImageUrl}
                                fluid
                                className="rounded-3"
                                alt={item.card_id.image_file.originalname}
                              />
                            </MDBCol>
                            <MDBCol md="3" lg="3" xl="3">
                              <MDBTypography tag="h6" className="text-muted">
                                {item.card_id.title}
                              </MDBTypography>
                              <MDBTypography
                                tag="h6"
                                className="text-black mb-0"
                              >
                                {item.card_id.description}
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
                            </MDBCol>
                            <MDBCol md="3" lg="2" xl="2" className="text-end">
                              <MDBTypography tag="h6" className="mb-0">
                                {item.card_id.price} ₪
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
                          {cartItems.length} מוצרים
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
                        יש לך קופון
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

                      <button className=" btn custom-button fs-4" size="lg">
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
