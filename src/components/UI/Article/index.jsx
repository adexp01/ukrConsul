import { Link } from "react-router-dom";
import { useLanguage } from "../../../i18n/LanguageContext";
import "./style.css";

export const Article = ({
  id,
  bg,
  tag,
  date,
  title,
  excerpt,
  href,
  description,
}) => {
  const { t } = useLanguage();
  const articleHref = href ?? `/article/${id}`;
  const readLabel = t("articles.readArticle");

  return (
    <Link
      to={articleHref}
      className="articles-card"
      style={{ "--card-bg": bg }}
      aria-label={`${readLabel}: ${title}`}
    >
      <div className="articles-card__body">
        <div className="articles-card__top">
          <span className="articles-card__tag">
            <span className="articles-card__tag-icon" aria-hidden="true">
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                <rect width="10" height="10" rx="2" fill="#19238E85" />
              </svg>
            </span>
            {tag}
          </span>
          <time className="articles-card__date" dateTime={date}>
            {date}
          </time>
        </div>

        <h3 className="articles-card__heading">{title}</h3>

        {excerpt ? <p className="articles-card__excerpt">{excerpt}</p> : null}
        {description ? (
          <p className="articles-card__excerpt">{description}</p>
        ) : null}

        <span className="articles-card__read">{readLabel}</span>
      </div>

      <span className="articles-card__action" aria-hidden="true">
        →
      </span>
    </Link>
  );
};
