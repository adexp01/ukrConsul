export const CRM_ORIGIN = "https://crm-urkconsul-api-production.up.railway.app";
export const NEWS_API_URL = `${CRM_ORIGIN}/api/news`;

export const getNewsApiUrl = () => NEWS_API_URL;

export const resolveAssetUrl = (path) => {
  if (!path) return "";
  if (/^https?:\/\//i.test(path)) return path;
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${CRM_ORIGIN}${normalizedPath}`;
};
