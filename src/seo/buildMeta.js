/**
 * Складання набору мета-тегів для сторінки.
 *
 * Чистий JS без залежностей — той самий код використовує і React-хук
 * `useSeo` у браузері, і `scripts/prerender-seo.mjs` під час білду.
 */

import {
  DEFAULT_LANGUAGE,
  LANGUAGES,
  LANGUAGE_TO_LOCALE,
  OG_IMAGE,
  OG_IMAGE_ALT,
  OG_IMAGE_SIZE,
  OG_LOCALE,
  PAGE_META,
  SITE_NAME,
  SITE_URL,
  TITLE_SUFFIX,
} from "./config.js";

const collapse = (value) =>
  String(value ?? "")
    .replace(/\s+/g, " ")
    .trim();

/** Обрізає опис по межі слова, щоб не було «хвоста» в сніпеті. */
export const clampDescription = (value, maxLength = 200) => {
  const text = collapse(value);
  if (text.length <= maxLength) return text;

  const cut = text.slice(0, maxLength);
  const lastSpace = cut.lastIndexOf(" ");

  return `${(lastSpace > 60 ? cut.slice(0, lastSpace) : cut).replace(/[\s,.;:—–-]+$/u, "")}…`;
};

export const localeOf = (language) =>
  LANGUAGE_TO_LOCALE[language] ?? LANGUAGE_TO_LOCALE[DEFAULT_LANGUAGE];

/** `/media` + uk → `/ua/media`; порожній шлях → `/ua`. */
export const localizedPath = (path, language) => {
  const clean = String(path ?? "").replace(/^\/+|\/+$/g, "");
  const locale = localeOf(language);
  return clean ? `/${locale}/${clean}` : `/${locale}`;
};

export const absoluteUrl = (path) => {
  if (!path) return SITE_URL;
  if (/^https?:\/\//i.test(path)) return path;
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
};

/**
 * @param {object} params
 * @param {string} params.routeKey  ключ у PAGE_META
 * @param {string} params.language  "en" | "uk"
 * @param {string} [params.path]    шлях без префікса локалі, напр. "media"
 * @param {object} [params.overrides] { title, description, image, type,
 *                                      publishedTime, noindex, alternates }
 */
export const buildPageMeta = ({
  routeKey,
  language = DEFAULT_LANGUAGE,
  path = "",
  overrides = {},
}) => {
  const lang = LANGUAGES.includes(language) ? language : DEFAULT_LANGUAGE;
  const base = PAGE_META[routeKey]?.[lang] ?? PAGE_META.home[lang];

  const rawTitle = collapse(overrides.title || base.title);
  const suffix = TITLE_SUFFIX[lang];

  // Суфікс додається, лише якщо разом із ним title лишається в межах ~60
  // символів — інакше у видачі обріжеться корисна частина заголовка.
  const appendSuffix =
    (overrides.title ? true : (base.appendSuffix ?? true)) &&
    Boolean(suffix) &&
    rawTitle.length + suffix.length + 3 <= 62;

  const title =
    appendSuffix && suffix && !rawTitle.includes(suffix)
      ? `${rawTitle} | ${suffix}`
      : rawTitle;

  const description = clampDescription(
    overrides.description || base.description,
  );

  const canonicalPath = localizedPath(path, lang);
  const image = absoluteUrl(overrides.image || OG_IMAGE[lang]);

  // hreflang: для динамічних сторінок шлях однаковий в обох локалях,
  // тому альтернативи будуються з того самого `path`.
  const alternates = overrides.alternates ?? [
    ...LANGUAGES.map((code) => ({
      hreflang: code === "uk" ? "uk" : "en",
      href: absoluteUrl(localizedPath(path, code)),
    })),
    { hreflang: "x-default", href: absoluteUrl(localizedPath(path, "en")) },
  ];

  return {
    lang,
    title,
    description,
    canonical: absoluteUrl(canonicalPath),
    image,
    imageAlt: overrides.imageAlt || OG_IMAGE_ALT[lang],
    imageWidth: overrides.image ? undefined : OG_IMAGE_SIZE.width,
    imageHeight: overrides.image ? undefined : OG_IMAGE_SIZE.height,
    siteName: SITE_NAME[lang],
    ogLocale: OG_LOCALE[lang],
    ogType: overrides.type || "website",
    publishedTime: overrides.publishedTime,
    noindex: overrides.noindex ?? base.noindex ?? false,
    alternates,
  };
};

const escapeAttr = (value) =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

/**
 * Плоский список тегів — щоб пререндер і рантайм ставили однакові атрибути.
 * Кожен запис: { tag, attrs }.
 */
export const metaTagList = (meta) => {
  const tags = [
    { tag: "meta", attrs: { name: "description", content: meta.description } },

    { tag: "meta", attrs: { property: "og:type", content: meta.ogType } },
    { tag: "meta", attrs: { property: "og:site_name", content: meta.siteName } },
    { tag: "meta", attrs: { property: "og:locale", content: meta.ogLocale } },
    { tag: "meta", attrs: { property: "og:title", content: meta.title } },
    {
      tag: "meta",
      attrs: { property: "og:description", content: meta.description },
    },
    { tag: "meta", attrs: { property: "og:url", content: meta.canonical } },
    { tag: "meta", attrs: { property: "og:image", content: meta.image } },
    {
      tag: "meta",
      attrs: { property: "og:image:alt", content: meta.imageAlt },
    },

    { tag: "meta", attrs: { name: "twitter:card", content: "summary_large_image" } },
    { tag: "meta", attrs: { name: "twitter:title", content: meta.title } },
    {
      tag: "meta",
      attrs: { name: "twitter:description", content: meta.description },
    },
    { tag: "meta", attrs: { name: "twitter:image", content: meta.image } },
  ];

  if (meta.imageWidth && meta.imageHeight) {
    tags.push(
      {
        tag: "meta",
        attrs: { property: "og:image:width", content: String(meta.imageWidth) },
      },
      {
        tag: "meta",
        attrs: {
          property: "og:image:height",
          content: String(meta.imageHeight),
        },
      },
      { tag: "meta", attrs: { property: "og:image:type", content: "image/png" } },
    );
  }

  if (meta.publishedTime) {
    tags.push({
      tag: "meta",
      attrs: {
        property: "article:published_time",
        content: meta.publishedTime,
      },
    });
  }

  if (meta.noindex) {
    // 404 та ненайдені статті не мають ані canonical, ані hreflang —
    // інакше пошуковик схилятиметься вважати їх повноцінними сторінками.
    tags.push({
      tag: "meta",
      attrs: { name: "robots", content: "noindex, follow" },
    });
  } else {
    tags.unshift({
      tag: "link",
      attrs: { rel: "canonical", href: meta.canonical },
    });

    meta.alternates.forEach(({ hreflang, href }) => {
      tags.push({
        tag: "link",
        attrs: { rel: "alternate", hreflang, href },
      });
    });
  }

  return tags;
};

/** HTML-рядок для вставки в <head> під час пререндеру. */
export const renderMetaTags = (meta, indent = "    ") => {
  const lines = [`${indent}<title>${escapeAttr(meta.title)}</title>`];

  metaTagList(meta).forEach(({ tag, attrs }) => {
    const attrString = Object.entries(attrs)
      .map(([key, value]) => `${key}="${escapeAttr(value)}"`)
      .join(" ");
    lines.push(`${indent}<${tag} ${attrString} />`);
  });

  return lines.join("\n");
};
