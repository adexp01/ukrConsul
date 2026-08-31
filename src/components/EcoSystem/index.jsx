import { useState } from "react";
import { useLanguage } from "../../i18n/LanguageContext";
import { getEcoSystemMemberImage } from "./memberImages";
import "./style.css";

export const EcoSystem = () => {
  const { t } = useLanguage();
  const copy = t("aboutUsPage.ecoSystem");
  const members = copy.members ?? [];
  const memberCount = members.length;
  const focusMember = copy.focusMember;
  const cards = focusMember
    ? [
        {
          ...focusMember,
          focusDescription: copy.focusDescription,
        },
        ...members,
      ]
    : members;
  const [flippedCardId, setFlippedCardId] = useState(null);

  const showFocus = (event, cardId) => {
    event.stopPropagation();
    setFlippedCardId(cardId);
  };

  const hideFocus = (cardId) => {
    setFlippedCardId((currentCardId) =>
      currentCardId === cardId ? null : currentCardId,
    );
  };

  if (memberCount === 0) return null;

  return (
    <section className="eco-system" aria-labelledby="eco-system-title">
      <div className="eco-system__glow" aria-hidden="true" />

      <div className="eco-system__inner">
        <div className="eco-system__intro">
          <h2 id="eco-system-title" className="eco-system__title">
            {copy.title}
          </h2>
          <p className="eco-system__lead">{copy.intro}</p>
        </div>

        <div className="eco-system__members" role="list">
          {cards.map((member) => {
            const cardId = member.id ?? member.name;
            const thumbSrc = getEcoSystemMemberImage(member);
            const isFlipped = flippedCardId === cardId;
            const focusText = member.focusDescription ?? member.role;
            /*
              Плашка на оборотці підписує не асоціацію, а напрям роботи —
              «Фокус». Тому вона стоїть на всіх картках, включно з головою
              правління та інвестклубом. Окремій картці локаль може її
              прибрати, задавши focusLabel: "" (порожню лишати не можна:
              висів би самотній квадратик іконки).
            */
            const focusLabel = member.focusLabel ?? copy.focusLabel;

            return (
              /*
                Картка перевертається по кліку, тобто це кнопка за поведінкою.
                Раніше вона стояла в tab-порядку (tabIndex={0}), але з
                клавіатури не активувалась — фокус приходив у пастку.
              */
              <article
                key={cardId}
                role="listitem"
                className={`eco-system__member eco-system__member--focus-card${isFlipped ? " is-flipped" : ""}`}
                tabIndex={0}
                aria-expanded={isFlipped}
                onClick={() => hideFocus(cardId)}
                onKeyDown={(event) => {
                  if (event.key !== "Enter" && event.key !== " ") return;
                  event.preventDefault();
                  hideFocus(cardId);
                }}
              >
                <div className="eco-system__flip-inner">
                  <div className="eco-system__flip-face eco-system__flip-face--front">
                    <div className="eco-system__member-thumb" aria-hidden="true">
                      {thumbSrc ? (
                        <img
                          src={thumbSrc}
                          alt=""
                          loading="lazy"
                          decoding="async"
                        />
                      ) : (
                        <span>{copy.imagePlaceholder}</span>
                      )}
                    </div>
                    <h3 className="eco-system__member-name">{member.name}</h3>
                    <p className="eco-system__member-role">{member.role}</p>
                    {/*
                      Видимий підпис кнопки короткий («Детальніше» / «About»),
                      тому для читалок додаємо ім'я в aria-label — інакше на
                      сторінці дев'ять однакових кнопок без контексту.
                    */}
                    <button
                      className="eco-system__focus-cta"
                      type="button"
                      onClick={(event) => showFocus(event, cardId)}
                      aria-pressed={isFlipped}
                      aria-label={`${copy.focusCta} — ${member.name}`}
                    >
                      <span>{copy.focusCta}</span>
                      <span aria-hidden="true">→</span>
                    </button>
                  </div>

                  <div className="eco-system__flip-face eco-system__flip-face--back">
                    {focusLabel ? (
                      <span className="eco-system__focus">
                        <span
                          className="eco-system__focus-icon"
                          aria-hidden="true"
                        />
                        {focusLabel}
                      </span>
                    ) : null}
                    <p className="eco-system__focus-text">{focusText}</p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};
