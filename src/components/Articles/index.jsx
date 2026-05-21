import { Article } from "../UI/Article";
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
            <Article
              key={article.id}
              id={article.id}
              bg={article.bg}
              tag={article.tag}
              date={article.date}
              title={article.title}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
