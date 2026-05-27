export const getByPath = (obj, path) => {
  if (!obj || !path) return undefined;
  return path.split(".").reduce((acc, key) => acc?.[key], obj);
};
