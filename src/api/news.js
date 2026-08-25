import { getNewsApiUrl, resolveAssetUrl } from "./config";
import { LOCAL_NEWS } from "../data/localNews";
import { assignUniqueSlugs } from "./slug";
import { resolveArticleTags, resolveArticleTitle } from "../data/articleMeta";

export const resolveNewsAssetUrl = resolveAssetUrl;

const byNewestFirst = (a, b) =>
  new Date(b.createdAt ?? 0) - new Date(a.createdAt ?? 0);

const isPublished = (item) => item.published !== false;

/**
 * Скільки чекаємо на CRM, перш ніж показати те, що є.
 *
 * Без обмеження запит на повільній мережі висить нескінченно, а сторінка весь
 * цей час тримає стан «завантаження» — і людина дивиться на порожній блок
 * новин замість тих статей, які лежать у коді й доступні одразу.
 */
const NEWS_TIMEOUT_MS = 8000;

const fetchCrmNews = async () => {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), NEWS_TIMEOUT_MS);

  let response;
  try {
    response = await fetch(getNewsApiUrl(), { signal: controller.signal });
  } finally {
    clearTimeout(timeout);
  }

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
    console.error(
      "[news] CRM недоступна, показуємо лише локальні статті",
      error,
    );
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
 *
 * Тут же підміняється заголовок для тих релізів, у яких у CRM лишилась стара
 * назва (див. TITLE_OVERRIDES у articleMeta). Місце вибрано одне на всіх:
 * через цю функцію проходять і картки стрічки, і сама стаття, і мета-теги.
 */
export const localizeNewsItem = (item, language) => {
  const translation = item?.i18n?.[language];
  const localized = translation ? { ...item, ...translation } : item;

  const title = resolveArticleTitle(localized);
  if (title === localized?.title) return localized;

  return { ...localized, title };
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

/**
 * Прибирає markdown-акценти з тексту.
 *
 * У картках і тизерах немає місця для розмітки, тому `**жирний**`
 * і `[текст](url)` там мають виглядати просто як текст.
 */
export const stripInlineMarkup = (value) =>
  String(value ?? "")
    .replace(/\[([^\]]+)\]\(https?:\/\/[^\s)]*\)/g, "$1")
    .replace(/\*{1,3}/g, "")
    .replace(/\s+/g, " ")
    .trim();

export const getNewsExcerpt = (item, maxLength = 160) => {
  const textBlock = item.blocks?.find(
    (block) => block.type === "text" && stripInlineMarkup(block.content),
  );
  const text = stripInlineMarkup(textBlock?.content);

  if (!text) return "";
  if (text.length <= maxLength) return text;

  return `${text.slice(0, maxLength).trimEnd()}…`;
};

export const mapNewsToCard = (item, { t, language }) => {
  const filters = t("ourNews.filters");

  const slug = item.slug ?? item.id;
  /*
   * Тегів може бути кілька: клієнт розставляє по два-три на реліз, а в CRM
   * поле одне. На картці показуємо перший — місця там на один, — але фільтр
   * стрічки перебирає весь масив.
   */
  const tags = resolveArticleTags({ ...item, slug });

  return {
    id: item.id,
    slug,
    href: `/article/${slug}`,
    category: item.category,
    tags,
    tag: getCategoryLabel(tags[0], filters),
    isoDate: item.createdAt?.slice(0, 10) ?? "",
    dateLabel: formatNewsDate(item.createdAt, language),
    title: item.title,
    description: getNewsExcerpt(item),
    excerpt: getNewsExcerpt(item),
  };
};
