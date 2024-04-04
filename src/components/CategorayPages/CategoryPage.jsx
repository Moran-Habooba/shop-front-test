import React, { useEffect, useState } from "react";
import { getProductsByCategory } from "../../services/categoryService";
import Card from "../card";
import "../styls/CategoryPages.css";
import cardsService from "../../services/cardsService";
import { useAuth } from "../../context/auth.context";

const CategoryPage = ({ category, title }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user } = useAuth();

  useEffect(() => {
    getProductsByCategory(category)
      .then(({ data }) => {
        setProducts(
          data.map((product) => ({
            ...product,
            liked: product.likes.includes(user?._id),
          }))
        );
        setLoading(false);
      })
      .catch((err) => {
        setError(`לא ניתן לטעון מוצרים עבור קטגורית ${category}.`);
        setLoading(false);
      });
  }, [user, category]);
  const toggleLike = async (productId) => {
    try {
      await cardsService.likeCard(productId);
      const { data } = await getProductsByCategory(category);
      setProducts(
        data.map((product) => ({
          ...product,
          liked: product.likes.includes(user?._id),
        }))
      );
    } catch (err) {
      console.error(err);
    }
  };
  if (loading) return <div>טוען...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="cardStyle">
      <h1 className="CategoryTitle">{title}</h1>
      <div className="container">
        <div className="row">
          {products.map((product) => (
            <div key={product._id} className="col-sm" style={{ flexGrow: 0 }}>
              <Card
                card={product}
                onLiked={() => toggleLike(product._id)}
                liked={product.liked}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;
