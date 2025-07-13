import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [isLight, setIsLight] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const isLightTheme = savedTheme === "light";
    setIsLight(isLightTheme);
    document.documentElement.classList.toggle("light", isLightTheme);
    document.documentElement.classList.toggle("dark", !isLightTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = !isLight;
    setIsLight(newTheme);
    document.documentElement.classList.toggle("light", newTheme);
    document.documentElement.classList.toggle("dark", !newTheme);
    localStorage.setItem("theme", newTheme ? "light" : "dark");
  };

  return (
    <label className="theme-switch">
      <input
        type="checkbox"
        checked={isLight}
        onChange={toggleTheme}
        className="hidden"
      />
      <span className="slider"></span>
    </label>
  );
}
