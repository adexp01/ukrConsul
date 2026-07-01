import { useEffect, useState } from "react";
import { fetchNews } from "../api/news";

let cachedNews = null;
let fetchPromise = null;

const loadNews = () => {
  if (cachedNews) return Promise.resolve(cachedNews);

  if (!fetchPromise) {
    fetchPromise = fetchNews()
      .then((data) => {
        cachedNews = data;
        return data;
      })
      .catch((error) => {
        fetchPromise = null;
        throw error;
      });
  }

  return fetchPromise;
};

export const useNews = () => {
  const [news, setNews] = useState(cachedNews ?? []);
  const [loading, setLoading] = useState(!cachedNews);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    loadNews()
      .then((data) => {
        if (!cancelled) {
          setNews(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err);
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { news, loading, error };
};
