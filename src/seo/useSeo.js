import { useEffect } from "react";
import { useLanguage } from "../i18n/LanguageContext";
import { buildPageMeta, metaTagList } from "./buildMeta";

/**
 * Селектори тегів, якими керує SEO-шар. Перед вставкою нових усі старі
 * видаляються — інакше після SPA-навігації в <head> лишалися б теги
 * попередньої сторінки або дублікати того, що поклав пререндер.
 */
const MANAGED_SELECTORS = [
  'meta[name="description"]',
  'meta[name="robots"]',
  'meta[name^="twitter:"]',
  'meta[property^="og:"]',
  'meta[property^="article:"]',
  'link[rel="canonical"]',
  "link[rel='alternate'][hreflang]",
].join(", ");

const applyMeta = (meta) => {
  document.title = meta.title;
  document.documentElement.lang = meta.lang === "uk" ? "uk" : "en";

  document
    .querySelectorAll(MANAGED_SELECTORS)
    .forEach((node) => node.remove());

  const fragment = document.createDocumentFragment();

  metaTagList(meta).forEach(({ tag, attrs }) => {
    const node = document.createElement(tag);
    Object.entries(attrs).forEach(([key, value]) => {
      node.setAttribute(key, String(value));
    });
    node.setAttribute("data-seo", "");
    fragment.appendChild(node);
  });

  document.head.appendChild(fragment);
};

/**
 * Проставляє title, description, Open Graph, canonical і hreflang.
 *
 * @param {string} routeKey ключ у PAGE_META (`home`, `media`, `article`, …)
 * @param {object} [options]
 * @param {string} [options.path] шлях без префікса локалі, напр. `"media"`
 *                 або `"article/some-slug"`. За замовчуванням — головна.
 * @param {object} [options.overrides] title / description / image / type /
 *                 publishedTime / noindex — для сторінок із CRM-контентом.
 */
export const useSeo = (routeKey, options = {}) => {
  const { language } = useLanguage();
  const { path = "", overrides = {} } = options;

  const {
    title,
    description,
    image,
    type,
    publishedTime,
    noindex,
    imageAlt,
  } = overrides;

  useEffect(() => {
    applyMeta(
      buildPageMeta({
        routeKey,
        language,
        path,
        overrides: {
          title,
          description,
          image,
          imageAlt,
          type,
          publishedTime,
          noindex,
        },
      }),
    );
    // Кожне поле окремо в залежностях: об'єкт overrides створюється заново
    // на кожен рендер і сам по собі спричиняв би нескінченний цикл.
  }, [
    routeKey,
    language,
    path,
    title,
    description,
    image,
    imageAlt,
    type,
    publishedTime,
    noindex,
  ]);
};
