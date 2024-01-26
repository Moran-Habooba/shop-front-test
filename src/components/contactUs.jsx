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
          title: "Success!",
          text: "Message sent successfully.",
          icon: "success",
          confirmButtonText: "OK",
          timer: 1000,
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
            Contact Us <i className="bi bi-telephone-fill"></i>
          </>
        }
        description=" We'd love to hear from you! Whether you have a question about our services, 
        need assistance or just want to talk, we are all ears. Fill out the form below, 
        and our team will get back to you within 24 hours."
      />
      <div className="container mb-5">
        <div className="row justify-content-center">
          <div className="col-lg-6">
            <form onSubmit={form.handleSubmit} className="mt-5 form-border">
              {serverError && (
                <div className="alert alert-danger">{serverError}</div>
              )}
              <Input
                {...form.getFieldProps("name")}
                type="text"
                label="Name"
                required
                error={form.touched.name && form.errors.name}
                className="form-control"
              />
              <Input
                {...form.getFieldProps("email")}
                type="email"
                label="Email"
                required
                error={form.touched.email && form.errors.email}
                className="form-control"
              />
              <div className="mb-3">
                <label htmlFor="message" className="form-label">
                  Message:
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
                  className="btn btn-primary"
                  type="submit"
                >
                  Send
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default ContactUs;
