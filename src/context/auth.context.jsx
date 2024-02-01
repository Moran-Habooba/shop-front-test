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
  const [logoutTimer, setLogoutTimer] = useState(null); // Initialize the timer variable

  const refreshUser = () => setUser(usersService.getUser());

  const login = async (credentials) => {
    const response = await usersService.login(credentials);

    // Reset the timer on user activity
    resetLogoutTimer();

    refreshUser();

    return response;
  };

  const logout = () => {
    usersService.logout();
    refreshUser();
  };

  const updateUser = async (id, userDetails) => {
    await usersService.updateUsers(id, userDetails);
    refreshUser();
  };

  // Function to reset the logout timer
  const resetLogoutTimer = () => {
    if (logoutTimer) {
      clearTimeout(logoutTimer); // Clear the existing timer
    }

    // Set a new timer for 4 hours (4 * 60 * 60 * 1000 milliseconds)
    const newTimer = setTimeout(() => {
      logout(); // Call logout function after 4 hours of inactivity
    }, 4 * 60 * 60 * 1000);

    setLogoutTimer(newTimer); // Update the timer variable
  };

  // Set up event listeners to reset the timer on user activity
  useEffect(() => {
    const resetTimerOnActivity = () => {
      resetLogoutTimer(); // Reset the timer on user activity
    };

    // Attach event listeners for user activity (you can add more events as needed)
    window.addEventListener("mousemove", resetTimerOnActivity);
    window.addEventListener("keydown", resetTimerOnActivity);

    // Clean up the event listeners when the component unmounts
    return () => {
      window.removeEventListener("mousemove", resetTimerOnActivity);
      window.removeEventListener("keydown", resetTimerOnActivity);
    };
  }, []);

  return (
    <authContext.Provider
      value={{
        user,
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
