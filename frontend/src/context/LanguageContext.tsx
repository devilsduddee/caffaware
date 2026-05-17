"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { id } from "@/locales/id";
import { en } from "@/locales/en";

type Language = "id" | "en";
type Translations = typeof id;

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>("id");

  useEffect(() => {
    // Client-side initialization
    const storedLang = localStorage.getItem("caffaware_language") as Language | null;
    if (storedLang && (storedLang === "id" || storedLang === "en")) {
      setLanguageState(storedLang);
    } else {
      // Check browser language preference as fallback, but default to id per product direction
      const browserLang = navigator.language.startsWith("en") ? "en" : "id";
      setLanguageState(browserLang);
      localStorage.setItem("caffaware_language", browserLang);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== "undefined") {
      localStorage.setItem("caffaware_language", lang);
    }
  };

  const t = language === "id" ? id : en;

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    // Return default fallback if used outside provider (prevents crashes during SSR/testing)
    return {
      language: "id",
      setLanguage: () => {},
      t: id,
    };
  }
  return context;
};
