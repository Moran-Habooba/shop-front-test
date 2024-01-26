import React from "react";
import { useNavigate } from "react-router-dom";
import "../components/styls/pageNotFound.css";

const PageNotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="page-not-found">
      <img
        src="https://sitechecker.pro/wp-content/uploads/2023/06/404-status-code.png"
        alt="404 Not Found"
      />
      <button onClick={() => navigate("/")} className="btn-success">
        Back to Home
      </button>
    </div>
  );
};

export default PageNotFound;
