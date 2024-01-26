import { createContext, useContext, useState } from "react";
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

  const refreshUser = () => setUser(usersService.getUser());

  const login = async (credentials) => {
    const response = await usersService.login(credentials);

    refreshUser();

    return response;
  };

  const logout = () => {
    usersService.logout();
    refreshUser();
  };
  //------------------------
  const updateUser = async (id, userDetails) => {
    await usersService.updateUsers(id, userDetails);
    refreshUser();
  };

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
