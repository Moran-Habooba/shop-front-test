import React, { useEffect, useState } from "react";
import { getProductsByCategory } from "../../services/categoryService";
import Card from "../card";
import "../styls/CategoryPages.css";
import cardsService from "../../services/cardsService";
import { useAuth } from "../../context/auth.context";
const MezuzahCategoryPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user } = useAuth();

  // useEffect(() => {
  //   getProductsByCategory("מזוזות")
  //     .then(({ data }) => {
  //       console.log(data);
  //       setProducts(data);
  //       setLoading(false);
  //     })
  //     .catch((err) => {
  //       setError("לא ניתן לטעון מוצרים עבור קטגורית שבת.");
  //       setLoading(false);
  //     });
  // }, []);
  useEffect(() => {
    getProductsByCategory("מזוזות")
      .then(({ data }) => {
        console.log(data);
        setProducts(
          data.map((product) => ({
            ...product,
            liked: product.likes.includes(user?._id),
          }))
        );
        setLoading(false);
      })
      .catch((err) => {
        setError("לא ניתן לטעון מוצרים עבור קטגורית שבת.");
        setLoading(false);
      });
  }, [user]);
  const toggleLike = async (productId) => {
    try {
      await cardsService.likeCard(productId);
      const { data } = await getProductsByCategory("מזוזות");
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
    <div>
      <h1>בתי מזוזה </h1>
      <div className="container ">
        <div className="row ">
          {products.map((product) => (
            <div key={product._id} className="col-sm">
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

export default MezuzahCategoryPage;
