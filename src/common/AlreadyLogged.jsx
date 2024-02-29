import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/auth.context";

const AlreadyLogged = (Component) => {
  return function useAlreadyLoggedIn(props) {
    const { user } = useAuth();
    if (user) return <Navigate to="/" />;

    return <Component {...props} />;
  };
};

export default AlreadyLogged;
