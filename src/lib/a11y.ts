import { useEffect, useState } from "react";

const SIZE_KEY = "a11y.textSize";
const THEME_KEY = "a11y.theme";

export type Theme = "light" | "dark";

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  const v = window.localStorage.getItem(key);
  return (v as unknown as T) ?? fallback;
}

export function useA11ySettings() {
  const [textSize, setTextSize] = useState<number>(() => {
    const v = read<string>(SIZE_KEY, "100");
    const n = Number(v);
    return Number.isFinite(n) ? n : 100;
  });
  const [theme, setTheme] = useState<Theme>(() => (read<Theme>(THEME_KEY, "light") === "dark" ? "dark" : "light"));

  useEffect(() => {
    document.documentElement.style.fontSize = `${textSize}%`;
    window.localStorage.setItem(SIZE_KEY, String(textSize));
  }, [textSize]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem(THEME_KEY, theme);
  }, [theme]);

  return { textSize, setTextSize, theme, setTheme };
}
