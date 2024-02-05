import React from "react";
import PageHeader from "../common/pageHeader";
import "./styls/signUp.css";
import Input from "../common/input";
import { useFormik } from "formik";
import Joi from "joi";
import { validateFormikUsingJoi } from "../utils/validateFormikUsingJoi";
import { useState, useEffect } from "react";
import cardsService from "../services/cardsService";
import { getAllCategories } from "../services/categoryService";

import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/auth.context";
const CardsCreate = () => {
  const [serverError, setServerError] = useState("");
  const { user } = useAuth();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    if (!user || !user.isAdmin) {
      navigate("/");
    }
  }, [user, navigate]);
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await getAllCategories();
        setCategories(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const form = useFormik({
    validateOnMount: true,
    initialValues: {
      title: "",
      // subtitle: "",
      description: "",
      price: "",
      quantity: "",
      category: "",
      image_file: null,
    },
    validate: validateFormikUsingJoi({
      title: Joi.string().min(2).max(256).required(),
      // subtitle: Joi.string().min(2).max(256).optional(),
      description: Joi.string().min(2).max(1024).required(),
      category: Joi.string().required().trim().lowercase(),
      quantity: Joi.number().min(0).optional(),
      image_file: Joi.any().optional(),
      price: Joi.string()
        .pattern(/^₪?\d{1,3}(,\d{3})*(\.\d{2})?$/)

        .required()
        .custom((value, helpers) => {
          let numberValue = Number(value.replace(/₪|,|\./g, ""));
          if (numberValue < 0) {
            return helpers.error("any.invalid");
          }
          return value;
        }),
    }),

    async onSubmit(values) {
      if (!user || !user.isAdmin) {
        setServerError("Unauthorized: Only admins can create cards.");
        return;
      }
      const formData = new FormData();
      formData.append("price", values.price);
      formData.append("title", values.title);
      // formData.append("subtitle", values.subtitle);
      formData.append("description", values.description);
      formData.append("quantity", values.quantity);
      formData.append("category", values.category);

      if (values.image_file) {
        formData.append("image_file", values.image_file);
      }

      try {
        await cardsService.createCard(formData);
        navigate("/my-cards");
      } catch (err) {
        console.error("Error sending data to server:", err);
        if (err.response?.status === 400) {
          setServerError(err.response.data);
        } else {
          console.error(err);
          setServerError("An  error :");
        }
      }
    },
  });

  const getProps = (name) => {
    return {
      ...form.getFieldProps(name),
      error: form.touched[name] && form.errors[name],
    };
  };

  return (
    <>
      <PageHeader title="הוספת מוצר" description="הוספת מוצר חדש" />
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-6 col-md-8 col-sm-10">
            <div className="border p-3 m-5">
              <div className="form-top">
                <div className="form-top-left">
                  <h3>
                    הוספת מוצר<i className="bi bi-pencil me-2"></i>
                  </h3>
                  <p>תמלא את השדות הבאים כדי להוסיף מוצר</p>
                </div>
              </div>

              <form onSubmit={form.handleSubmit}>
                {serverError && (
                  <div className="alert alert-danger">{serverError}</div>
                )}
                <div className="row">
                  <Input
                    {...getProps("title")}
                    label="כותרת"
                    type="text"
                    required
                  />
                  {/* <Input
                    {...getProps("subtitle")}
                    label="כותרת משנית"
                    type="text"
                    required
                  /> */}
                  <Input
                    {...getProps("description")}
                    label="תאור המוצר"
                    type="text"
                    required
                  />
                  <Input
                    {...getProps("price")}
                    label="מחיר"
                    type="text"
                    required
                  />
                  <Input
                    {...getProps("quantity")}
                    label="מלאי"
                    type="number"
                    required
                  />

                  <div className="mb-3">
                    <label htmlFor="image_file" className="form-label">
                      תמונה של המוצר
                    </label>
                    <input
                      type="file"
                      className="form-control"
                      id="image_file"
                      onChange={(event) => {
                        form.setFieldValue(
                          "image_file",
                          event.currentTarget.files[0]
                        );
                      }}
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="category" className="form-label">
                      בחר קטגוריה
                    </label>
                    <select
                      className="form-select"
                      id="category"
                      {...getProps("category")}
                      required
                    >
                      <option value="" disabled>
                        בחר קטגוריה
                      </option>
                      {categories.map((category) => (
                        <option key={category._id} value={category.name}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <button
                  onClick={() => navigate("/my-cards")}
                  type="submit"
                  className="btn btn-danger ms-3"
                >
                  ביטול
                </button>

                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={!form.isValid}
                >
                  הוסף
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CardsCreate;
