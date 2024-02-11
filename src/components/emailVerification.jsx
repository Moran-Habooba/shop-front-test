import React, { useState } from "react";
import { resetPassword } from "../services/usersService";

const EmailVerification = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log("Email sent to server:", email);
      const response = await resetPassword(email);
      setMessage(response.data);
    } catch (error) {
      console.error("Error resetting password:", error);
      setMessage("שגיאה בעת איפוס הסיסמה");
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h2 className="card-title mb-4">איפוס סיסמה</h2>
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="email">כתובת אימייל:</label>
                  <input
                    type="email"
                    id="email"
                    className="form-control"
                    placeholder="הזן כתובת אימייל"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary btn-block mt-4"
                >
                  שלח מייל לאימות
                </button>
              </form>
              {message && <p className="mt-3">{message}</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailVerification;
