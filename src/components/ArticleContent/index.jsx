import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import facebook from "../../assets/faceb.svg";
import linkedin from "../../assets/linked.svg";
import telegram from "../../assets/tg.svg";
import xIcon from "../../assets/x.svg";
import {
  formatNewsDate,
  getCategoryLabel,
  resolveNewsAssetUrl,
} from "../../api/news";
import { resolveArticleTags } from "../../data/articleMeta";
import { renderRichText } from "../RichText";
import { useLanguage } from "../../i18n/LanguageContext";
import "./style.css";

/*
 * Поділитися статтею. Кожна кнопка веде у справжнє вікно шеринга відповідної
 * мережі — раніше тут у всіх п'ятьох стояло href="#", тобто блок нічого не
 * робив. Instagram сюда не входить: він не має способу поділитися посиланням
 * ззовні застосунку, тому замість нього — копіювання адреси.
 */
const SHARE_TARGETS = [
  {
    id: "facebook",
    label: "Facebook",
    icon: facebook,
    build: (url) => `https://www.facebook.com/sharer/sharer.php?u=${url}`,
  },
  {
    id: "x",
    label: "X",
    icon: xIcon,
    build: (url, title) =>
      `https://twitter.com/intent/tweet?url=${url}&text=${title}`,
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    icon: linkedin,
    build: (url) =>
      `https://www.linkedin.com/sharing/share-offsite/?url=${url}`,
  },
  {
    id: "telegram",
    label: "Telegram",
    icon: telegram,
    build: (url, title) => `https://t.me/share/url?url=${url}&text=${title}`,
  },
];

const renderBlock = (block) => {
  switch (block.type) {
    case "text":
      return (
        <p key={block.id} className="article-page__text">
          {renderRichText(block.content)}
        </p>
      );
    case "subheading":
      return (
        <h2 key={block.id} className="article-page__subheading">
          {renderRichText(block.content)}
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
    case "gallery": {
      const images = (block.images ?? []).filter((image) => image.src);
      if (images.length === 0) return null;

      // Одна колонка для пари, дві — для більших наборів
      const modifier = images.length <= 2 ? "duo" : "grid";

      return (
        <div
          key={block.id}
          className={`article-page__gallery article-page__gallery--${modifier}`}
        >
          {images.map((image, index) => (
            <figure
              key={`${block.id}-${index}`}
              className="article-page__gallery-item"
            >
              <img
                src={resolveNewsAssetUrl(image.src)}
                alt={image.alt ?? ""}
                className="article-page__gallery-image"
                loading="lazy"
              />
            </figure>
          ))}
        </div>
      );
    }
    default:
      return null;
  }
};

export const ArticleContent = ({ article, loading = false }) => {
  const { t, language, localizePath } = useLanguage();
  const [isCopied, setIsCopied] = useState(false);

  const pageUrl = typeof window === "undefined" ? "" : window.location.href;
  const shareUrl = encodeURIComponent(pageUrl);
  const shareTitle = encodeURIComponent(article?.title ?? "");

  const copyLink = useCallback(() => {
    if (!pageUrl || !navigator.clipboard) return;
    navigator.clipboard
      .writeText(pageUrl)
      .then(() => setIsCopied(true))
      // Не вийшло — краще лишити кнопку в спокої, ніж збрехати «скопійовано»
      .catch(() => {});
  }, [pageUrl]);

  // Підпис «скопійовано» сам повертається до звичайного
  useEffect(() => {
    if (!isCopied) return undefined;
    const timer = window.setTimeout(() => setIsCopied(false), 2000);
    return () => window.clearTimeout(timer);
  }, [isCopied]);

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
  /*
   * Тег беремо з тієї самої таблиці, що й картки стрічки, а не з поля
   * `category` у CRM: у базі лишились старі одиничні категорії, тому стаття
   * з тегами «#Міжнародка #Події» у стрічці була «Міжнародка», а на власній
   * сторінці — «GR». Показуємо перший тег: місця тут теж рівно на один.
   */
  const tag = getCategoryLabel(resolveArticleTags(article)[0], filters);
  const isoDate = article.createdAt?.slice(0, 10) ?? "";
  const dateLabel = formatNewsDate(article.createdAt, language);
  const blocks = article.blocks ?? [];

  return (
    <div className="article-page__shell">
      <nav
        className="article-page__breadcrumbs"
        aria-label={t("articleContent.breadcrumbLabel")}
      >
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
              {SHARE_TARGETS.map((target) => (
                <a
                  key={target.id}
                  href={target.build(shareUrl, shareTitle)}
                  className="article-page__social-link"
                  aria-label={`${t("articleContent.shareVia")} ${target.label}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <img
                    src={target.icon}
                    alt=""
                    className="article-page__social-icon"
                    aria-hidden="true"
                  />
                </a>
              ))}

              <button
                type="button"
                className="article-page__social-link article-page__social-link--copy"
                onClick={copyLink}
              >
                {isCopied ? t("articleContent.copied") : t("articleContent.copyLink")}
              </button>
            </div>
          </footer>
        </div>

        <div className="article-page__gutter" aria-hidden="true" />
      </div>
    </div>
  );
};
