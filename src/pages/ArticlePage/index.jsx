import { Link, useParams } from "react-router-dom";
import { PageLayout } from "../../components/PageLayout";
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
  { id: "instagram", label: "Instagram", href: "#" },
  { id: "facebook", label: "Facebook", href: "#" },
  { id: "linkedin", label: "LinkedIn", href: "#" },
  { id: "telegram", label: "Telegram", href: "#" },
  { id: "share", label: "Share link", href: "#" },
];

const SocialIcon = ({ id }) => {
  if (id === "instagram") {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.5" />
        <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
      </svg>
    );
  }

  if (id === "facebook") {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M14 8h3V4h-3c-2.8 0-5 2.2-5 5v3H6v4h3v8h4v-8h3.3l.7-4H13V9c0-.6.4-1 1-1z"
          fill="currentColor"
        />
      </svg>
    );
  }

  if (id === "linkedin") {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M6 9h4v12H6V9zm2-6a2.5 2.5 0 110 5 2.5 2.5 0 010-5zm4 6h4v1.7h.1c.6-1.1 2-2.3 4.1-2.3 4.4 0 5.2 2.9 5.2 6.6V21h-4v-6.2c0-1.5-.5-2.5-1.9-2.5-1 0-1.6.7-1.9 1.4-.1.3-.1.7-.1 1.1V21h-4V9z"
          fill="currentColor"
        />
      </svg>
    );
  }

  if (id === "telegram") {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path
          d="M21 4L4 11l5 2 3 7 2-7 7-5z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M8 12h8M12 8v8M7 4h10a3 3 0 013 3v10a3 3 0 01-3 3H7a3 3 0 01-3-3V7a3 3 0 013-3z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
};

export const ArticlePage = () => {
  const { id } = useParams();
  const article = ARTICLES[id] ?? ARTICLES[3];

  return (
    <PageLayout>
      <article className="article-page">
        <div className="article-page__shell">
          <nav className="article-page__breadcrumbs" aria-label="Breadcrumb">
            <Link to="/media" className="article-page__breadcrumb-link">
              Media
            </Link>
            <span className="article-page__breadcrumb-sep" aria-hidden="true">
              &gt;
            </span>
            <span className="article-page__breadcrumb-current">{article.title}</span>
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
                      <SocialIcon id={social.id} />
                    </a>
                  ))}
                </div>
              </footer>
            </div>

            <div className="article-page__gutter" aria-hidden="true" />
          </div>
        </div>
      </article>
    </PageLayout>
  );
};
