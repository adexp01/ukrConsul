import { useMemo } from "react";
import { Article } from "../UI/Article";
import { Button } from "../UI/Button";
import { useLanguage } from "../../i18n/LanguageContext";
import "./style.css";

const ARTICLE_META = [];

export const Articles = () => {
  const { t, language, localizePath } = useLanguage();

  const articles = useMemo(() => {
    const items = t("articles.items");
    return ARTICLE_META.map((meta, index) => ({
      ...meta,
      ...items[index],
    }));
  }, [t, language]);

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
          {hasArticles ? (
            articles.map((article) => (
              <Article
                key={article.id}
                id={article.id}
                tag={article.tag}
                date={article.date}
                title={article.title}
                description={article.description}
              />
            ))
          ) : (
            <div className="articles__empty" role="status">
              <p className="articles__empty-title">{t("articles.emptyTitle")}</p>
              <p className="articles__empty-text">{t("articles.emptyText")}</p>
            </div>
          )}
        </div>

        <Button
          href={localizePath("/media")}
          variant="default"
          className="articles__all-media"
        >
          {t("articles.allMedia")}
        </Button>
      </div>
    </section>
  );
};
