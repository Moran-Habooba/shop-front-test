import React from "react";
import PageHeader from "../common/pageHeader";
import "./styls/signUp.css";
import Input from "../common/input";
import { useFormik } from "formik";
import Joi from "joi";
import { validateFormikUsingJoi } from "../utils/validateFormikUsingJoi";
import { useState, useEffect } from "react";
import cardsService from "../services/cardsService";
import { useCardById } from "../hook/useCardById";
import { useNavigate, useParams } from "react-router-dom";
import { useCancelNavigate } from "../hook/useCancelNavigate'";
import { useAuth } from "../context/auth.context";
import { getAllCategories } from "../services/categoryService";

const CardsEdit = () => {
  const [serverError, setServerError] = useState("");
  const navigate = useNavigate();
  const { user } = useAuth();
  const [categories, setCategories] = useState([]);

  const { id } = useParams();
  const card = useCardById(id);

  const handleCancel = useCancelNavigate("/my-cards");

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
      quantity: 5,
      category: "",
      image_file: null,
      // likes: [""],
      bizNumber: "",
      user_id: "",
    },
    validate: validateFormikUsingJoi({
      // likes: Joi.array().items(Joi.string()).optional(),
      bizNumber: Joi.number().optional(),
      user_id: Joi.string().optional(),

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
      // formData.append("likes", values.likes);
      formData.append("bizNumber", values.bizNumber);
      formData.append("user_id", values.user_id);

      if (values.image_file) {
        formData.append("image_file", values.image_file);
      }

      formData.forEach((value, key) => {
        console.log(`${key}: ${value}`);
      });

      try {
        await cardsService.updateCard(card._id, formData);
        console.log("Data sent to server:", values);
        navigate("/my-cards");
      } catch (err) {
        console.error("Error during form submission:", err);
        if (err.response?.status === 400) {
          setServerError(err.response.data);
        } else {
          console.error(err);
          setServerError("An  error :");
        }
      }
    },
  });

  // useEffect(() => {
  //   if (!card) {
  //     return;
  //   }
  //   const {
  //     title,
  //     subtitle,
  //     description,
  //     price,
  //     quantity,
  //     category,
  //     image_file,
  //   } = card;

  //   form.setValues({
  //     title: title || "",
  //     subtitle: subtitle || "",
  //     description: description || "",
  //     price: price || "",

  //     quantity: quantity || "",
  //     category: category || "",
  //     image_file: image_file || "",
  //   });
  // }, [card, form.setValues]);

  // useEffect(() => {
  //   console.log("Card data after editing:", card);
  //   if (!card) {
  //     return;
  //   }

  //   const {
  //     title,
  //     subtitle,
  //     description,
  //     price,
  //     quantity,
  //     category,
  //     image_file,
  //     likes,
  //     bizNumber,
  //     user_id,
  //   } = card;

  //   form.setValues({
  //     title: title || "",
  //     subtitle: subtitle || "",
  //     description: description || "",
  //     price: price || "",
  //     quantity: quantity || 0,
  //     category: category || "",
  //     image_file: image_file || "",
  //     likes: likes || [],
  //     bizNumber: bizNumber || "",
  //     user_id: user_id || "",
  //   });
  // }, [card, form.setValues]);
  useEffect(() => {
    if (card) {
      form.setValues({
        title: card.title || "",
        // subtitle: card.subtitle || "",
        description: card.description || "",
        price: card.price || "",
        quantity: card.quantity || 0,
        category: card.category || "",
        image_file: null,
        // likes: card.likes || [""],
        bizNumber: card.bizNumber || "",
        user_id: card.user_id || "",
      });
    }
  }, [card, form.setValues]);

  const getProps = (name) => {
    return {
      ...form.getFieldProps(name),
      error: form.touched[name] && form.errors[name],
    };
  };

  return (
    <>
      <PageHeader title="Edit card" description="Edit card" />
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-6 col-md-8 col-sm-10">
            <div className="border p-3 m-5">
              <div className="form-top">
                <div className="form-top-left">
                  <h3>
                    עריכת מוצר <i className="bi bi-pencil"></i>
                  </h3>
                  <p>תמלא את הפרטים:</p>
                </div>
              </div>

              <form onSubmit={form.handleSubmit} encType="multipart/form-data">
                {serverError && (
                  <div className="alert alert-danger">{serverError}</div>
                )}
                <div className="row">
                  {/* <Input
                    {...getProps("likes")}
                    type="hidden"
                    onChange={(e) =>
                      form.setFieldValue("likes", e.target.value)
                    }
                  /> */}

                  <Input
                    {...getProps("bizNumber")}
                    type="hidden"
                    onChange={(e) =>
                      form.setFieldValue("bizNumber", e.target.value)
                    }
                  />

                  <Input
                    {...getProps("user_id")}
                    type="hidden"
                    onChange={(e) =>
                      form.setFieldValue("user_id", e.target.value)
                    }
                  />

                  <Input
                    {...getProps("title")}
                    label="שם המוצר"
                    type="text"
                    required
                    onChange={(e) =>
                      form.setFieldValue("title", e.target.value)
                    }
                  />

                  <Input
                    {...getProps("description")}
                    label="תאור המוצר"
                    type="text"
                    required
                    onChange={(e) =>
                      form.setFieldValue("description", e.target.value)
                    }
                  />

                  <Input
                    {...getProps("quantity")}
                    label="כמות במלאי"
                    type="text"
                    required
                    onChange={(e) =>
                      form.setFieldValue("quantity", e.target.value)
                    }
                  />
                  <Input
                    {...getProps("price")}
                    label="מחיר"
                    type="text"
                    required
                    onChange={(e) =>
                      form.setFieldValue("price", e.target.value)
                    }
                  />
                  <div className="mb-3">
                    <label htmlFor="category" className="form-label">
                      קטגוריה
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

                  {/* <Input
                    {...getProps("subtitle")}
                    label="תת קטגוריה"
                    type="text"
                    required
                    onChange={(e) =>
                      form.setFieldValue("subtitle", e.target.value)
                    }
                  /> */}
                </div>

                <div className="mb-3">
                  <label htmlFor="image_file" className="form-label">
                    תמונה של המוצר
                  </label>
                  <input
                    type="file"
                    className="form-control"
                    id="image_file"
                    name="image_file"
                    onChange={(event) =>
                      form.setFieldValue(
                        "image_file",
                        event.currentTarget.files[0]
                      )
                    }
                  />
                </div>

                <button
                  type="button"
                  onClick={handleCancel}
                  className="btn btn-danger me-2"
                >
                  Cancel
                </button>

                <button type="submit" className="btn btn-primary ">
                  Confirm
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CardsEdit;
