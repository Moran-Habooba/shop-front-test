import React, { useEffect, useState } from "react";
import { getProductsByCategory } from "../../services/categoryService";
import Card from "../card";
import "../styls/CategoryPages.css";

const KippahsCategoryPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getProductsByCategory("כיפות")
      .then(({ data }) => {
        setProducts(data);
        setLoading(false);
      })
      .catch((err) => {
        setError("לא ניתן לטעון מוצרים עבור קטגורית כיפות.");
        setLoading(false);
      });
  }, []);

  if (loading) return <div>טוען...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h1>כיפות</h1>
      <div className="container">
        <div className="row">
          {products.map((product) => (
            <div key={product._id} className="col-sm">
              <Card card={product} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default KippahsCategoryPage;
