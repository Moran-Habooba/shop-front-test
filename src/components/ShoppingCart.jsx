import {
  MDBBtn,
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
import { getCartItems } from "../services/cartService";
import React, { useState, useEffect } from "react";

const ShoppingCart = () => {
  const [cartTotal, setCartTotal] = useState(0);
  const [shippingCost, setShippingCost] = useState(0);
  const [cartItems, setCartItems] = useState([]);
  const selectedShipping = shippingCost;

  const handleShippingChange = (event) => {
    const selectedShipping = parseFloat(event.target.value);
    setShippingCost(selectedShipping);

    // Calculate the subtotal
    // const subtotal = cartItems.reduce(
    //   (total, item) => total + item.price * item.quantity,
    //   0
    // );
    const subtotal = 100;
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
  // useEffect(() => {
  //   // קרא את רשימת המוצרים מהשרת בעזרת הפונקציה getCartItems כאשר הרכוב מוטען
  //   const fetchCartItems = async () => {
  //     try {
  //       const response = await getCartItems();
  //       // הגדר את רשימת המוצרים בסטייט
  //       setCartItems(response.data.cart.items); // Update this line
  //       console.log(response.data.cart.items);
  //     } catch (error) {
  //       console.error("שגיאה בקריאת רשימת המוצרים מהשרת:", error);
  //     }
  //   };

  //   fetchCartItems();
  // }, []);

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
                          3 מוצרים
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
                              <MDBBtn color="link" className="px-2">
                                <MDBIcon fas icon="minus" />
                              </MDBBtn>

                              <MDBInput
                                type="number"
                                min="0"
                                defaultValue={item.quantity}
                                size="sm"
                              />

                              <MDBBtn color="link" className="px-2">
                                <MDBIcon fas icon="plus" />
                              </MDBBtn>
                            </MDBCol>
                            <MDBCol md="3" lg="2" xl="2" className="text-end">
                              <MDBTypography tag="h6" className="mb-0">
                                {item.card_id.price} ₪
                              </MDBTypography>
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

                      {/* <hr className="my-4" />

                      <MDBRow className="mb-4 d-flex justify-content-between align-items-center">
                        <MDBCol md="2" lg="2" xl="2">
                          <MDBCardImage
                            src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-shopping-carts/img6.webp"
                            fluid
                            className="rounded-3"
                            alt="Cotton T-shirt"
                          />
                        </MDBCol>
                        <MDBCol md="3" lg="3" xl="3">
                          <MDBTypography tag="h6" className="text-muted">
                            כיפה
                          </MDBTypography>
                          <MDBTypography tag="h6" className="text-black mb-0">
                            כיפה עור -ילדים{" "}
                          </MDBTypography>
                        </MDBCol>
                        <MDBCol
                          md="3"
                          lg="3"
                          xl="3"
                          className="d-flex align-items-center"
                        >
                          <MDBBtn color="link" className="px-2">
                            <MDBIcon fas icon="minus" />
                          </MDBBtn>

                          <MDBInput
                            type="number"
                            min="0"
                            defaultValue={1}
                            size="sm"
                          />

                          <MDBBtn color="link" className="px-2">
                            <MDBIcon fas icon="plus" />
                          </MDBBtn>
                        </MDBCol>
                        <MDBCol md="3" lg="2" xl="2" className="text-end">
                          <MDBTypography tag="h6" className="mb-0">
                            44.00 ₪
                          </MDBTypography>
                        </MDBCol>
                        <MDBCol md="1" lg="1" xl="1" className="text-end">
                          <a href="#!" className="text-muted">
                            <MDBIcon fas icon="times" />
                          </a>
                        </MDBCol>
                      </MDBRow>

                      <hr className="my-4" />

                      <MDBRow className="mb-4 d-flex justify-content-between align-items-center">
                        <MDBCol md="2" lg="2" xl="2">
                          <MDBCardImage
                            src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-shopping-carts/img7.webp"
                            fluid
                            className="rounded-3"
                            alt="Cotton T-shirt"
                          />
                        </MDBCol>
                        <MDBCol md="3" lg="3" xl="3">
                          <MDBTypography tag="h6" className="text-muted">
                            נטלה
                          </MDBTypography>
                          <MDBTypography tag="h6" className="text-black mb-0">
                            נטלה עבודת יד{" "}
                          </MDBTypography>
                        </MDBCol>
                        <MDBCol
                          md="3"
                          lg="3"
                          xl="3"
                          className="d-flex align-items-center"
                        >
                          <MDBBtn color="link" className="px-2">
                            <MDBIcon fas icon="minus" />
                          </MDBBtn>

                          <MDBInput
                            type="number"
                            min="0"
                            defaultValue={1}
                            size="sm"
                          />

                          <MDBBtn color="link" className="px-2">
                            <MDBIcon fas icon="plus" />
                          </MDBBtn>
                        </MDBCol>
                        <MDBCol md="3" lg="2" xl="2" className="text-end">
                          <MDBTypography tag="h6" className="mb-0">
                            44.00 ₪
                          </MDBTypography>
                        </MDBCol>
                        <MDBCol md="1" lg="1" xl="1" className="text-end">
                          <a href="#!" className="text-muted">
                            <MDBIcon fas icon="times" />
                          </a>
                        </MDBCol>
                      </MDBRow> */}

                      <hr className="my-4" />

                      <div className="pt-5">
                        <MDBTypography tag="h6" className="mb-0">
                          <MDBCardText className="text-body">
                            <Link to="/" className="text-body">
                              <MDBIcon fas icon="long-arrow-alt-left me-2" />{" "}
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
                          3 מוצרים
                        </MDBTypography>
                        <MDBTypography tag="h5">100 ₪</MDBTypography>
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
                        <MDBInput className="" size="lg" label="הכנס את הקוד" />
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
                          {cartTotal.toFixed(2)} ₪
                        </MDBTypography>
                      </div>

                      <MDBBtn className="custom-button" block size="lg">
                        שלח הזמנה
                      </MDBBtn>
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
