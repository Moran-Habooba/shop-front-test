import React from "react";
import PageHeader from "../common/pageHeader";
import "./styls/signUp.css";
import Input from "../common/input";
import { useFormik } from "formik";
import Joi from "joi";
import { validateFormikUsingJoi } from "../utils/validateFormikUsingJoi";
import { useState } from "react";

import { useNavigate, Navigate } from "react-router-dom";
import { useAuth } from "../context/auth.context";
import Swal from "sweetalert2";
import { useCancelNavigate } from "../hook/useCancelNavigate'";

const SignUp = ({ redirect }) => {
  const [serverError, setServerError] = useState("");
  const navigate = useNavigate();
  const { signUp, user } = useAuth();
  const handleCancel = useCancelNavigate("/");
  const [passwordShown, setPasswordShown] = useState(false);
  const togglePasswordVisibility = () => {
    setPasswordShown(!passwordShown);
  };
  const handlePoPsignUp = () => {
    Swal.fire({
      html: "נרשמת בהצלחה!</strong>",
      icon: "success",
      showConfirmButton: false,
      timer: 1000,
      timerProgressBar: true,
    });
  };

  const form = useFormik({
    validateOnMount: true,
    initialValues: {
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      password: "",
      city: "",
      street: "",
      country: "",
      house_number: "",
      zip: "",
      image_file: null,
      isBusiness: false,
    },
    validate: validateFormikUsingJoi({
      first_name: Joi.string().min(2).max(1000).required(),
      last_name: Joi.string().min(2).max(1000).required(),
      email: Joi.string()
        .min(5)
        .required()
        .email({ tlds: { allow: false } }),
      phone: Joi.string()
        .min(9)
        .max(11)
        .required()
        .regex(/^0[2-9]\d{7,8}$/),
      password: Joi.string()
        .min(8)
        .max(20)
        .required()
        .pattern(
          new RegExp(
            "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*-]).{8,}$"
          )
        )
        .messages({
          "string.pattern.base":
            "הסיסמה חייבת להיות באורך 9 תווים לפחות ולהכיל אות גדולה, אות קטנה, מספר ואחד מהתווים הבאים!@#$%^&*-.",
        }),

      city: Joi.string().min(2).max(256).required(),
      street: Joi.string().min(2).max(256).required(),
      country: Joi.string().min(2).max(256).required(),
      house_number: Joi.number().min(2).max(256).required(),
      // zip: Joi.number().min(2).max(256).required(),
      zip: Joi.number().min(1).max(99999999).integer().required(),
      image_file: Joi.any().label("Image File").allow(""),
      isBusiness: Joi.boolean().required(),
    }),

    async onSubmit(values) {
      console.log("Form submitted", values);
      const formData = new FormData();
      formData.append("city", values.city);
      formData.append("street", values.street);
      formData.append("country", values.country);
      formData.append("houseNumber", values.house_number);
      formData.append("zip", values.zip);
      formData.append("email", values.email);
      formData.append("first_name", values.first_name);
      formData.append("last_name", values.last_name);
      formData.append("phone", values.phone);
      formData.append("password", values.password);
      formData.append("isBusiness", values.isBusiness);

      if (values.image_file) {
        formData.append("image_file", values.image_file);
      }

      try {
        await signUp(formData);
        handlePoPsignUp();
        if (redirect) {
          navigate(redirect);
        }
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
      <PageHeader
        title="מועדון ה- VIP של תורתך שעשועי"
        description={
          <>
            הצטרפו למועדון הלקוחות שלנו ותוכלו להנות ממגוון הטבות ייחודיות
            עבורך! 10% הנחה בכל רכישה, הטבת יום הולדת ועוד...
            <br />
            <strong>הצטרפו עכשיו!</strong>
          </>
        }
      />
      <div className="container custom-body ">
        <div className="row justify-content-center">
          <div className="col-lg-6 col-md-8 col-sm-10 custom-container">
            <div className="border p-3  customborder2 ">
              <div className="form-top ">
                <div className="form-top-left">
                  <h3 className="custom-text-contact">
                    הירשם עכשיו <i className="bi bi-pencil"></i>
                  </h3>
                  <p className="custom-text-contact ">
                    מלא את הטופס למטה כדי לקבל גישה מיידית:
                  </p>
                </div>
              </div>

              <form onSubmit={form.handleSubmit}>
                {serverError && (
                  <div className="alert alert-danger ">{serverError}</div>
                )}
                <div className="row">
                  <Input
                    {...getProps("first_name")}
                    label="שם פרטי"
                    type="text"
                    required
                  />

                  <Input
                    {...getProps("last_name")}
                    label="שם משפחה"
                    type="text"
                    required
                  />
                  <Input
                    {...getProps("email")}
                    label="אימייל"
                    type="email"
                    required
                  />
                  <Input
                    {...getProps("phone")}
                    label="טלפון"
                    type="text"
                    required
                  />
                  {/* <Input
                    {...getProps("password")}
                    label="סיסמא"
                    type="password"
                    required
                  /> */}

                  <Input
                    {...getProps("city")}
                    label="עיר"
                    type="text"
                    required
                  />
                  <Input
                    {...getProps("street")}
                    label="רחוב"
                    type="text"
                    required
                  />
                  <Input
                    {...getProps("country")}
                    label="ארץ"
                    type="text"
                    required
                  />

                  <Input
                    {...getProps("house_number")}
                    label="מספר בית"
                    type="number"
                    required
                  />

                  <Input
                    {...getProps("zip")}
                    label="מיקוד"
                    type="number"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="image_file" className="form-label">
                    תמונת פרופיל
                  </label>
                  <input
                    type="file"
                    className="form-control"
                    id="image_file"
                    onChange={(event) =>
                      form.setFieldValue(
                        "image_file",
                        event.currentTarget.files[0]
                      )
                    }
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label"></label>
                  <div
                    // className="input-group"
                    style={{
                      position: "relative",
                      display: "grid",
                      // justifyContent: "start",
                    }}
                  >
                    <Input
                      {...getProps("password")}
                      label="סיסמא"
                      type={passwordShown ? "text" : "password"}
                      className="form-control"
                      required
                    />
                    <button
                      className="btn eye"
                      style={{
                        position: "absolute",
                        left: "283px",
                        top: "32px",
                      }}
                      type="button"
                      onClick={togglePasswordVisibility}
                    >
                      <i
                        className={
                          passwordShown ? "bi bi-eye-slash" : "bi bi-eye"
                        }
                        style={{ fontSize: "16px", color: "#e5b55c" }}
                      ></i>
                    </button>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="btn btn-danger me-2 custom-btn ms-2"
                >
                  ביטול
                </button>

                <button
                  type="submit"
                  className="btn btn-primary  custom-btn custom-btn"
                  // disabled={!form.isValid}
                >
                  שליחה
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignUp;
