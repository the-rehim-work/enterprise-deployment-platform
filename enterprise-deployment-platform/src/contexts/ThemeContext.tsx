"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Theme = "dark" | "light";

type ThemeContextType = {
 theme: Theme;
 toggle: () => void;
};

const ThemeContext = createContext<ThemeContextType>(null!);

function getInitialTheme(): Theme {
 if (typeof window === "undefined") return "dark";
 return (localStorage.getItem("theme") as Theme) || "dark";
}

export function ThemeProvider({ children }: { children: ReactNode }) {
 const [theme, setTheme] = useState<Theme>(getInitialTheme);

 useEffect(() => {
  const root = document.documentElement;
  root.classList.remove("light", "dark");
  root.classList.add(theme);
  localStorage.setItem("theme", theme);
 }, [theme]);

 function toggle() {
  setTheme((t) => (t === "dark" ? "light" : "dark"));
 }

 return (
  <ThemeContext.Provider value={{ theme, toggle }}>
   {children}
  </ThemeContext.Provider>
 );
}

export const useTheme = () => useContext(ThemeContext);