import { createContext, useContext, useEffect, useMemo } from "react";
import useLocalStorage from "../hooks/useLocalStorage";

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useLocalStorage("school_stock_theme", {
    mode: "light",
  });

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", theme.mode === "dark");
  }, [theme.mode]);

  const toggleTheme = () => {
    setTheme((prev) => ({
      ...prev,
      mode: prev.mode === "dark" ? "light" : "dark",
    }));
  };

  const value = useMemo(() => ({
    themeMode: theme.mode,
    setTheme,
    toggleTheme,
  }), [theme.mode]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}
