import { useEffect } from "react";

export function useSystemTheme() {
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const applyTheme = (dark: boolean) => {
      const uiStyle = localStorage.getItem("saffe_ui_style") ?? "default";
      if (uiStyle !== "default") {
        document.documentElement.classList.remove("dark");
        return;
      }
      if (dark) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    };

    applyTheme(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      applyTheme(e.matches);
    };

    mediaQuery.addEventListener("change", handleChange);

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "saffe_ui_style") {
        applyTheme(mediaQuery.matches);
      }
    };
    window.addEventListener("storage", handleStorageChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);
}
