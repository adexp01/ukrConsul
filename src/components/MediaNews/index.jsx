import { useMemo, useState } from "react";
import { Article } from "../UI/Article";
import { useLanguage } from "../../i18n/LanguageContext";
import "./style.css";
import { Button } from "../UI/Button";
import { mapNewsToCard } from "../../api/news";
import { useNews } from "../../hooks/useNews";

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

const INITIAL_VISIBLE = 6;
const LOAD_STEP = 3;

export const MediaNews = () => {
  const { t, language } = useLanguage();
  const { news, loading } = useNews();
  const [activeFilter, setActiveFilter] = useState("all");
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE);

  const cards = useMemo(
    () => news.map((item) => mapNewsToCard(item, { t, language })),
    [news, t, language],
  );

  const filters = useMemo(() => {
    const labels = t("mediaNews.filters");
    return FILTER_IDS.map((id) => ({ id, label: labels[id] }));
  }, [t, language]);

  const filteredNews = useMemo(() => {
    if (activeFilter === "all") return cards;
    return cards.filter((item) => item.category === activeFilter);
  }, [activeFilter, cards]);

  const visibleNews = filteredNews.slice(0, visibleCount);
  const canLoadMore = visibleCount < filteredNews.length;

  const handleFilterChange = (filterId) => {
    setActiveFilter(filterId);
    setVisibleCount(INITIAL_VISIBLE);
  };

  // Поки жодної статті немає — секцію «Новини» не показуємо взагалі
  if (!loading && cards.length === 0) return null;

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
          {!loading && visibleNews.length === 0 ? (
            <p className="media-news__empty">{t("mediaNews.empty")}</p>
          ) : (
            visibleNews.map((item, index) => (
              <Article
                key={item.id}
                id={item.id}
                variant={(index % 3) + 1}
                tag={item.tag}
                dateLabel={item.dateLabel}
                isoDate={item.isoDate}
                title={item.title}
                excerpt={item.excerpt}
                href={`/article/${item.id}`}
              />
            ))
          )}
        </div>

        {canLoadMore && visibleNews.length > 0 ? (
          <div className="media-news__footer">
            <Button
              variant="default"
              onClick={() =>
                setVisibleCount((count) =>
                  Math.min(count + LOAD_STEP, filteredNews.length),
                )
              }
            >
              {t("mediaNews.loadMore")}
            </Button>
          </div>
        ) : null}
      </div>
    </section>
  );
};
