import { useMemo } from "react";
import { useParams } from "react-router-dom";
import { PageLayout } from "../../components/PageLayout";
import { ArticleContent } from "../../components/ArticleContent";
import { Article } from "../../components/UI/Article";
import { SendRequest } from "../../components/UI/SendRequest";
import "./style.css";

const RELATED_ARTICLES = [
  {
    id: 1,
    tag: "Export",
    date: "2026-03-12",
    dateLabel: "March 12, 2026",
    title:
      "White Paper on changes in the defence industry: what solutions are already working for manufacturers",
    excerpt:
      "The Ukrainian Council of Defence Industry has prepared an analytical document, the White Paper on changes in the defence industry, outlining practical solutions for manufacturers.",
    bg: "#dde6ed",
  },
  {
    id: 2,
    tag: "International",
    date: "2026-04-04",
    dateLabel: "April 04, 2026",
    title:
      "Two associations join the Gunsmiths' Council: UAV schools and maritime drones",
    excerpt:
      "Two new industry associations have joined the Ukrainian Council of Defence Industry: the Independent Association of UAV Schools and the Association of Maritime Drones.",
    bg: "#c8d4ea",
  },
  {
    id: 3,
    tag: "GR",
    date: "2026-04-30",
    dateLabel: "April 30, 2026",
    title:
      "A year of the Gunsmiths' Council: 300 manufacturers, 30+ regulatory decisions and new partnerships",
    excerpt:
      "On 25 February 2026, the Ukrainian Council of Defence Industry shared the results of its first year: 300+ manufacturers and dozens of sector reforms.",
    bg: "#97a7d8",
  },
];

export const ArticlePage = () => {
  const { id } = useParams();

  const relatedArticles = useMemo(() => {
    const currentId = Number(id);
    const others = RELATED_ARTICLES.filter((item) => item.id !== currentId);

    if (others.length >= 3) {
      return others.slice(0, 3);
    }

    return RELATED_ARTICLES.slice(0, 3);
  }, [id]);

  return (
    <PageLayout>
      <article className="article-page">
        <ArticleContent />

        <section
          className="article-page__related"
          aria-labelledby="article-related-title"
        >
          <h2 id="article-related-title" className="article-page__related-title">
            You might also be interested in
          </h2>

          <div className="article-page__related-grid">
            {relatedArticles.map((item) => (
              <Article
                key={item.id}
                id={item.id}
                bg={item.bg}
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
