import { getNewsApiUrl, resolveAssetUrl } from "./config";
import { LOCAL_NEWS } from "../data/localNews";
import { assignUniqueSlugs } from "./slug";

export const resolveNewsAssetUrl = resolveAssetUrl;

const byNewestFirst = (a, b) =>
  new Date(b.createdAt ?? 0) - new Date(a.createdAt ?? 0);

const isPublished = (item) => item.published !== false;

const fetchCrmNews = async () => {
  const response = await fetch(getNewsApiUrl());

  if (!response.ok) {
    throw new Error(`News request failed: ${response.status}`);
  }

  const payload = await response.json();

  return Array.isArray(payload)
    ? payload
    : (payload?.data ?? payload?.news ?? []);
};

export const fetchNews = async () => {
  // Статті з коду (src/data/localNews.js) показуються завжди —
  // навіть якщо CRM недоступна.
  const local = LOCAL_NEWS.filter(isPublished);

  let remote = [];
  try {
    remote = (await fetchCrmNews()).filter(isPublished);
  } catch (error) {
    console.error("[news] CRM недоступна, показуємо лише локальні статті", error);
  }

  const localIds = new Set(local.map((item) => String(item.id)));
  const merged = [
    ...local,
    ...remote.filter((item) => !localIds.has(String(item.id))),
  ];

  // CRM віддає лише UUID — слаги збираємо тут, до того як дані підуть у компоненти
  return assignUniqueSlugs(merged.sort(byNewestFirst));
};

/**
 * Накладає переклад на запис новини.
 *
 * Базові поля (title / blocks / mainImage) — українською, як їх віддає CRM.
 * Якщо в записі є `i18n[language]`, його поля перекривають базові.
 * Немає перекладу для мови — повертається оригінал.
 */
export const localizeNewsItem = (item, language) => {
  const translation = item?.i18n?.[language];
  if (!translation) return item;

  return { ...item, ...translation };
};

export const formatNewsDate = (isoDate, language) => {
  if (!isoDate) return "";

  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return "";

  const locale = language === "uk" ? "uk-UA" : "en-GB";
  return new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
};

export const getCategoryLabel = (category, filters = {}) =>
  filters[category] ?? category ?? "";

export const getNewsExcerpt = (item, maxLength = 160) => {
  const textBlock = item.blocks?.find((block) => block.type === "text");
  const text = textBlock?.content?.trim() ?? "";

  if (!text) return "";
  if (text.length <= maxLength) return text;

  return `${text.slice(0, maxLength).trimEnd()}…`;
};

export const mapNewsToCard = (item, { t, language }) => {
  const filters = t("ourNews.filters");

  const slug = item.slug ?? item.id;

  return {
    id: item.id,
    slug,
    href: `/article/${slug}`,
    category: item.category,
    tag: getCategoryLabel(item.category, filters),
    isoDate: item.createdAt?.slice(0, 10) ?? "",
    dateLabel: formatNewsDate(item.createdAt, language),
    title: item.title,
    description: getNewsExcerpt(item),
    excerpt: getNewsExcerpt(item),
  };
};
