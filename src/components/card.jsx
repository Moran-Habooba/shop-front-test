import { Link } from "react-router-dom";
import "../components/styls/card.css";
import Swal from "sweetalert2";
import { useLocation } from "react-router-dom";
import { useAuth } from "../context/auth.context";

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
  },
  onLiked,
  liked,
  isCreator,
}) => {
  const location = useLocation();
  const { user } = useAuth();
  const handleClick = () => {
    if (location.pathname === "/") {
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
        <div style="border: 2px solid #0a4275; padding: 10px; background-color: #0a4275; color: white;">
          <img src="${
            image_file?.path
              ? `http://localhost:3000/${image_file.path}`
              : "DefaultImg.svg.png"
          }" style="width: 100%; max-width: 400px; height: auto;" />
      </div>
        `,
        html: popupMessage,
        showCancelButton: false,
        confirmButtonText: "Close",
        confirmButtonColor: "#0a4275",
      });
    }
  };

  const toggleLike = () => {
    onLiked();
  };

  return (
    <div className="card me-4 mb-4 p-2" style={{ width: "18rem" }}>
      <img
        {...(location.pathname === "/"
          ? {
              onClick: handleClick,
              style: { cursor: "pointer", width: "300px", height: "200px" },
            }
          : {})}
        src={
          image_file?.path
            ? `http://localhost:3000/${image_file.path}`
            : "DefaultImg.svg.png"
        }
        className="card-img-top"
        alt={image_file?.originalname || "Card image"}
      />

      <div className="card-body">
        <h4 className="card-title">{title}</h4>
        <h5 className="card-subtitle">{subtitle}</h5>
        <p className="card-text">{description}</p>
      </div>
      <ul className="list-group list-group-flush">
        <li className="list-group-item">
          <strong>מחיר:</strong> {price}
        </li>
        <li className="list-group-item">
          <strong>כמות במלאי:</strong> {quantity}
          <br />
        </li>
        {user && user.isAdmin && (
          <li className="list-group-item">
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

        <div>
          {user && (
            <button onClick={() => toggleLike()} className="card-link ms-auto">
              <i
                className={`bi ${
                  liked ? "bi-heart-fill heart-icon" : "bi-heart heart-icon"
                }`}
              ></i>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Card;
