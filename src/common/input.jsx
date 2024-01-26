import React from "react";

const Input = ({ label, error, ...rest }) => {
  return (
    <div className="col-md-6 mb-3">
      <label htmlFor={rest.name} className="form-label">
        {label}
        {rest.required && <span className="text-danger ms-1">*</span>}
      </label>
      <input
        {...rest}
        id={rest.name}
        className={["form-control", error && "is-invalid"]
          .filter(Boolean)
          .join(" ")}
      />
      <div className="invalid-feedback">{error}</div>
    </div>
  );
};

export default Input;
