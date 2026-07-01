import { Link } from "react-router-dom";
import { useLanguage } from "../../../i18n/LanguageContext";
import "./style.css";

const CORNER_SHAPE_PATH =
  "M0 0H160V50C160 55.5228 155.523 60 150 60H120.964C116.779 60 113.036 62.6064 111.585 66.532L94.4152 112.968C92.9637 116.894 89.2211 119.5 85.0358 119.5H0V0Z";

const BTN_SHAPE_PATH =
  "M128 65.5H148C154.627 65.5 160 70.873 160 77.5V107.5C160 114.127 154.627 119.5 148 119.5H107C100.9 119.5 98.4 115.6 100.1 110.9L113.5 74.6C115.4 69.4 120.3 65.5 128 65.5Z";

export const Article = ({
  id,
  variant,
  bg,
  tag,
  date,
  dateLabel,
  isoDate,
  title,
  excerpt,
  href,
  description,
  className = "",
}) => {
  const { t, localizePath } = useLanguage();
  const articleHref = localizePath(href ?? `/article/${id}`);
  const readLabel = t("articles.readArticle");
  const bodyText = excerpt ?? description;
  const displayDate = dateLabel ?? date;
  const machineDate = isoDate ?? date;
  const colorVariant =
    variant ??
    (Number.isFinite(Number(id)) ? ((Number(id) - 1) % 3) + 1 : 1);
  const colorClass = bg ? "" : `news-card--${colorVariant}`;

  return (
    <Link
      to={articleHref}
      className={`news-card ${colorClass}${className ? ` ${className}` : ""}`}
      style={bg ? { "--card-bg": bg } : undefined}
      aria-label={`${readLabel}: ${title}`}
    >
      <span className="news-card__lift">
        <span className="news-card__bg" aria-hidden="true">
          <span className="news-card__bg-top" />
          <span className="news-card__bg-left" />
          <svg
            className="news-card__bg-corner"
            viewBox="0 0 160 119.5"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path d={CORNER_SHAPE_PATH} fill="currentColor" />
            <path className="news-card__btn-path" d={BTN_SHAPE_PATH} />
          </svg>
        </span>

        <span className="news-card__inner">
          <span>
            <span className="news-card__head">
              <span className="news-card__tag">
                <span className="news-card__tag-dot" aria-hidden="true" />
                {tag}
              </span>
              <time className="news-card__date" dateTime={machineDate}>
                {displayDate}
              </time>
            </span>
            <h3 className="news-card__title">{title}</h3>
            {bodyText ? (
              <p className="news-card__excerpt">{bodyText}</p>
            ) : null}
          </span>
          <span className="news-card__cta">
            <span>{readLabel}</span>
          </span>
        </span>

        <span className="news-card__btn" aria-hidden="true">
          <i className="news-card__btn-icon" />
        </span>
      </span>
    </Link>
  );
};
