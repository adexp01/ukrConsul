import { Button } from "../UI/Button";
import "./style.css";

const ARTICLES = [
  {
    id: 1,
    tag: "News",
    date: "March 12, 2026",
    title:
      "White Paper on Changes in the Defense Industry: What Solutions Are Already Working for ...",
    bg: "#dde6ed",
  },
  {
    id: 2,
    tag: "Publications",
    date: "March 30, 2026",
    title:
      "A year of the Gunsmiths' Council: 300 manufacturers, 30+ regulatory decisions and ...",
    bg: "#bdd5ea",
  },
  {
    id: 3,
    tag: "News",
    date: "April 01, 2026",
    title:
      "White Paper on Changes in the Defense Industry: What Solutions Are Already Working for ...",
    bg: "#97a7d8",
  },
];

export const Articles = () => {
  return (
    <section className="articles" aria-labelledby="articles-title">
      <div className="articles__inner">
        <header className="articles__header">
          <h2 id="articles-title" className="articles__title">
            LATEST ARTICLES
          </h2>

          <Button href="#" variant="default" className="articles__all-media">
            All media
          </Button>
        </header>

        <div className="articles__grid">
          {ARTICLES.map((article) => (
            <article
              key={article.id}
              className="articles-card"
              style={{ "--card-bg": article.bg }}
            >
              <div className="articles-card__body">
                <div className="articles-card__top">
                  <span className="articles-card__tag">
                    <span
                      className="articles-card__tag-icon"
                      aria-hidden="true"
                    >
                      <svg
                        width="10"
                        height="10"
                        viewBox="0 0 10 10"
                        fill="none"
                      >
                        <rect width="10" height="10" rx="2" fill="#19238E85" />
                      </svg>
                    </span>
                    {article.tag}
                  </span>
                  <time className="articles-card__date" dateTime={article.date}>
                    {article.date}
                  </time>
                </div>

                <h3 className="articles-card__heading">{article.title}</h3>

                <span className="articles-card__read">Read article</span>
              </div>

              <a
                href="#"
                className="articles-card__action"
                aria-label={`Read article: ${article.tag}`}
              >
                →
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
