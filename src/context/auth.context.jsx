// import { createContext, useContext, useState } from "react";
// import usersService from "../services/usersService";

// const fn_error_context_must_be_used = () => {
//   throw new Error("must use authContext provider ");
// };

// export const authContext = createContext({
//   user: null,
//   login: fn_error_context_must_be_used,
//   logout: fn_error_context_must_be_used,
//   signUp: fn_error_context_must_be_used,
// });
// authContext.displayName = "auth";

// export function AuthProvider({ children }) {
//   const [user, setUser] = useState(usersService.getUser());

//   const refreshUser = () => setUser(usersService.getUser());

//   const login = async (credentials) => {
//     const response = await usersService.login(credentials);

//     refreshUser();

//     return response;
//   };

//   const logout = () => {
//     usersService.logout();
//     refreshUser();
//   };
//   //------------------------
//   const updateUser = async (id, userDetails) => {
//     await usersService.updateUsers(id, userDetails);
//     refreshUser();
//   };

//   return (
//     <authContext.Provider
//       value={{
//         user,
//         login,
//         logout,
//         signUp: usersService.createUser,
//         updateUser,
//       }}
//     >
//       {children}
//     </authContext.Provider>
//   );
// }

// export const useAuth = () => useContext(authContext);

import { createContext, useContext, useState, useEffect } from "react";
import usersService from "../services/usersService";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const fn_error_context_must_be_used = () => {
  throw new Error("must use authContext provider ");
};

export const authContext = createContext({
  user: null,
  login: fn_error_context_must_be_used,
  logout: fn_error_context_must_be_used,
  signUp: fn_error_context_must_be_used,
});
authContext.displayName = "auth";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(usersService.getUser());
  const [userData, setUserData] = useState();

  const [logoutTimer, setLogoutTimer] = useState(null);

  const refreshUser = () => setUser(usersService.getUser());
  const navigate = useNavigate();

  const login = async (credentials) => {
    const response = await usersService.login(credentials);

    resetLogoutTimer();

    refreshUser();

    return response;
  };

  useEffect(() => {
    if (user) {
      const fetchUser = async () => {
        try {
          const { data } = await usersService.getUserById(user._id);
          setUserData(data);
        } catch (e) {
          console.log(e);
        }
      };
      fetchUser();
    }
  }, [user]);

  // const logout = () => {
  //   usersService.logout();
  //   setUser(null);
  //   if (logoutTimer) {
  //     clearTimeout(logoutTimer);
  //   }
  //   localStorage.removeItem("token");
  //   Swal.fire({
  //     title: "עקב אי פעילות עליך להתחבר מחדש",
  //     icon: "info",
  //     showConfirmButton: true,
  //   }).then(() => {
  //     navigate("/sign-in");
  //   });
  // };

  const logout = () => {
    const wasUserLoggedIn = !!user;
    usersService.logout();
    setUser(null);

    if (logoutTimer) {
      clearTimeout(logoutTimer);
    }

    localStorage.removeItem("token");

    if (wasUserLoggedIn) {
      Swal.fire({
        title: "עקב אי פעילות עליך להתחבר מחדש",
        icon: "info",
        showConfirmButton: true,
      }).then(() => {
        navigate("/sign-in");
      });
    }
  };

  const updateUser = async (id, userDetails) => {
    await usersService.updateUsers(id, userDetails);
    refreshUser();
  };

  const resetLogoutTimer = () => {
    if (user && logoutTimer) {
      clearTimeout(logoutTimer);
    }

    if (user) {
      const newTimer = setTimeout(() => {
        logout();
      }, 4 * 60 * 60 * 1000);

      setLogoutTimer(newTimer);
    }
  };

  useEffect(() => {
    const resetTimerOnActivity = () => {
      if (user) {
        resetLogoutTimer();
      }
    };

    if (user) {
      window.addEventListener("mousemove", resetTimerOnActivity);
      window.addEventListener("keydown", resetTimerOnActivity);
    }

    return () => {
      window.removeEventListener("mousemove", resetTimerOnActivity);
      window.removeEventListener("keydown", resetTimerOnActivity);
    };
  });

  return (
    <authContext.Provider
      value={{
        user,
        userData,
        login,
        logout,
        signUp: usersService.createUser,
        updateUser,
      }}
    >
      {children}
    </authContext.Provider>
  );
}

export const useAuth = () => useContext(authContext);
