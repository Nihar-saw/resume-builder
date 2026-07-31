import { createContext, useState, useEffect, useContext } from "react";

export const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  // Hardcoded to light mode as per user request
  const theme = "light";

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("dark");
  }, []);

  const toggleTheme = () => {
    // Disabled
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, isDark: false }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
