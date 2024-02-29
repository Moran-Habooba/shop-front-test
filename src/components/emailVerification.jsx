import React from "react";
import { resetPassword } from "../services/usersService";
import "./styls/emailVerification.css";
import Joi from "joi";
import { useFormik } from "formik";
import { useDarkMode } from "../context/darkMode.context";
import AlreadyLogged from "../common/AlreadyLogged";

const EmailVerification = () => {
  const { darkMode } = useDarkMode();
  const imageSrc = darkMode ? "passwordDark.png" : "password.png";
  // const [email, setEmail] = useState("");
  // const [message, setMessage] = useState("");

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   try {
  //     console.log("Email sent to server:", email);
  //     const response = await resetPassword(email);
  //     setMessage(response.data);
  //   } catch (error) {
  //     console.error("Error resetting password:", error);
  //     setMessage("שגיאה בעת איפוס הסיסמה");
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
  });

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validate: (values) => {
      const { error } = schema.validate(values);
      if (error) {
        return { email: error.details[0].message };
      }
      return {};
    },
    onSubmit: async (values) => {
      try {
        console.log("Email sent to server:", values.email);
        const response = await resetPassword(values.email);
        formik.setStatus({ message: response.data });
      } catch (error) {
        console.error("Error resetting password:", error);
        formik.setStatus({ message: "שגיאה בעת איפוס הסיסמה" });
      }
    },
  });
  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card card-email">
            <div className="card-body">
              <h2 className="card-title mb-4">איפוס סיסמה</h2>
              <form onSubmit={formik.handleSubmit}>
                <div className="form-group">
                  <label htmlFor="email">כתובת אימייל:</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className={`form-control ${
                      formik.touched.email && formik.errors.email
                        ? "is-invalid"
                        : ""
                    }`}
                    placeholder="הזן כתובת אימייל"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.email}
                    required
                  />
                  {formik.touched.email && formik.errors.email ? (
                    <div className="invalid-feedback">
                      {formik.errors.email}
                    </div>
                  ) : null}
                </div>

                <button
                  type="submit"
                  className="btn btn-primary btn-block mt-4"
                  style={{ background: "#3b5d50", border: "none" }}
                >
                  שלח מייל לאימות
                </button>
              </form>
              {formik.status && formik.status.message && (
                <p className="mt-3">{formik.status.message}</p>
              )}
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <img
            src={imageSrc}
            alt="password reset"
            className="img-fixed password"
          />
        </div>
      </div>
    </div>
  );
};
export default AlreadyLogged(EmailVerification);
