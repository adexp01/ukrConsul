import { useMemo } from "react";
import { Article } from "../UI/Article";
import { mapNewsToCard } from "../../api/news";
import { useNews } from "../../hooks/useNews";
import { useLanguage } from "../../i18n/LanguageContext";
import "./style.css";

const HOME_ARTICLES_LIMIT = 3;

export const Articles = () => {
  const { t, language } = useLanguage();
  const { news, loading } = useNews();

  const articles = useMemo(
    () =>
      news
        .slice(0, HOME_ARTICLES_LIMIT)
        .map((item) => mapNewsToCard(item, { t, language })),
    [news, t, language],
  );

  const hasArticles = articles.length > 0;

  return (
    <section className="articles" aria-labelledby="articles-title">
      <div className="articles__inner">
        <header className="articles__header">
          <h2 id="articles-title" className="articles__title">
            {t("articles.title")}
          </h2>
        </header>

        <div className="articles__grid">
          {!loading && hasArticles ? (
            articles.map((article, index) => (
              <Article
                key={article.id}
                id={article.id}
                variant={(index % 3) + 1}
                tag={article.tag}
                dateLabel={article.dateLabel}
                isoDate={article.isoDate}
                title={article.title}
                description={article.description}
              />
            ))
          ) : !loading ? (
            <div className="articles__empty" role="status">
              <p className="articles__empty-title">{t("articles.emptyTitle")}</p>
              <p className="articles__empty-text">{t("articles.emptyText")}</p>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
};
