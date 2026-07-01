import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { PageLayout } from "../../components/PageLayout";
import { ArticleContent } from "../../components/ArticleContent";
import { Article } from "../../components/UI/Article";
import { SendRequest } from "../../components/UI/SendRequest";
import { mapNewsToCard } from "../../api/news";
import { useNews } from "../../hooks/useNews";
import { useLanguage } from "../../i18n/LanguageContext";
import "./style.css";

const RELATED_ARTICLES_LIMIT = 3;

export const ArticlePage = () => {
  const { id } = useParams();
  const { t, language } = useLanguage();
  const { news, loading } = useNews();

  const article = useMemo(
    () => news.find((item) => item.id === id) ?? null,
    [news, id],
  );

  const relatedArticles = useMemo(() => {
    const cards = news
      .filter((item) => item.id !== id)
      .slice(0, RELATED_ARTICLES_LIMIT)
      .map((item) => mapNewsToCard(item, { t, language }));

    if (cards.length > 0) return cards;

    return news
      .slice(0, RELATED_ARTICLES_LIMIT)
      .map((item) => mapNewsToCard(item, { t, language }));
  }, [news, id, t, language]);

  return (
    <PageLayout>
      <article className="article-page">
        <ArticleContent article={article} loading={loading} />

        {!loading && relatedArticles.length > 0 ? (
          <section
            className="article-page__related"
            aria-labelledby="article-related-title"
          >
            <h2 id="article-related-title" className="article-page__related-title">
              {t("articlePage.relatedTitle")}
            </h2>

            <div className="article-page__related-grid">
              {relatedArticles.map((item, index) => (
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
              ))}
            </div>
          </section>
        ) : null}

        <div className="article-page__cta">
          <SendRequest />
        </div>
      </article>
    </PageLayout>
  );
};
