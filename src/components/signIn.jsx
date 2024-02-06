import React from "react";
import PageHeader from "../common/pageHeader";
import Input from "../common/input";
import { validateFormikUsingJoi } from "../utils/validateFormikUsingJoi";
import { useState } from "react";
import Swal from "sweetalert2";
import { useFormik } from "formik";
import { useNavigate, Navigate } from "react-router-dom";
import Joi from "joi";
import { useAuth } from "../context/auth.context";
import { useCancelNavigate } from "../hook/useCancelNavigate'";

const SignIn = ({ redirect }) => {
  const [serverError, setServerError] = useState("");
  const navigate = useNavigate();
  const { login, user } = useAuth();
  const handleCancel = useCancelNavigate("/");

  const handlePoP = () => {
    Swal.fire({
      html: "Login was successful!</strong>",
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

  return (
    <>
      <PageHeader title="ברוכים השבים" description="" />
      <div className="container custom-body ">
        <div className="row justify-content-center">
          <div className="col-lg-6 col-md-8 col-sm-10">
            <div className="border p-3 m-5">
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
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignIn;
