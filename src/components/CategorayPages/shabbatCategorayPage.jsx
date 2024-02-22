import React, { useEffect, useState } from "react";
import { getProductsByCategory } from "../../services/categoryService";
import Card from "../card";
import "../styls/CategoryPages.css";

const ShabbatCategoryPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getProductsByCategory("שבת")
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
      <h1>שבת קודש</h1>
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

export default ShabbatCategoryPage;
