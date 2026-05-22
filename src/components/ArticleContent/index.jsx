import { Link, useParams } from "react-router-dom";
import instagram from "../../assets/ins.svg";
import facebook from "../../assets/faceb.svg";
import linkedin from "../../assets/linked.svg";
import telegram from "../../assets/tg.svg";
import xIcon from "../../assets/x.svg";
import "./style.css";

const ARTICLES = {
  1: {
    tag: "Export",
    date: "2026-03-12",
    dateLabel: "March 12, 2026",
    title:
      "White Paper on changes in the defence industry: what solutions are already working for manufacturers and what holds the sector back",
    body: [
      "The Ukrainian Council of Defence Industry has prepared an analytical document on changes in the defence industry, outlining practical solutions that are already working for manufacturers and identifying factors that limit broader scaling across the sector.",
      "The paper summarises regulatory updates, international cooperation formats and communication approaches that help private defence companies present their work accurately to partners, investors and the public.",
    ],
  },
  2: {
    tag: "International",
    date: "2026-04-04",
    dateLabel: "April 04, 2026",
    title:
      "Two associations join the Gunsmiths' Council: UAV schools and maritime drones expand the ecosystem",
    body: [
      "Two new industry associations have joined the Ukrainian Council of Defence Industry, strengthening representation for UAV training and maritime drone development within the broader defence ecosystem.",
      "The move expands the Council's capacity to coordinate expertise, advocate for sector reforms and support manufacturers entering international partnerships and export-oriented programmes.",
    ],
  },
  3: {
    tag: "International",
    date: "2026-04-30",
    dateLabel: "April 30, 2026",
    title:
      "A year of the Gunsmiths' Council: 300 manufacturers, 30+ regulatory decisions and international work in 15 countries",
    body: [
      "On 25 February 2026, the Ukrainian Council of Defence Industry presented the results of its first year of work: more than 300 manufacturers united in a single ecosystem, over 30 regulatory decisions and active international engagement across 15 countries.",
      "The Council's media team helps explain how private defence production contributes to security and economic resilience, while supporting manufacturers with advocacy, expert commentary and access to international cooperation formats.",
    ],
  },
};

const SOCIALS = [
  { id: "instagram", label: "Instagram", href: "#", icon: instagram },
  { id: "facebook", label: "Facebook", href: "#", icon: facebook },
  { id: "linkedin", label: "LinkedIn", href: "#", icon: linkedin },
  { id: "telegram", label: "Telegram", href: "#", icon: telegram },
  { id: "x", label: "X", href: "#", icon: xIcon },
];

export const ArticleContent = () => {
  const { id } = useParams();
  const article = ARTICLES[id] ?? ARTICLES[3];

  return (
    <div className="article-page__shell">
      <nav className="article-page__breadcrumbs" aria-label="Breadcrumb">
        <Link to="/media" className="article-page__breadcrumb-link">
          Media
        </Link>
        <span className="article-page__breadcrumb-sep" aria-hidden="true">
          &gt;
        </span>
        <span className="article-page__breadcrumb-current">
          {article.title}
        </span>
      </nav>

      <div className="article-page__frame">
        <div className="article-page__glow" aria-hidden="true" />

        <div className="article-page__gutter" aria-hidden="true" />

        <div className="article-page__main">
          <header className="article-page__header">
            <div className="article-page__meta">
              <span className="article-page__tag">
                <span className="article-page__tag-icon" aria-hidden="true">
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <rect width="10" height="10" rx="2" fill="#19238E" />
                  </svg>
                </span>
                {article.tag}
              </span>
              <time className="article-page__date" dateTime={article.date}>
                {article.dateLabel}
              </time>
            </div>

            <h1 className="article-page__title">{article.title}</h1>
          </header>

          <div className="article-page__visual" aria-hidden="true">
            <span className="article-page__visual-placeholder">Image</span>
          </div>

          <div className="article-page__body">
            {article.body.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>

          <footer className="article-page__share">
            <span className="article-page__share-label">Share</span>

            <div className="article-page__socials">
              {SOCIALS.map((social) => (
                <a
                  key={social.id}
                  href={social.href}
                  className="article-page__social-link"
                  aria-label={social.label}
                >
                  <img
                    src={social.icon}
                    alt=""
                    className="article-page__social-icon"
                    aria-hidden="true"
                  />
                </a>
              ))}
            </div>
          </footer>
        </div>

        <div className="article-page__gutter" aria-hidden="true" />
      </div>
    </div>
  );
};
