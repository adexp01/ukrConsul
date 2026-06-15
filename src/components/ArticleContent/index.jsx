import { Link, useParams } from "react-router-dom";
import instagram from "../../assets/ins.svg";
import facebook from "../../assets/faceb.svg";
import linkedin from "../../assets/linked.svg";
import telegram from "../../assets/tg.svg";
import xIcon from "../../assets/x.svg";
import { useLanguage } from "../../i18n/LanguageContext";
import "./style.css";

const SOCIALS = [
  { id: "instagram", label: "Instagram", href: "#", icon: instagram },
  { id: "facebook", label: "Facebook", href: "#", icon: facebook },
  { id: "linkedin", label: "LinkedIn", href: "#", icon: linkedin },
  { id: "telegram", label: "Telegram", href: "#", icon: telegram },
  { id: "x", label: "X", href: "#", icon: xIcon },
];

export const ArticleContent = () => {
  const { id } = useParams();
  const { t, localizePath } = useLanguage();

  const articles = t("articleContent.articles");
  const article = articles[id] ?? articles[3];

  return (
    <div className="article-page__shell">
      <nav className="article-page__breadcrumbs" aria-label="Breadcrumb">
        <Link to={localizePath("/media")} className="article-page__breadcrumb-link">
          {t("articleContent.breadcrumbMedia")}
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
            <span className="article-page__visual-placeholder">
              {t("articleContent.imagePlaceholder")}
            </span>
          </div>

          <div className="article-page__body">
            {article.body.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>

          <footer className="article-page__share">
            <span className="article-page__share-label">
              {t("articleContent.share")}
            </span>

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
