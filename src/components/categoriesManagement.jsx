import React, { useEffect, useState } from "react";
import {
  addCategory,
  getAllCategories,
  getProductsCountInCategory,
  removeCategory,
} from "../services/categoryService";
import Swal from "sweetalert2";
import "../components/styls/categoriesManagement.css";

const CategoriesManagement = () => {
  const [categories, setCategories] = useState([]);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [error, setError] = useState("");

  const [showAddModal, setShowAddModal] = useState(false);
  const handleShowAddModal = () => setShowAddModal(true);
  const handleCloseAddModal = () => setShowAddModal(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data: categoriesData } = await getAllCategories();
        const categoriesWithProductCount = await Promise.all(
          categoriesData.map(async (category) => {
            try {
              const { data: productsCountData } =
                await getProductsCountInCategory(category.name);
              return { ...category, productCount: productsCountData.count };
            } catch (error) {
              console.error(
                `Error fetching product count for category ${category.name}:`,
                error
              );
              return { ...category, productCount: 0 };
            }
          })
        );
        setCategories(categoriesWithProductCount);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setError("Failed to fetch categories");
      }
    };

    fetchCategories();
  }, []);

  const handleAddCategory = async () => {
    if (newCategoryName.trim()) {
      try {
        const { data } = await addCategory({ name: newCategoryName });

        const newCategory = { ...data, productCount: 0 };
        setCategories([...categories, newCategory]);
        setNewCategoryName("");
        handleCloseAddModal();
        setError("");
      } catch (error) {
        console.error("Error adding category:", error);
        setError("Failed to add category");
      }
    } else {
      setError("Category name cannot be empty");
    }
  };

  const handleDeleteCategory = async (categoryId, productCount) => {
    if (productCount > 0) {
      Swal.fire({
        icon: "warning",
        title: "לא ניתן למחוק קטגוריה זו",
        text: "לא ניתן למחוק קטגוריה כל עוד יש בה מוצרים. מחק את המוצרים או שנה להם קטגוריה.",
        confirmButtonText: "אישור",
      });
    } else {
      Swal.fire({
        title: "האם אתה בטוח?",
        text: "אתה לא תוכל לשחזר את הפעולה הזו!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "כן, מחק אותה!",
        cancelButtonText: "ביטול",
      }).then((result) => {
        if (result.isConfirmed) {
          removeCategory(categoryId)
            .then(() => {
              setCategories(
                categories.filter((category) => category._id !== categoryId)
              );
              Swal.fire("נמחק!", "הקטגוריה נמחקה.", "success");
            })
            .catch((error) => {
              console.error("Error deleting category:", error);
              Swal.fire("שגיאה!", "הפעולה נכשלה.", "error");
            });
        }
      });
    }
  };

  return (
    <div>
      <h1 className="text-center">ניהול קטגוריות</h1>
      <div>
        <div className="d-flex justify-content-center">
          <button
            onClick={handleShowAddModal}
            className="btn btn-primary mb-4 mt-3"
          >
            הוסף קטגוריה
          </button>
        </div>

        <div
          className={`modal ${showAddModal ? "show" : ""}`}
          style={{ display: showAddModal ? "block" : "none" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">הוספת קטגוריה חדשה</h5>
                <button
                  type="button"
                  className="close close-button"
                  onClick={handleCloseAddModal}
                >
                  <span>&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <input
                  type="text"
                  className="form-control"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="שם הקטגוריה"
                />
                {error && <div className="alert alert-danger">{error}</div>}
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={handleCloseAddModal}
                >
                  ביטול
                </button>
                <button
                  type="button"
                  className="btn  btn-apply"
                  onClick={handleAddCategory}
                >
                  אישור
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Backdrop for modal */}
        {showAddModal && <div className="modal-backdrop show"></div>}
      </div>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>מזהה ID</th>
            <th>קטגוריה</th>
            <th> כמות מוצרים מאותה קטגוריה</th>
            <th>מחיקת קטגוריה</th>
          </tr>
        </thead>

        <tbody>
          {categories.map((category) => (
            <tr key={category._id}>
              <td data-label=" מספר ID">{category._id}</td>
              <td data-label="שם הקטגוריה ">{category.name}</td>
              <td data-label="כמות במלאי">{category.productCount}</td>
              <td>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() =>
                    handleDeleteCategory(category._id, category.productCount)
                  }
                >
                  מחיקה
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CategoriesManagement;
