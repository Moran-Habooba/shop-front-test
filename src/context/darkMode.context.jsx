import React, { useState, createContext, useContext, useEffect } from "react";

const fn_error_context_must_be_used = () => {
  throw new Error("must use DarkModeContext provider");
};

export const DarkModeContext = createContext({
  darkMode: false,
  setDarkMode: fn_error_context_must_be_used,
});

DarkModeContext.displayName = "DarkMode";

export const useDarkMode = () => useContext(DarkModeContext);

export const DarkModeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(() => {
    const localDarkMode = localStorage.getItem("darkMode");
    return localDarkMode ? JSON.parse(localDarkMode) : false;
  });

  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  return (
    <DarkModeContext.Provider value={{ darkMode, setDarkMode }}>
      {children}
    </DarkModeContext.Provider>
  );
};
