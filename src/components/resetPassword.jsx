import React, { useState, useEffect } from "react";
import { resetUserPassword } from "../services/usersService";
import { useLocation, useNavigate } from "react-router-dom";
import Joi from "joi";
import { useFormik } from "formik";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const ResetPassword = () => {
  // const [email, setEmail] = useState("");
  // const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [token, setToken] = useState("");
  const query = useQuery();
  const navigate = useNavigate();

  useEffect(() => {
    const tokenFromUrl = query.get("token");
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
    }
  }, [query]);

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   const { error } = schema.validate({ email, newPassword });
  //   if (error) {
  //     setMessage(error.details[0].message);
  //     return;
  //   }
  //   try {
  //     await resetUserPassword(token, email, newPassword);
  //     setMessage("הסיסמא עודכנה בהצלחה");
  //     setTimeout(() => {
  //       navigate("/sign-in");
  //     }, 1500);
  //   } catch (error) {
  //     console.error("Error updating password:", error);
  //     setMessage("שגיאה בעדכון הסיסמא");
  //   }
  // };
  const schema = Joi.object({
    email: Joi.string()
      .email({ tlds: { allow: false } })
      .required()
      .messages({
        "string.email": "כתובת האימייל חייבת להיות חוקית",
        "string.empty": "שדה האימייל אינו יכול להיות ריק",
      }),
    newPassword: Joi.string()
      .min(9)
      .max(1024)
      .pattern(
        new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[!@#$%^&*'-]).+$")
      )
      .required()
      .messages({
        "string.min": "הסיסמה חייבת להיות באורך של לפחות 9 תווים",
        "string.pattern.base":
          "הסיסמה חייבת לכלול אות גדולה, אות קטנה, מספר ואחד מהתווים הבאים: !@#$%^&*'-",
      }),
  });

  const validate = (values) => {
    const { error } = schema.validate(values, { abortEarly: false });
    if (error) {
      return error.details.reduce(
        (prev, curr) => ({ ...prev, [curr.path[0]]: curr.message }),
        {}
      );
    }
    return {};
  };

  const formik = useFormik({
    initialValues: {
      email: "",
      newPassword: "",
    },
    validate,
    onSubmit: async (values) => {
      try {
        await resetUserPassword(token, values.email, values.newPassword);
        setMessage("הסיסמא עודכנה בהצלחה");
        setTimeout(() => {
          navigate("/sign-in");
        }, 1500);
      } catch (error) {
        console.error("Error updating password:", error);
        setMessage("שגיאה בעדכון הסיסמא");
      }
    },
  });
  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h2 className="card-title mb-4">איפוס סיסמה</h2>
              {message && <div className="alert alert-info">{message}</div>}
              <form onSubmit={formik.handleSubmit}>
                <div className="form-group">
                  <label htmlFor="email">כתובת אימייל</label>
                  <input
                    type="email"
                    className={`form-control ${
                      formik.touched.email && formik.errors.email
                        ? "is-invalid"
                        : ""
                    }`}
                    id="email"
                    {...formik.getFieldProps("email")}
                  />
                  {formik.touched.email && formik.errors.email ? (
                    <div className="invalid-feedback">
                      {formik.errors.email}
                    </div>
                  ) : null}
                </div>
                <div className="form-group">
                  <label htmlFor="newPassword">סיסמה חדשה</label>
                  <input
                    type="password"
                    className={`form-control ${
                      formik.touched.newPassword && formik.errors.newPassword
                        ? "is-invalid"
                        : ""
                    }`}
                    id="newPassword"
                    {...formik.getFieldProps("newPassword")}
                  />
                  {formik.touched.newPassword && formik.errors.newPassword ? (
                    <div className="invalid-feedback">
                      {formik.errors.newPassword}
                    </div>
                  ) : null}
                </div>
                <button type="submit" className="btn btn-primary mt-2">
                  עדכן סיסמה
                </button>
              </form>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <img
            src="password.png"
            alt="password reset"
            className="img-fixed password"
          />
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
