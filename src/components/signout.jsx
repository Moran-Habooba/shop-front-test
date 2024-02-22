import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/auth.context";

import Swal from "sweetalert2";

const SignOut = ({ redirect = "/" }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogoutPop = () => {
    Swal.fire({
      html: "התנתקת בהצלחה !</strong>",
      icon: "success",
      showConfirmButton: false,
      timer: 1000,
      timerProgressBar: true,
    });
  };

  useEffect(() => {
    const performLogout = async () => {
      await logout();
      handleLogoutPop();
      setTimeout(() => navigate(redirect), 2000);
    };

    performLogout();
  }, [logout, navigate, redirect]);

  return null;
};

export default SignOut;
