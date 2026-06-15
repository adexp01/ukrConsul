import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { en } from "./locales/en";
import { uk } from "./locales/uk";
import { getByPath } from "./getByPath";
import {
  DEFAULT_LANGUAGE,
  getLanguageFromLocale,
  getLocaleFromLanguage,
  getLocaleFromPathname,
  localizePath as buildLocalizedPath,
  switchLanguagePath,
} from "./localeRoutes";

const STORAGE_KEY = "ucdi-lang";

const TRANSLATIONS = { en, uk };

const LanguageContext = createContext(null);

export const LanguageProvider = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const urlLocale = getLocaleFromPathname(location.pathname);
  const language = urlLocale
    ? getLanguageFromLocale(urlLocale)
    : DEFAULT_LANGUAGE;

  const setLanguage = useCallback(
    (lang) => {
      if (lang !== "en" && lang !== "uk") return;

      localStorage.setItem(STORAGE_KEY, lang);
      const nextPath = switchLanguagePath(location.pathname, lang);
      const nextUrl = `${nextPath}${location.search}${location.hash}`;

      if (nextUrl !== `${location.pathname}${location.search}${location.hash}`) {
        navigate(nextUrl);
      }
    },
    [location.hash, location.pathname, location.search, navigate],
  );

  const localizePath = useCallback(
    (path) => buildLocalizedPath(path, language),
    [language],
  );

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
      locale: urlLocale ?? getLocaleFromLanguage(language),
      setLanguage,
      localizePath,
      t,
      dict,
    };
  }, [language, localizePath, urlLocale]);

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
