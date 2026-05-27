import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { en } from "./locales/en";
import { uk } from "./locales/uk";
import { getByPath } from "./getByPath";

const STORAGE_KEY = "ucdi-lang";

const TRANSLATIONS = { en, uk };

const getInitialLanguage = () => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === "en" || stored === "uk") return stored;
  return navigator.language.toLowerCase().startsWith("uk") ? "uk" : "en";
};

const LanguageContext = createContext(null);

export const LanguageProvider = ({ children }) => {
  const [language, setLanguageState] = useState(getInitialLanguage);

  const setLanguage = useCallback((lang) => {
    setLanguageState(lang);
    localStorage.setItem(STORAGE_KEY, lang);
  }, []);

  useEffect(() => {
    document.documentElement.lang = language === "uk" ? "uk" : "en";
    document.documentElement.dataset.language = language;
  }, [language]);

  const value = useMemo(() => {
    const dict = TRANSLATIONS[language] ?? en;
    const t = (path) => {
      const value = getByPath(dict, path);
      if (value === undefined || value === null) return path;
      return value;
    };

    return {
      language,
      setLanguage,
      t,
      dict,
    };
  }, [language, setLanguage]);

  return (
    <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return ctx;
};
