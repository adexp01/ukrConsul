import { useMemo, useState } from "react";
import { Button, NavArrows } from "../UI/Button";
import { useLanguage } from "../../i18n/LanguageContext";
import "./style.css";

const VISIBLE_CARD_COUNT = 3;

export const JoinEcosystem = () => {
  const { t } = useLanguage();
  const copy = t("joinPage.ecosystem");
  const joinCopy = t("joinPage");
  const cards = copy.items ?? [];
  const maxStartIndex = Math.max(0, cards.length - VISIBLE_CARD_COUNT);
  const [startIndex, setStartIndex] = useState(0);

  const visibleCards = useMemo(
    () => cards.slice(startIndex, startIndex + VISIBLE_CARD_COUNT),
    [cards, startIndex],
  );

  const goPrev = () => {
    setStartIndex((currentIndex) => Math.max(0, currentIndex - 1));
  };

  const goNext = () => {
    setStartIndex((currentIndex) => Math.min(maxStartIndex, currentIndex + 1));
  };

  if (cards.length === 0) return null;

  return (
    <section className="join-ecosystem" aria-labelledby="join-ecosystem-title">
      <div className="join-ecosystem__inner">
        <h2 id="join-ecosystem-title" className="join-ecosystem__title">
          {copy.title.map((line) => (
            <span key={line}>{line}</span>
          ))}
        </h2>

        <div className="join-ecosystem__cards">
          {visibleCards.map((item) => (
            <article key={item.title} className="join-ecosystem-card">
              <h3 className="join-ecosystem-card__title">{item.title}</h3>
              <p className="join-ecosystem-card__text">{item.text}</p>

              {item.href ? (
                <a
                  href={item.href}
                  className="join-ecosystem-card__link"
                  target="_blank"
                  rel="noreferrer"
                >
                  {copy.cardCta}
                  <span aria-hidden="true">↗</span>
                </a>
              ) : null}
            </article>
          ))}
        </div>

        <div className="join-ecosystem__footer">
          <div className="join-ecosystem__actions">
            <Button href={joinCopy.applyHref} variant="primary" target="_blank" rel="noreferrer">
              {joinCopy.primaryCta}
            </Button>

            <a href={copy.formatHref} className="join-ecosystem__format-link">
              {copy.formatCta}
              <span aria-hidden="true">→</span>
            </a>
          </div>

          <NavArrows
            className="join-ecosystem__nav"
            variant="outline"
            onPrev={goPrev}
            onNext={goNext}
            prevLabel={copy.prevLabel}
            nextLabel={copy.nextLabel}
            prevDisabled={startIndex === 0}
            nextDisabled={startIndex === maxStartIndex}
          />
        </div>
      </div>
    </section>
  );
};
