import { useMemo } from "react";
import { Article } from "../UI/Article";
import { Button } from "../UI/Button";
import { useLanguage } from "../../i18n/LanguageContext";
import "./style.css";

const ARTICLE_META = [
  { id: 1, bg: "#dde6ed" },
  { id: 2, bg: "#bdd5ea" },
  { id: 3, bg: "#97a7d8" },
];

export const Articles = () => {
  const { t, language } = useLanguage();

  const articles = useMemo(() => {
    const items = t("articles.items");
    return ARTICLE_META.map((meta, index) => ({
      ...meta,
      ...items[index],
    }));
  }, [t, language]);

  return (
    <section className="articles" aria-labelledby="articles-title">
      <div className="articles__inner">
        <header className="articles__header">
          <h2 id="articles-title" className="articles__title">
            {t("articles.title")}
          </h2>

          <Button href="#" variant="default" className="articles__all-media">
            {t("articles.allMedia")}
          </Button>
        </header>

        <div className="articles__grid">
          {articles.map((article) => (
            <Article
              key={article.id}
              id={article.id}
              bg={article.bg}
              tag={article.tag}
              date={article.date}
              title={article.title}
              description={article.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
