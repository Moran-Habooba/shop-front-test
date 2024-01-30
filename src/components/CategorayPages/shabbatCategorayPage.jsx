import React, { useEffect, useState } from "react";
import { getProductsByCategory } from "../../services/categoryService";
import Card from "../card";

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
      <div className="products-container">
        {products.map((product) => (
          <Card key={product._id} card={product} />
        ))}
      </div>
    </div>
  );
};

export default ShabbatCategoryPage;