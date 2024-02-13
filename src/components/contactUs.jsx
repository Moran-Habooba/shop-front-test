import React, { useState } from "react";
import Swal from "sweetalert2";
import "./styls/contactUs.css";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import Joi from "joi";
import PageHeader from "../common/pageHeader";
import { validateFormikUsingJoi } from "../utils/validateFormikUsingJoi";
import Input from "../common/input";
import { useForm } from "@formspree/react";

const ContactUs = ({ redirect }) => {
  // eslint-disable-next-line no-unused-vars
  const [formspreeState, formspreeSubmit] = useForm("mnqkyvew");
  const [serverError, setServerError] = useState("");
  const navigate = useNavigate();
  const form = useFormik({
    validateOnMount: true,
    initialValues: {
      name: "",
      email: "",
      message: "",
    },
    validate: validateFormikUsingJoi({
      name: Joi.string().min(2).max(255).required(),
      email: Joi.string()
        .min(2)
        .max(255)
        .required()
        .email({ tlds: { allow: false } }),
      message: Joi.string().required().allow(""),
    }),
    async onSubmit(values) {
      try {
        formspreeSubmit(values);
        Swal.fire({
          title: "ההודעה נשלחה בהצלחה",
          text: "נחזור אליך בהקדם ",
          icon: "success",
          confirmButtonText: "OK",
          timer: 1200,
          showConfirmButton: false,
        });
        setTimeout(() => {
          navigate(redirect);
        }, 1000);
      } catch (err) {
        if (err.response?.status === 400) {
          setServerError(err.response.data);
        }
      }
    },
  });

  return (
    <>
      <PageHeader
        title={
          <>
            צרו קשר <i className="bi bi-telephone-fill"></i>
          </>
        }
        description={
          <>
            לכל שאלה, התייעצות או פנייה אנחנו כאן...
            <br />
            השאירו פרטים ונחזור אליכם בהקדם
          </>
        }
      />
      <div className="container mb-5 container-shadow custom-body-contact-us ">
        <div className="row justify-content-center  ">
          <div className="col-lg-6 custom-container-contact-us ">
            <form onSubmit={form.handleSubmit} className="mt-5 form-border ">
              {serverError && (
                <div className="alert alert-danger">{serverError}</div>
              )}
              <Input
                {...form.getFieldProps("name")}
                type="text"
                label="שם פרטי"
                required
                error={form.touched.name && form.errors.name}
                className="form-control"
              />
              <Input
                {...form.getFieldProps("email")}
                type="email"
                label="אימייל"
                required
                error={form.touched.email && form.errors.email}
                className="form-control"
              />
              <div className="mb-3">
                <label htmlFor="message" className="form-label">
                  פרטי ההודעה:
                </label>
                <textarea
                  className={`form-control ${
                    form.touched.message && form.errors.message
                      ? "is-invalid"
                      : ""
                  }`}
                  id="message"
                  name="message"
                  rows="4"
                  {...form.getFieldProps("message")}
                />
                {form.touched.message && form.errors.message && (
                  <div className="invalid-feedback">{form.errors.message}</div>
                )}
              </div>
              <div className="text-center">
                <button
                  disabled={!form.isValid}
                  className="btn btn-primary custom-btn-contact-us"
                  type="submit"
                >
                  שלח
                </button>
                <p className="mb-2 mt-2 fs-3 fw-bold">תורתך שעשועי</p>
                <p className="mb-2 mb-1 fw-bold"> יודאיקה וקדושה</p>
                <i className="bi bi-facebook fa-2x me-2 fs-4"></i>
                <i className="bi bi-instagram fa-2x me-2 fs-4"></i>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default ContactUs;
