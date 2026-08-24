import { useMemo, useState } from "react";
import { Article } from "../UI/Article";
import { useLanguage } from "../../i18n/LanguageContext";
import "./style.css";
import { Button } from "../UI/Button";
import { mapNewsToCard } from "../../api/news";
import { useNews } from "../../hooks/useNews";

/* Порядок такий самий, як у переліку тегів від клієнта */
const FILTER_IDS = [
  "all",
  "gr",
  "export",
  "international",
  "investments",
  "events",
  "ecosystem",
  "zbroyaexpo",
  "buildwithukraine",
  "analytics",
];

const INITIAL_VISIBLE = 6;
const LOAD_STEP = 3;

const SHOW_FILTERS = true;

export const MediaNews = () => {
  const { t, language } = useLanguage();
  const { news, loading } = useNews();
  const [activeFilter, setActiveFilter] = useState("all");
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE);

  const cards = useMemo(
    () => news.map((item) => mapNewsToCard(item, { t, language })),
    [news, t, language],
  );

  /*
   * Показуємо тільки ті категорії, у яких справді є статті.
   *
   * Інакше половина табів веде в «у цій категорії ще немає статей» — а
   * порожній таб виглядає як несправний, і людина не розуміє, чи це вона щось
   * зробила не так. Щойно в CRM з'явиться перша стаття категорії, таб
   * повернеться сам, без правок тут.
   */
  const filters = useMemo(() => {
    const labels = t("mediaNews.filters");
    // Стаття може мати кілька тегів, тому збираємо всі, а не по одному
    const present = new Set(cards.flatMap((item) => item.tags ?? []));

    return FILTER_IDS.filter((id) => id === "all" || present.has(id)).map(
      (id) => ({ id, label: labels[id] }),
    );
  }, [t, cards]);

  const filteredNews = useMemo(() => {
    if (activeFilter === "all") return cards;
    // Досить одного збігу: реліз із тегами #GR #Ecosystem видно в обох табах
    return cards.filter((item) => (item.tags ?? []).includes(activeFilter));
  }, [activeFilter, cards]);

  // Одна категорія на всі статті — таби нічого не дають, лишаємо просто список
  const showFilters = SHOW_FILTERS && filters.length > 2;
  const visibleNews = filteredNews.slice(0, visibleCount);
  const canLoadMore = visibleCount < filteredNews.length;

  const handleFilterChange = (filterId) => {
    setActiveFilter(filterId);
    setVisibleCount(INITIAL_VISIBLE);
  };

  // Поки жодної статті немає — секцію «Новини» не показуємо взагалі
  if (!loading && cards.length === 0) return null;

  return (
    <section
      className={`media-news${showFilters ? "" : " media-news--no-filters"}`}
      aria-labelledby="media-news-title"
    >
      <div className="media-news__glow" aria-hidden="true" />

      <div className="media-news__inner">
        <header className="media-news__header">
          <h2 id="media-news-title" className="media-news__title">
            {t("mediaNews.title")}
          </h2>
        </header>

        {showFilters ? (
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
        ) : null}

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
                href={item.href}
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
