import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { PageLayout } from "../../components/PageLayout";
import { ArticleContent } from "../../components/ArticleContent";
import { Article } from "../../components/UI/Article";
import { SendRequest } from "../../components/UI/SendRequest";
import { useLanguage } from "../../i18n/LanguageContext";
import "./style.css";

const RELATED_META = [
  { id: 1, date: "2026-03-12" },
  { id: 2, date: "2026-04-04" },
  { id: 3, date: "2026-04-30" },
];

export const ArticlePage = () => {
  const { id } = useParams();
  const { t, language } = useLanguage();

  const relatedArticles = useMemo(() => {
    const items = t("ourNews.items");
    const all = RELATED_META.map((meta, index) => ({
      ...meta,
      ...items[index],
    }));

    const currentId = Number(id);
    const others = all.filter((item) => item.id !== currentId);

    if (others.length >= 3) {
      return others.slice(0, 3);
    }

    return all.slice(0, 3);
  }, [id, t, language]);

  return (
    <PageLayout>
      <article className="article-page">
        <ArticleContent />

        <section
          className="article-page__related"
          aria-labelledby="article-related-title"
        >
          <h2 id="article-related-title" className="article-page__related-title">
            {t("articlePage.relatedTitle")}
          </h2>

          <div className="article-page__related-grid">
            {relatedArticles.map((item) => (
              <Article
                key={item.id}
                id={item.id}
                tag={item.tag}
                date={item.dateLabel}
                title={item.title}
                excerpt={item.excerpt}
                href={`/article/${item.id}`}
              />
            ))}
          </div>
        </section>

        <div className="article-page__cta">
          <SendRequest />
        </div>
      </article>
    </PageLayout>
  );
};
