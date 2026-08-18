import { Button } from "../UI/Button";
import { useLanguage } from "../../i18n/LanguageContext";
import { hasDestination } from "../../utils/links";
import "./style.css";

export const ForJournalist = () => {
  const { t } = useLanguage();
  const topics = t("media.forJournalist.topics");
  /*
   * Адреса живе в локалі, а не тут: так її можна змінити без правок у коді, і
   * так само працює правило «немає цілі — немає кнопки». Раніше стояло
   * href="#", тобто кнопка нічого не робила, зате кидала сторінку вгору.
   */
  const ctaHref = t("media.forJournalist.ctaHref");

  return (
    <section className="for-journalist" aria-labelledby="for-journalist-title">
      <div className="for-journalist__inner">
        <header className="for-journalist__head">
          <h2 id="for-journalist-title" className="for-journalist__title">
            {t("media.forJournalist.title")}
          </h2>
          <p className="for-journalist__intro">
            {t("media.forJournalist.intro")}
          </p>
        </header>

        <div className="for-journalist__panel">
          <span className="for-journalist__pill">
            {t("media.forJournalist.pill")}
          </span>

          <ul className="for-journalist__list">
            {topics.map((topic) => (
              <li key={topic}>{topic}</li>
            ))}
          </ul>

          {hasDestination(ctaHref) ? (
            <Button
              href={ctaHref}
              variant="default"
              className="for-journalist__cta"
            >
              {t("media.forJournalist.cta")}
            </Button>
          ) : null}
        </div>
      </div>
    </section>
  );
};
