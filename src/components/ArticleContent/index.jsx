import { Link } from "react-router-dom";
import instagram from "../../assets/ins.svg";
import facebook from "../../assets/faceb.svg";
import linkedin from "../../assets/linked.svg";
import telegram from "../../assets/tg.svg";
import xIcon from "../../assets/x.svg";
import {
  formatNewsDate,
  getCategoryLabel,
  resolveNewsAssetUrl,
} from "../../api/news";
import { useLanguage } from "../../i18n/LanguageContext";
import "./style.css";

const SOCIALS = [
  { id: "instagram", label: "Instagram", href: "#", icon: instagram },
  { id: "facebook", label: "Facebook", href: "#", icon: facebook },
  { id: "linkedin", label: "LinkedIn", href: "#", icon: linkedin },
  { id: "telegram", label: "Telegram", href: "#", icon: telegram },
  { id: "x", label: "X", href: "#", icon: xIcon },
];

const renderBlock = (block) => {
  switch (block.type) {
    case "text":
      return (
        <p key={block.id} className="article-page__text">
          {block.content}
        </p>
      );
    case "subheading":
      return (
        <h2 key={block.id} className="article-page__subheading">
          {block.content}
        </h2>
      );
    case "image":
      if (!block.src) return null;

      return (
        <figure key={block.id} className="article-page__figure">
          <img
            src={resolveNewsAssetUrl(block.src)}
            alt={block.alt ?? ""}
            className="article-page__figure-image"
            loading="lazy"
          />
        </figure>
      );
    default:
      return null;
  }
};

export const ArticleContent = ({ article, loading = false }) => {
  const { t, language, localizePath } = useLanguage();

  if (loading) {
    return (
      <div className="article-page__shell" role="status" aria-live="polite">
        <p className="article-page__status">{t("articleContent.loading")}</p>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="article-page__shell" role="status">
        <p className="article-page__status">{t("articleContent.notFound")}</p>
        <Link to={localizePath("/media")} className="article-page__breadcrumb-link">
          {t("articleContent.breadcrumbMedia")}
        </Link>
      </div>
    );
  }

  const filters = t("ourNews.filters");
  const tag = getCategoryLabel(article.category, filters);
  const isoDate = article.createdAt?.slice(0, 10) ?? "";
  const dateLabel = formatNewsDate(article.createdAt, language);
  const blocks = article.blocks ?? [];

  return (
    <div className="article-page__shell">
      <nav className="article-page__breadcrumbs" aria-label="Breadcrumb">
        <Link to={localizePath("/media")} className="article-page__breadcrumb-link">
          {t("articleContent.breadcrumbMedia")}
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
                {tag}
              </span>
              <time className="article-page__date" dateTime={isoDate}>
                {dateLabel}
              </time>
            </div>

            <h1 className="article-page__title">{article.title}</h1>
          </header>

          {article.mainImage ? (
            <div className="article-page__visual">
              <img
                src={resolveNewsAssetUrl(article.mainImage)}
                alt=""
                className="article-page__visual-image"
              />
            </div>
          ) : null}

          <div className="article-page__body">
            {blocks.length > 0
              ? blocks.map(renderBlock)
              : (
                <p className="article-page__text">{t("articleContent.noContent")}</p>
              )}
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
