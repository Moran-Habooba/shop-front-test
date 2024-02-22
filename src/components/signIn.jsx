import React from "react";
import PageHeader from "../common/pageHeader";
import Input from "../common/input";
import { validateFormikUsingJoi } from "../utils/validateFormikUsingJoi";
import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { useFormik } from "formik";
import { useNavigate, Navigate, Link } from "react-router-dom";
import Joi from "joi";
import { useAuth } from "../context/auth.context";
import { useCancelNavigate } from "../hook/useCancelNavigate'";
import { getJWT } from "../services/usersService";
import "./styls/signIn.css";

const SignIn = ({ redirect }) => {
  const [serverError, setServerError] = useState("");
  const navigate = useNavigate();
  const { login, user } = useAuth();
  const handleCancel = useCancelNavigate("/");
  /////כשיוזר לא מחובר
  useEffect(() => {
    if (user) {
      const syncCartWithServer = async () => {
        const localCartItems =
          JSON.parse(localStorage.getItem("cartItems")) || [];
        if (localCartItems.length > 0) {
          try {
            await syncLocalCartWithServer(localCartItems);
            localStorage.removeItem("cartItems");
          } catch (error) {
            console.error("Error syncing cart with server:", error);
          }
        }
      };

      syncCartWithServer();
    }
  }, [user]);

  const handlePoP = () => {
    Swal.fire({
      html: "התחברת בהצלחה</strong>",
      icon: "success",
      showConfirmButton: false,
      timer: 1000,
      timerProgressBar: true,
    });
  };

  const form = useFormik({
    validateOnMount: true,
    initialValues: {
      email: "",
      password: "",
    },
    validate: validateFormikUsingJoi({
      email: Joi.string()
        .min(5)
        .required()
        .email({ tlds: { allow: false } }),

      password: Joi.string()
        .min(7)
        .max(20)
        .required()
        .pattern(
          new RegExp(
            "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*-]).{9,}$"
          )
        )
        .messages({
          "string.pattern.base":
            "Must contain the following characters !@#$%^&*-.",
        }),
    }),
    async onSubmit(values) {
      try {
        await login(values);
        handlePoP();
        setTimeout(() => {
          if (redirect) {
            navigate(redirect);
          }
        }, 1500);
      } catch (err) {
        if (err.response?.status === 400) {
          setServerError(err.response.data);
        }
      }
    },
  });
  if (user) {
    return <Navigate to="/" />;
  }

  const getProps = (name) => {
    return {
      ...form.getFieldProps(name),
      error: form.touched[name] && form.errors[name],
    };
  };
  ///////////פה הוספתי ליוזר לא מחובר

  async function syncLocalCartWithServer() {
    const token = getJWT();
    const localCartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
    if (localCartItems.length > 0) {
      for (const item of localCartItems) {
        try {
          await fetch("http://localhost:3000/api/cart", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-auth-token": token,
            },
            body: JSON.stringify({
              card_id: item.card_id,
              quantity: item.quantity,
            }),
          });
        } catch (error) {
          console.error("Failed to add item to cart:", error);
        }
      }
      localStorage.removeItem("cartItems");
    }
  }

  return (
    <>
      <PageHeader title="ברוכים השבים" description="" />
      <div className="container  customforsmart">
        <div className="row justify-content-center ">
          <div className="col-lg-6 col-md-8 col-sm-10">
            <div className="border p-3 m-5 ">
              <div className="form-top">
                <div className="form-top-left">
                  <h3 className="custom-text-contact">
                    התחבר עכשיו <i className="bi bi-pencil"></i>
                  </h3>
                  <p className="custom-text-contact">
                    להתחברות מלאו את הפרטים:
                  </p>
                </div>
              </div>

              <form onSubmit={form.handleSubmit}>
                {serverError && (
                  <div className="alert alert-danger">{serverError}</div>
                )}
                <div className="row">
                  <Input
                    {...getProps("email")}
                    label="אימייל"
                    type="email"
                    required
                  />

                  <Input
                    {...getProps("password")}
                    label="סיסמא"
                    type="password"
                    required
                  />
                </div>

                <button
                  type="button"
                  onClick={handleCancel}
                  className="btn btn-danger me-2 custom-btn"
                >
                  ביטול
                </button>

                <button
                  type="submit"
                  className="btn btn-primary custom-btn me-2 "
                >
                  התחבר
                </button>
              </form>
              <Link to={"/emailVerification"}>שכחת את הסיסמא?</Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignIn;
