import { useState } from "react";
import { Button } from "../UI/Button";
import { useLanguage } from "../../i18n/LanguageContext";
import { resolveFormByKey } from "../JoinQuiz/mapping";
import "./style.css";

export const JoinParticipationFormats = () => {
  const { t, language } = useLanguage();
  const joinCopy = t("joinPage");
  const copy = t("joinPage.participationFormats");
  const items = copy.items ?? [];
  const [openIndex, setOpenIndex] = useState(0);

  if (items.length === 0) return null;

  return (
    <section className="join-participation" aria-label={copy.ariaLabel}>
      <div className="join-participation__inner">
        <div className="join-participation__list">
          {items.map((item, index) => {
            const isOpen = openIndex === index;
            const panelId = `join-participation-panel-${index}`;
            const buttonId = `join-participation-button-${index}`;

            return (
              <article
                key={item.title}
                className={`join-participation-card${isOpen ? " is-open" : ""}`}
              >
                <button
                  id={buttonId}
                  className="join-participation-card__header"
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() => setOpenIndex(isOpen ? -1 : index)}
                >
                  <span className="join-participation-card__number">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="join-participation-card__title">
                    {item.title}
                  </span>
                  <span
                    className="join-participation-card__toggle"
                    aria-hidden="true"
                  >
                    {isOpen ? "−" : "+"}
                  </span>
                </button>

                {/*
                  Тіло рендериться завжди, а не лише коли відкрито.
                  Інакше анімувати нічого: вузол з'являється в DOM уже
                  розгорнутим, і жоден перехід до нього не застосується.
                  Висоту веде CSS через grid-template-rows, деталі — у style.css.
                */}
                <div
                  className="join-participation-card__panel"
                  aria-hidden={isOpen ? undefined : "true"}
                >
                  <div
                    id={panelId}
                    className="join-participation-card__body"
                    role="region"
                    aria-labelledby={buttonId}
                  >
                    <p className="join-participation-card__text">{item.text}</p>

                    <h3 className="join-participation-card__subtitle">
                      {copy.benefitsTitle}
                    </h3>

                    <ul className="join-participation-card__benefits">
                      {item.benefits.map((benefit) => (
                        <li key={benefit}>{benefit}</li>
                      ))}
                    </ul>

                    <Button
                      href={resolveFormByKey(item.form, language)}
                      target="_blank"
                      rel="noreferrer"
                      className="join-participation-card__cta"
                    >
                      {joinCopy.primaryCta}
                    </Button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        <div className="join-participation__footer">
          <Button
            href={resolveFormByKey(copy.partnerForm, language)}
            target="_blank"
            rel="noreferrer"
            variant="dark"
          >
            {copy.partnerCta}
          </Button>
        </div>
      </div>
    </section>
  );
};
