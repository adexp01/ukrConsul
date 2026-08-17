import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
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

  /*
   * Поточну адресу тримаємо в ref, а не в залежностях setLanguage.
   *
   * Було так: setLanguage залежав від pathname/search/hash, тому на кожному
   * переході створювався новий обʼєкт контексту — а з ним і нова функція t().
   * Це знецінювало всі useMemo, побудовані на t, у десятку компонентів
   * (новини, галерея, таби, статті) і змушувало їх пересчитуватись даремно.
   *
   * Перемикач мови від цього не страждає: він викликається з обробника кліку,
   * тобто вже після того, як ефект записав у ref свіжу адресу.
   */
  const locationRef = useRef(location);

  useEffect(() => {
    locationRef.current = location;
  }, [location]);

  const setLanguage = useCallback(
    (lang) => {
      if (lang !== "en" && lang !== "uk") return;

      localStorage.setItem(STORAGE_KEY, lang);

      const { pathname, search, hash } = locationRef.current;
      const nextUrl = `${switchLanguagePath(pathname, lang)}${search}${hash}`;

      if (nextUrl !== `${pathname}${search}${hash}`) {
        navigate(nextUrl);
      }
    },
    [navigate],
  );

  const localizePath = useCallback(
    (path) => buildLocalizedPath(path, language),
    [language],
  );

  /*
   * Поки що це єдине місце, де взагалі ставиться заголовок сторінки, тому він
   * тут і лишається. Якщо зʼявиться посторінковий SEO зі своїм title на кожен
   * маршрут — цей рядок треба буде забрати: ефект провайдера спрацьовує після
   * дитячих і перетер би щойно виставлений заголовок цією заглушкою.
   */
  useEffect(() => {
    document.documentElement.lang = language === "uk" ? "uk" : "en";
    document.documentElement.dataset.language = language;
    document.title = language === "uk" ? "Рада зброярів" : "UCDI";
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
    // setLanguage тепер стабільний (адресу читає з ref), тому обʼєкт контексту
    // перестворюється лише при справжній зміні мови.
  }, [language, localizePath, setLanguage, urlLocale]);

  return (
    <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
  );
};

/*
 * Хук лежить поряд із провайдером: контекст, провайдер і доступ до нього —
 * одне ціле, і розносити їх лише щоб вдовольнити правило про Fast Refresh,
 * сенсу мало. Наслідок — при правці саме цього файла в dev-режимі скидається
 * стан; у продакшн-збірці правило нічого не означає.
 */
// eslint-disable-next-line react-refresh/only-export-components
export const useLanguage = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return ctx;
};
