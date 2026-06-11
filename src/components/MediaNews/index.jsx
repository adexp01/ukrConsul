import { useMemo, useState } from "react";
import { Article } from "../UI/Article";
import { useLanguage } from "../../i18n/LanguageContext";
import "./style.css";
import { Button } from "../UI/Button";
import { ButtonTest } from "../UI/ButtonTest";

const FILTER_IDS = [
  "all",
  "gr",
  "export",
  "international",
  "buildwithukraine",
  "zbroyaexpo",
  "investments",
  "analytics",
  "events",
];

const NEWS_LAYOUT = [
  {
    id: 1,
    category: "export",
    date: "2026-03-12",
    contentIndex: 0,
  },
  {
    id: 2,
    category: "international",
    date: "2026-04-04",
    contentIndex: 1,
  },
  { id: 3, category: "gr", date: "2026-04-30", contentIndex: 2 },
  {
    id: 4,
    category: "export",
    date: "2026-03-12",
    contentIndex: 0,
  },
  {
    id: 5,
    category: "international",
    date: "2026-04-04",
    contentIndex: 1,
  },
  { id: 6, category: "gr", date: "2026-04-30", contentIndex: 2 },
  {
    id: 7,
    category: "export",
    date: "2026-03-12",
    contentIndex: 0,
  },
  {
    id: 8,
    category: "international",
    date: "2026-04-04",
    contentIndex: 1,
  },
  { id: 9, category: "gr", date: "2026-04-30", contentIndex: 2 },
  {
    id: 10,
    category: "export",
    date: "2026-03-12",
    contentIndex: 0,
  },
  {
    id: 11,
    category: "international",
    date: "2026-04-04",
    bg: "#dde6ed",
    contentIndex: 1,
  },
  {
    id: 12,
    category: "gr",
    date: "2026-04-30",
    contentIndex: 2,
  },
];

const INITIAL_VISIBLE = 6;
const LOAD_STEP = 3;

export const MediaNews = () => {
  const { t, language } = useLanguage();
  const [activeFilter, setActiveFilter] = useState("all");
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE);

  const news = useMemo(() => {
    const items = t("mediaNews.items");
    return NEWS_LAYOUT.map((meta) => ({
      ...meta,
      ...items[meta.contentIndex],
    }));
  }, [t, language]);

  const filters = useMemo(() => {
    const labels = t("mediaNews.filters");
    return FILTER_IDS.map((id) => ({ id, label: labels[id] }));
  }, [t, language]);

  const filteredNews = useMemo(() => {
    if (activeFilter === "all") return news;
    return news.filter((item) => item.category === activeFilter);
  }, [activeFilter, news]);

  const visibleNews = filteredNews.slice(0, visibleCount);
  const canLoadMore = visibleCount < filteredNews.length;

  const handleFilterChange = (filterId) => {
    setActiveFilter(filterId);
    setVisibleCount(INITIAL_VISIBLE);
  };

  return (
    <section className="media-news" aria-labelledby="media-news-title">
      <div className="media-news__glow" aria-hidden="true" />

      <div className="media-news__inner">
        <header className="media-news__header">
          <h2 id="media-news-title" className="media-news__title">
            {t("mediaNews.title")}
          </h2>
        </header>

        <div
          className="media-news__filters"
          role="tablist"
          aria-label={t("mediaNews.categoriesAria")}
        >
          {filters.map((filter) => {
            const isActive = activeFilter === filter.id;

            return (
              <button
                key={filter.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                className={`media-news__filter${isActive ? " media-news__filter--active" : ""}`}
                onClick={() => handleFilterChange(filter.id)}
              >
                {filter.label}
              </button>
            );
          })}
        </div>

        <div className="media-news__grid" role="tabpanel">
          {visibleNews.length === 0 ? (
            <p className="media-news__empty">{t("mediaNews.empty")}</p>
          ) : (
            visibleNews.map((item) => (
              <Article
                key={item.id}
                id={item.id}
                tag={item.tag}
                date={item.dateLabel}
                title={item.title}
                excerpt={item.excerpt}
                href={`/article/${item.id}`}
              />
            ))
          )}
        </div>

        {canLoadMore && visibleNews.length > 0 ? (
          <div className="media-news__footer">
            <ButtonTest
              variant="default"
              onClick={() =>
                setVisibleCount((count) =>
                  Math.min(count + LOAD_STEP, filteredNews.length),
                )
              }
            >
              {t("mediaNews.loadMore")}
            </ButtonTest>
          </div>
        ) : null}
      </div>
    </section>
  );
};
