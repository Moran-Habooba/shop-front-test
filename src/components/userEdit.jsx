import React from "react";
import PageHeader from "../common/pageHeader";
import "./styls/signUp.css";
import Input from "../common/input";
import { useFormik } from "formik";
import Joi from "joi";
import { validateFormikUsingJoi } from "../utils/validateFormikUsingJoi";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useCancelNavigate } from "../hook/useCancelNavigate'";
import usersService from "../services/usersService";
import { useAuth } from "../context/auth.context";
import Swal from "sweetalert2";

const UserEdit = ({ redirect }) => {
  const [serverError, setServerError] = useState("");
  const navigate = useNavigate();
  const handleCancel = useCancelNavigate("/");
  // eslint-disable-next-line no-unused-vars
  const [isBusiness, setIsBusiness] = useState(false);
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const { logout } = useAuth();
  const [originalIsBusiness, setOriginalIsBusiness] = useState(false);
  const { updateUser } = useAuth(); //------------

  const [hasBusinessStatusChanged, setHasBusinessStatusChanged] =
    useState(false);
  const handleLogoutAndRedirect = () => {
    logout();
    navigate("/sign-in");
  };

  useEffect(() => {
    const loggedInUser = usersService.getUser();
    if (!loggedInUser) {
      navigate("/sign-in");
      return;
    }
    const fetchUser = async () => {
      try {
        const userData = await usersService.getUserById(loggedInUser._id);

        setUser(userData.data);
        setIsBusiness(userData.data.isBusiness);
        setOriginalIsBusiness(userData.data.isBusiness);
        setHasBusinessStatusChanged(false);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setServerError("Failed to load user data");
      }
    };
    const currentUser = usersService.getUser();
    if (!currentUser) {
      console.error("User data not found in token");
      return;
    }

    fetchUser();
  }, [id, navigate]);

  const form = useFormik({
    validateOnMount: true,
    initialValues: {
      first_name: "",
      last_name: "",
      phone: "",
      image_file: null,

      city: "",
      street: "",
      country: "",
      houseNumber: "",
      zip: "",
    },
    validate: validateFormikUsingJoi({
      first_name: Joi.string().min(2).max(1000).required(),
      last_name: Joi.string().min(2).max(1000).required(),

      phone: Joi.string()
        .min(9)
        .max(11)
        .required()
        .regex(/^0[2-9]\d{7,8}$/),
      city: Joi.string().min(2).max(256).required(),
      street: Joi.string().min(2).max(256).required(),
      country: Joi.string().min(2).max(256).required(),
      houseNumber: Joi.number().min(2).max(256).required(),

      zip: Joi.number().min(1).max(99999999).integer().required(),

      image_file: Joi.any().optional(),
    }),

    async onSubmit(values) {
      console.log("Attempting to submit form", values);

      const formData = new FormData();

      formData.append("first_name", values.first_name);
      formData.append("last_name", values.last_name);
      formData.append("phone", values.phone);
      formData.append("city", values.city);
      formData.append("street", values.street);
      formData.append("country", values.country);
      formData.append("houseNumber", values.houseNumber);
      formData.append("zip", values.zip);

      if (values.image_file) {
        formData.append("image_file", values.image_file);
      }

      formData.forEach((value, key) => {
        console.log(`${key}: ${value}`);
      });
      try {
        const { state, ...body } = values;
        await usersService.updateUsers(user._id, formData);
        await updateUser(user._id, formData);

        if (state) {
          body.state = state;
        }

        if (
          values.isBusiness !== originalIsBusiness &&
          hasBusinessStatusChanged
        ) {
          await usersService.ReplaceUserStatus(user._id, values.isBusiness);
          handleLogoutAndRedirect();
        } else {
          navigate(redirect);
        }
        Swal.fire({
          title: "נשמר בהצלחה !",
          text: "הפרטים התעדכנו בהצלחה.",
          icon: "success",
          confirmButtonText: "OK",
          timer: 1000,
          timerProgressBar: true,
        });
      } catch (err) {
        if (err.response?.status === 400) {
          setServerError(err.response.data);
        } else {
          console.error(err);
          setServerError("An  error :");
        }
      }
    },
  });
  useEffect(() => {
    if (!user) {
      return;
    }

    const {
      first_name,
      last_name,
      phone,
      street,
      houseNumber,
      city,
      zip,
      country,
      image_file,
    } = user;
    form.setValues({
      first_name: first_name || "",
      last_name: last_name || "",
      phone: phone || "",
      city: city || "",
      country: country || "",
      zip: zip || "",
      houseNumber: houseNumber || "",
      street: street || "",
    });
    if (image_file) {
      form.setFieldValue("image_file", image_file);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const getProps = (name) => {
    return {
      ...form.getFieldProps(name),
      error: form.touched[name] && form.errors[name],
    };
  };

  return (
    <>
      <PageHeader
        title="עריכת פרטים"
        description={
          <>
            כאן תוכל לעדכן את הפרטים האישיים שלך.
            <br />
            כל השינויים יישמרו אוטומטית ברגע שתלחץ על 'שמור'.
          </>
        }
      />
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-6 col-md-8 col-sm-10">
            <div className="border p-3 m-5">
              <div className="form-top">
                <div className="form-top-left">
                  <h3>
                    ערוך את הפרטים שלך <i className="bi bi-pencil"></i>
                  </h3>
                  <p>מלא את הפרטים החדשים:</p>
                </div>
              </div>

              <form onSubmit={form.handleSubmit} encType="multipart/form-data">
                {serverError && (
                  <div className="alert alert-danger">{serverError}</div>
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
                    {...getProps("phone")}
                    label="טלפון"
                    type="text"
                    required
                  />
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
                    {...getProps("houseNumber")}
                    label="מספר בית"
                    type="number"
                    required
                  />

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
                  <Input
                    {...getProps("zip")}
                    label="מיקוד"
                    type="number"
                    required
                  />
                </div>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="btn btn-danger me-2 ms-2"
                >
                  ביטול
                </button>

                <button type="submit" className="btn btn-primary me-2 ">
                  שמור
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserEdit;
