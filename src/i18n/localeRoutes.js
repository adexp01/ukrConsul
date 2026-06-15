export const DEFAULT_LANGUAGE = "en";

export const LANGUAGE_TO_LOCALE = {
  en: "en",
  uk: "ua",
};

export const LOCALE_TO_LANGUAGE = {
  en: "en",
  ua: "uk",
};

export const SUPPORTED_LOCALES = Object.keys(LOCALE_TO_LANGUAGE);

export const getLocaleFromLanguage = (language) =>
  LANGUAGE_TO_LOCALE[language] ?? LANGUAGE_TO_LOCALE[DEFAULT_LANGUAGE];

export const getLanguageFromLocale = (locale) =>
  LOCALE_TO_LANGUAGE[locale] ?? DEFAULT_LANGUAGE;

export const stripLocalePrefix = (pathname) => {
  const segments = pathname.split("/").filter(Boolean);

  if (segments.length > 0 && SUPPORTED_LOCALES.includes(segments[0])) {
    const rest = segments.slice(1).join("/");
    return rest ? `/${rest}` : "/";
  }

  return pathname || "/";
};

export const getLocaleFromPathname = (pathname) => {
  const locale = pathname.split("/").filter(Boolean)[0];
  return SUPPORTED_LOCALES.includes(locale) ? locale : null;
};

export const localizePath = (path, language) => {
  if (
    !path ||
    path.startsWith("#") ||
    /^https?:\/\//i.test(path) ||
    path.startsWith("mailto:") ||
    path.startsWith("tel:")
  ) {
    return path;
  }

  const locale = getLocaleFromLanguage(language);
  const normalized = path.startsWith("/") ? path : `/${path}`;
  const pathWithoutLocale = stripLocalePrefix(normalized);

  if (pathWithoutLocale === "/") {
    return `/${locale}`;
  }

  return `/${locale}${pathWithoutLocale}`;
};

export const switchLanguagePath = (pathname, language) =>
  localizePath(stripLocalePrefix(pathname), language);
