"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { translations, Language } from "@/lib/translations";

type TranslationsKey = keyof typeof translations.en;

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationsKey) => string;
  dir: "ltr" | "rtl";
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");

  // Load saved language on mount
  useEffect(() => {
    const saved = localStorage.getItem("language") as Language;
    if (saved && ["en", "fr", "ar"].includes(saved)) {
      setLanguageState(saved);
    } else {
      // Auto-detect based on browser if needed
      const browserLang = navigator.language.split('-')[0];
      if (browserLang === 'fr') setLanguageState('fr');
      else if (browserLang === 'ar') setLanguageState('ar');
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("language", lang);
  };

  const t = (key: TranslationsKey): string => {
    return translations[language][key] || translations.en[key] || key;
  };

  const dir = language === "ar" ? "rtl" : "ltr";

  // Update document direction and language class for html when language changes
  useEffect(() => {
    document.documentElement.dir = dir;
    document.documentElement.lang = language;
  }, [language, dir]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, dir }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
