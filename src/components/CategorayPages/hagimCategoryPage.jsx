import React, { useEffect, useState } from "react";
import { getProductsByCategory } from "../../services/categoryService";
import Card from "../card";
import "../styls/CategoryPages.css";

const HagimCategoryPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getProductsByCategory("חגים")
      .then(({ data }) => {
        console.log(data);
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        setError("לא ניתן לטעון מוצרים עבור קטגורית שבת.");
        setLoading(false);
      });
  }, []);

  if (loading) return <div>טוען...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h1>חגים</h1>
      <div className="container">
        <div className="row">
          {products.map((product) => (
            <div className="col-sm-12 col-md-6 col-lg-4" key={product._id}>
              <Card card={product} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HagimCategoryPage;
