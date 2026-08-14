import { useMemo, useState } from "react";
import { Article } from "../UI/Article";
import { Button } from "../UI/Button";
import { mapNewsToCard } from "../../api/news";
import { useNews } from "../../hooks/useNews";
import { useLanguage } from "../../i18n/LanguageContext";
import "./style.css";

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

export const OurNews = () => {
  const { t, language, localizePath } = useLanguage();
  const { news, loading } = useNews();
  const [activeFilter, setActiveFilter] = useState("all");

  const cards = useMemo(
    () => news.map((item) => mapNewsToCard(item, { t, language })),
    [news, t, language],
  );

  const filters = useMemo(() => {
    const labels = t("ourNews.filters");
    return FILTER_IDS.map((id) => ({ id, label: labels[id] }));
  }, [t, language]);

  const visibleNews = useMemo(() => {
    if (activeFilter === "all") return cards;
    return cards.filter((item) => item.category === activeFilter);
  }, [activeFilter, cards]);

  return (
    <section className="our-news" aria-labelledby="our-news-title">
      <div className="our-news__inner">
        <header className="our-news__header">
          <h2 id="our-news-title" className="our-news__title">
            {t("ourNews.title")}
          </h2>

          <Button href={localizePath("/media")} variant="default" className="our-news__all-link">
            {t("ourNews.allNews")}
          </Button>
        </header>

        <div
          className="our-news__filters"
          role="tablist"
          aria-label={t("ourNews.categoriesAria")}
        >
          {filters.map((filter) => {
            const isActive = activeFilter === filter.id;

            return (
              <button
                key={filter.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                className={`our-news__filter${isActive ? " our-news__filter--active" : ""}`}
                onClick={() => setActiveFilter(filter.id)}
              >
                {filter.label}
              </button>
            );
          })}
        </div>

        <div className="our-news__grid" role="tabpanel">
          {!loading && visibleNews.length === 0 ? (
            <p className="our-news__empty">{t("ourNews.empty")}</p>
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
                href={item.href}
              />
            ))
          )}
        </div>
      </div>
    </section>
  );
};
