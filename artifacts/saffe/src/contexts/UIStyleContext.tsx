import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

export type UIStyle = "default" | "vercel" | "apple";

interface UIStyleContextValue {
  uiStyle: UIStyle;
  setUIStyle: (style: UIStyle) => void;
}

const UIStyleContext = createContext<UIStyleContextValue | null>(null);

const STORAGE_KEY = "saffe_ui_style";

export function UIStyleProvider({ children }: { children: ReactNode }) {
  const [uiStyle, setUIStyleState] = useState<UIStyle>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "vercel" || stored === "apple" || stored === "default") return stored;
    return "default";
  });

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("ui-vercel", "ui-apple");
    if (uiStyle === "vercel") {
      root.classList.add("ui-vercel");
      root.classList.remove("dark");
    } else if (uiStyle === "apple") {
      root.classList.add("ui-apple");
      root.classList.remove("dark");
    }
    // When reverting to default, let useSystemTheme re-apply dark if needed
    if (uiStyle === "default") {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      if (prefersDark) {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
    }
  }, [uiStyle]);

  const setUIStyle = (style: UIStyle) => {
    setUIStyleState(style);
    localStorage.setItem(STORAGE_KEY, style);
  };

  return (
    <UIStyleContext.Provider value={{ uiStyle, setUIStyle }}>
      {children}
    </UIStyleContext.Provider>
  );
}

export function useUIStyle() {
  const ctx = useContext(UIStyleContext);
  if (!ctx) throw new Error("useUIStyle must be used inside UIStyleProvider");
  return ctx;
}
