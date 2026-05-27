import { useState } from "react";
import { Button } from "../UI/Button";
import { useLanguage } from "../../i18n/LanguageContext";
import "./style.css";

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

            <div className="main-media__accordion-wrap">
              <button
                type="button"
                className="main-media__accordion"
                aria-expanded={isTopicsOpen}
                aria-controls="main-media-topics"
                onClick={() => setIsTopicsOpen((open) => !open)}
              >
                <span>{t("media.main.accordionLabel")}</span>
                <span className="main-media__accordion-icon" aria-hidden="true">
                  {isTopicsOpen ? "−" : "+"}
                </span>
              </button>

              {isTopicsOpen ? (
                <ul id="main-media-topics" className="main-media__topics">
                  {topics.map((topic) => (
                    <li key={topic}>{topic}</li>
                  ))}
                </ul>
              ) : null}
            </div>

            <p className="main-media__text main-media__text--secondary">
              {t("media.main.textSecondary")}
            </p>

            <Button href="#" variant="primary" className="main-media__cta">
              {t("media.main.apply")}
            </Button>
          </div>
        </article>
      </div>
    </section>
  );
};
