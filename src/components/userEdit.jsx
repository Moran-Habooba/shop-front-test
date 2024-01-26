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
  const handleCheckboxChange = () => {
    setIsBusiness(!isBusiness);
    setHasBusinessStatusChanged(true);
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
      // first: "",

      // last: "",
      first_name: "",
      last_name: "",
      phone: "",
      image_file: null,

      email: "",
      password: "",

      city: "",
      street: "",
      country: "",
      houseNumber: "",
      zip: "",

      url: "",
      alt: "",

      isBusiness: false,
    },
    validate: validateFormikUsingJoi({
      // first: Joi.string().min(2).max(256).required(),
      // last: Joi.string().min(2).max(256).required(),
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
      zip: Joi.number().min(2).max(256).required(),
      // url: Joi.string()
      //   .min(14)
      //   .regex(/^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/)
      //   .messages({ "string.pattern.base": "Invalid URL string." })
      //   .allow(""),
      // alt: Joi.string().min(2).max(256).allow(""),
      image_file: Joi.any().label("Image File").allow(""),
    }),

    async onSubmit(values) {
      const serverUserBody = {
        // name: {
        //   first: values.first,
        //   last: values.last,
        // },
        first: values.first,
        last: values.last,
        phone: values.phone,
        // address: {
        //   city: values.city,
        //   street: values.street,
        //   country: values.country,
        //   houseNumber: values.houseNumber,
        //   zip: values.zip,
        // },
        city: values.city,
        street: values.street,
        country: values.country,
        houseNumber: values.houseNumber,
        zip: values.zip,
        // image: {
        //   url: values.url,
        //   alt: values.alt,
        // },
      };
      try {
        const { state, ...body } = values;
        await usersService.updateUsers(user._id, serverUserBody);
        await updateUser(user._id, serverUserBody);

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
          title: "Success!",
          text: "Your details have been saved successfully.",
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
      // name: { first, last },
      first_name,
      last_name,
      phone,
      // address: { street, houseNumber, city, zip, country },
      street,
      houseNumber,
      city,
      zip,
      country,
      // image: { alt, url },
      image_file,
    } = user;

    form.setValues({
      first_name: first_name || "",
      last_name: last_name || "",
      // url: url || "",
      // alt: alt || "",
      image_file: image_file || "",
      phone: phone || "",
      city: city || "",
      country: country || "",
      zip: zip || "",
      houseNumber: houseNumber || "",
      street: street || "",
    });
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
        title="Edit details"
        description={
          <>
            Here, you can update your personal details, change your address, and
            more.
            <br />
            All changes will be automatically saved once you click 'Save'.
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
                    Edit your details <i className="bi bi-pencil"></i>
                  </h3>
                  <p>Fill in the new details:</p>
                </div>
              </div>

              <form onSubmit={form.handleSubmit}>
                {serverError && (
                  <div className="alert alert-danger">{serverError}</div>
                )}
                <div className="row">
                  <Input
                    {...getProps("first_name")}
                    label="first name"
                    type="text"
                    required
                  />

                  <Input
                    {...getProps("last_name")}
                    label="last name"
                    type="text"
                    required
                  />

                  <Input
                    {...getProps("phone")}
                    label="phone"
                    type="text"
                    required
                  />
                  {/* <Input {...getProps("state")} label="state" type="text" /> */}
                  <Input
                    {...getProps("city")}
                    label="city"
                    type="text"
                    required
                  />
                  <Input
                    {...getProps("street")}
                    label="street"
                    type="text"
                    required
                  />
                  <Input
                    {...getProps("country")}
                    label="country"
                    type="text"
                    required
                  />
                  <Input
                    {...getProps("houseNumber")}
                    label="house number"
                    type="number"
                    required
                  />
                  {/* <Input {...getProps("url")} label="image url" type="text" /> */}
                  {/* <Input {...getProps("alt")} label="image alt" type="text" /> */}
                  <div className="mb-3">
                    <label htmlFor="image_file" className="form-label">
                      Profile Image
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
                    label="zip"
                    type="number"
                    required
                  />
                </div>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="btn btn-danger me-2 ms-2"
                >
                  Cancel
                </button>

                <button type="submit" className="btn btn-primary me-2 ">
                  Save
                </button>
              </form>
              {/* <input
                type="checkbox"
                className="form-check-input me-2 mt-3"
                name="isBusiness"
                id="BusinessCheck"
                checked={isBusiness}
                onChange={handleCheckboxChange}
              /> */}
              {/* <label htmlFor="BusinessCheck" className=" mt-3 me-2 ">
                {isBusiness ? (
                  <span className="text-white ">
                    You are a Business user. Switch to regular user status?
                  </span>
                ) : (
                  <span className="text-white">
                    You are a regular user. Switch to Business user status?
                  </span>
                )}
              </label> */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserEdit;
