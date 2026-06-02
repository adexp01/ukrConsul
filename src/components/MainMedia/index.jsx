import { useState } from "react";
import { Button } from "../UI/Button";
import { useLanguage } from "../../i18n/LanguageContext";
import "./style.css";
import { ButtonTest } from "../UI/ButtonTest";

const AccordionPlusIcon = () => (
  <svg
    className="main-media__accordion-svg"
    viewBox="0 0 14 14"
    fill="none"
    aria-hidden="true"
  >
    <path
      d="M7 1.5V12.5M1.5 7H12.5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

const AccordionCloseIcon = () => (
  <svg
    className="main-media__accordion-svg"
    viewBox="0 0 12 12"
    fill="none"
    aria-hidden="true"
  >
    <path
      d="M1.5 1.5L10.5 10.5M10.5 1.5L1.5 10.5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

export const MainMedia = () => {
  const { t } = useLanguage();
  const [isTopicsOpen, setIsTopicsOpen] = useState(false);
  const topics = t("media.main.topics");

  return (
    <section className="main-media" aria-labelledby="main-media-title">
      <div className="main-media__inner">
        <article className="main-media__card">
          <div className="main-media__media" aria-hidden="true">
            <span className="main-media__media-placeholder">
              {t("media.main.imagePlaceholder")}
            </span>
          </div>

          <div className="main-media__body">
            <div className="main-media__meta">
              <span className="main-media__tag">{t("media.main.tag")}</span>
              <p className="main-media__date">
                <span className="main-media__date-label">
                  {t("media.main.dateLabel")}
                </span>
              </p>
            </div>

            <h2 id="main-media-title" className="main-media__title">
              {t("media.main.title")}
            </h2>

            <p className="main-media__text">{t("media.main.text")}</p>

            <div
              className={`main-media__accordion${
                isTopicsOpen ? " main-media__accordion--open" : ""
              }`}
            >
              <div className="main-media__accordion-header">
                <span className="main-media__accordion-title">
                  {t("media.main.accordionLabel")}
                </span>
                <button
                  type="button"
                  className="main-media__accordion-toggle"
                  aria-expanded={isTopicsOpen}
                  aria-controls="main-media-topics"
                  aria-label={
                    isTopicsOpen
                      ? t("media.main.accordionClose")
                      : t("media.main.accordionOpen")
                  }
                  onClick={() => setIsTopicsOpen((open) => !open)}
                >
                  <span className="main-media__accordion-icon" aria-hidden="true">
                    {isTopicsOpen ? <AccordionCloseIcon /> : <AccordionPlusIcon />}
                  </span>
                </button>
              </div>

              <div
                id="main-media-topics"
                className="main-media__accordion-panel"
                hidden={!isTopicsOpen}
              >
                <ul className="main-media__topics">
                  {topics.map((topic) => (
                    <li key={topic}>{topic}</li>
                  ))}
                </ul>
              </div>
            </div>

            <p className="main-media__text main-media__text--secondary">
              {t("media.main.textSecondary")}
            </p>

            <ButtonTest href="#" variant="primary" className="main-media__cta">
              {t("media.main.apply")}
            </ButtonTest>
          </div>
        </article>
      </div>
    </section>
  );
};
