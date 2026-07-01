import { getNewsApiUrl, resolveAssetUrl } from "./config";

export const resolveNewsAssetUrl = resolveAssetUrl;

export const fetchNews = async () => {
  const response = await fetch(getNewsApiUrl());

  if (!response.ok) {
    throw new Error(`News request failed: ${response.status}`);
  }

  const payload = await response.json();
  const items = Array.isArray(payload)
    ? payload
    : (payload?.data ?? payload?.news ?? []);

  return items
    .filter((item) => item.published !== false)
    .sort(
      (a, b) => new Date(b.createdAt ?? 0) - new Date(a.createdAt ?? 0),
    );
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

  return {
    id: item.id,
    category: item.category,
    tag: getCategoryLabel(item.category, filters),
    isoDate: item.createdAt?.slice(0, 10) ?? "",
    dateLabel: formatNewsDate(item.createdAt, language),
    title: item.title,
    description: getNewsExcerpt(item),
    excerpt: getNewsExcerpt(item),
  };
};
