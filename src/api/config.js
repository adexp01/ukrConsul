export const CRM_ORIGIN = "https://crm-ukr-consul.vercel.app";
export const NEWS_API_URL = `${CRM_ORIGIN}/api/news`;

export const getNewsApiUrl = () => NEWS_API_URL;

export const resolveAssetUrl = (path) => {
  if (!path) return "";
  if (/^https?:\/\//i.test(path)) return path;
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${CRM_ORIGIN}${normalizedPath}`;
};
