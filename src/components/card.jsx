import { Link } from "react-router-dom";
import "../components/styls/card.css";
import Swal from "sweetalert2";
import { useLocation } from "react-router-dom";
import { useAuth } from "../context/auth.context";
import { useState } from "react";
import { addToCart } from "../services/cartService";
import { useCart } from "../context/cart.context";
import { useNavigate } from "react-router-dom";

const Card = ({
  card: {
    title,
    subtitle,
    description,
    bizNumber,
    _id,
    category,
    quantity,
    image_file,
    price,
    likes,
  },
  onLiked,
  liked,
  isCreator,
}) => {
  const location = useLocation();
  const { user } = useAuth();
  const [count, setCount] = useState(0);
  const likeCount = likes.length;
  const { cartItems, setCartItems, totalItemsInCart, setTotalItemsInCart } =
    useCart();
  const navigate = useNavigate();
  const handleClick = () => {
    if (location.pathname === "/" || location.pathname === "/my-cards") {
      const popupMessage = `
    <div style="text-align: right;">
      <h4><strong>שם המוצר:</strong> ${title}</h4>
      <p><strong>מחיר:</strong>₪${price}</p>
      <p><strong>כמות במלאי:</strong> ${quantity}</p>
      <p><strong>תאור המוצר:</strong> ${description}</p>
    </div>
  `;

      Swal.fire({
        title: `
        <div style=" padding: 10px;  color: white;">
          <img src="${
            image_file?.path
              ? `http://localhost:3000/${image_file.path}`
              : "DefaultImg.svg.png"
          }" style="width: 100%; max-width: 400px; height: auto;" />
      </div>
        `,
        html: popupMessage,
        showCancelButton: false,
        confirmButtonText: "סגור",
        confirmButtonColor: "#e5b55c",
      });
    }
  };
  const increaseCount = () => {
    if (count < quantity) {
      setCount((prevCount) => prevCount + 1);
    }
  };

  const decreaseCount = () => {
    if (count > 0) {
      setCount((prevCount) => prevCount - 1);
    }
  };

  const toggleLike = () => {
    onLiked();
  };

  // const handleAddToCart = () => {
  //   const card_id = _id;
  //   const quantity = count;

  //   if (quantity > 0) {
  //     addToCart(card_id, quantity)
  //       .then((data) => {
  //         Swal.fire({
  //           icon: "success",
  //           title: "המוצר נוסף לסל בהצלחה!",
  //           showConfirmButton: false,
  //           timer: 1000,
  //           customClass: {
  //             popup: "small-popup",
  //           },
  //         }).then(() => {
  //           navigate("/ShoppingCart");
  //         });

  //         console.log("Product added to cart:", data);
  //         const updatedCartItems = [...cartItems, { card_id, quantity }];
  //         setCartItems(updatedCartItems);

  //         const newTotalItemsCount = totalItemsInCart + quantity;
  //         setTotalItemsInCart(newTotalItemsCount);
  //       })
  //       .catch((error) => {
  //         console.error("Error adding product to cart:", error);
  //       });
  //   } else {
  //     Swal.fire({
  //       icon: "error",
  //       title: "שגיאה",
  //       text: "יש לבחור כמות מוצרים להוספה",
  //       customClass: {
  //         popup: "small-popup",
  //       },
  //     });
  //   }
  // };
  const handleAddToCart = () => {
    const newCartItem = {
      card_id: _id,
      title,
      price,
      description,
      quantity: count,
      image: image_file?.path
        ? `http://localhost:3000/${image_file.path}`
        : "DefaultImg.svg.png",
    };

    if (count > 0) {
      if (user) {
        addToCart(_id, count)
          .then(() => {
            Swal.fire({
              icon: "success",
              title: "המוצר נוסף לסל בהצלחה!",
              showConfirmButton: false,
              timer: 1500,
            }).then(() => {
              navigate("/ShoppingCart");
            });
          })
          .catch((error) => {
            console.error("Error adding product to cart:", error);
            Swal.fire({
              icon: "error",
              title: "שגיאה בהוספת המוצר לסל",
            });
          });
      } else {
        let cart = JSON.parse(localStorage.getItem("cartItems")) || [];
        let itemIndex = cart.findIndex(
          (item) => item.card_id === newCartItem.card_id
        );
        if (itemIndex !== -1) {
          cart[itemIndex].quantity += count;
        } else {
          cart.push(newCartItem);
        }
        localStorage.setItem("cartItems", JSON.stringify(cart));

        Swal.fire({
          icon: "success",
          title: "המוצר נוסף לסל בהצלחה!",
          showConfirmButton: false,
          timer: 1500,
        }).then(() => {
          navigate("/ShoppingCart");
        });
      }
    } else {
      Swal.fire({
        icon: "error",
        title: "שגיאה",
        text: "יש לבחור כמות מוצרים להוספה",
      });
    }
  };

  return (
    <div className="card me-4 mb-4 p-2" style={{ width: "16rem" }}>
      <img
        src={
          image_file?.path
            ? `http://localhost:3000/${image_file.path}`
            : "DefaultImg.svg.png"
        }
        className="card-img-top"
        style={{ height: "15rem" }}
        alt={image_file?.originalname || "Card image"}
      />

      <div
        className="search-icon d-flex align-items-center"
        onClick={handleClick}
        style={{ cursor: "pointer" }}
      >
        <i className="bi bi-search"></i>
        <p className="ms-2 mb-0 me-2">צפיה מהירה</p>
      </div>
      <div className="card-body">
        <h4 className="card-title">{title}</h4>
        <h5 className="card-subtitle">{subtitle}</h5>
        <p className="card-text">{description}</p>
      </div>
      <ul className="list-group list-group-flush">
        <li className="list-group-item ms-5" style={{ marginRight: "-45px" }}>
          <strong>מחיר:</strong> ₪{price}
        </li>
        <li className="list-group-item" style={{ marginRight: "-45px" }}>
          <strong>כמות במלאי:</strong>
          {quantity > 0 ? (
            quantity
          ) : (
            <span style={{ color: "red" }}> המלאי אזל </span>
          )}
          <br />
        </li>

        {user && (
          <li className="list-group-item" style={{ marginRight: "-45px" }}>
            <strong>קטגוריה:</strong> {category}
          </li>
        )}
      </ul>

      <div className="card-body d-flex justify-content-between">
        <div>
          {user &&
            (location.pathname.includes("/my-cards") ||
              location.pathname.includes("/my-cards/edit")) && (
              <>
                <Link to={`/my-cards/delete/${_id}`} className="card-link">
                  <i className="bi bi-trash"></i>
                </Link>
                <Link to={`/my-cards/edit/${_id}`} className="card-link">
                  <i className="bi bi-pencil-square"></i>
                </Link>
              </>
            )}
        </div>
        {!user?.isAdmin && (
          <>
            <div className="quantity-selector mr-auto ms-3">
              <button onClick={decreaseCount} className="ms-2 quantity">
                -
              </button>
              <span>{count}</span>
              <button onClick={increaseCount} className="me-2 quantity">
                +
              </button>
            </div>
            <button
              className="add-to-cart-btn quantity ms-4"
              onClick={handleAddToCart}
            >
              הוסף לסל
            </button>
          </>
        )}
      </div>

      <div>
        {user && (
          <button
            onClick={user.isAdmin ? null : () => toggleLike()}
            className="d-flex align-items-center card-link ms-auto"
            style={{ cursor: user.isAdmin ? "default" : "pointer" }}
          >
            <i
              className={`bi ${
                liked ? "bi-heart-fill heart-icon" : "bi-heart heart-icon"
              }`}
            ></i>
            {user.isAdmin ? (
              <span className="fs-6 me-2">{likeCount}</span>
            ) : (
              <span className="fs-6 me-2">
                {location.pathname.includes("/my-favorites")
                  ? "הסר ממועדפים"
                  : "הוסף למועדפים"}
              </span>
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default Card;
