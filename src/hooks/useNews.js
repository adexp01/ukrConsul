import { useEffect, useMemo, useState } from "react";
import { fetchNews, localizeNewsItem } from "../api/news";
import { useLanguage } from "../i18n/LanguageContext";

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
  const { language } = useLanguage();
  // У кеші лежать «сирі» записи з усіма мовами; переклад накладається нижче,
  // тому перемикання мови не тягне повторний запит.
  const [rawNews, setRawNews] = useState(cachedNews ?? []);
  const [loading, setLoading] = useState(!cachedNews);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    loadNews()
      .then((data) => {
        if (!cancelled) {
          setRawNews(data);
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

  // allNews — усе, що є; news — лише те, що доречно показувати на цій локалі.
  // Записи без поля lang (створені до його появи або вручну в адмінці)
  // показуються на обох мовах, щоб нічого не зникло непомітно.
  const allNews = useMemo(
    () => rawNews.map((item) => localizeNewsItem(item, language)),
    [rawNews, language],
  );

  const news = useMemo(
    () => allNews.filter((item) => !item.lang || item.lang === language),
    [allNews, language],
  );

  return { news, allNews, loading, error };
};
