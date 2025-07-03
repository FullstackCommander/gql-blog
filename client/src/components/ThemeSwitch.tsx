import { useEffect, useState } from "react";

export default function ThemeSwitch() {
  const [theme, setTheme] = useState<string>(() => localStorage.getItem("theme") || "nord");

  useEffect(() => {
    document.documentElement.className = theme;
    localStorage.setItem("theme", theme);
    // set data-theme attribute for Tailwind CSS
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === "nord" ? "dracula" : "nord"));
  };

  return (
    <button onClick={toggleTheme} className="btn">
      Switch to {theme === "nord" ? "🌖" : "☀️"}
    </button>
  );
}