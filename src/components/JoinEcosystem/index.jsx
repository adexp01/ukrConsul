import { Button, NavArrows } from "../UI/Button";
import { useCarousel } from "../../hooks/useCarousel";
import { useLanguage } from "../../i18n/LanguageContext";
import { useJoinQuiz } from "../JoinQuiz/JoinQuizContext";
import "./style.css";

const VISIBLE_CARD_COUNT = 3;

export const JoinEcosystem = () => {
  const { openJoinQuiz } = useJoinQuiz();
  const { t } = useLanguage();
  const copy = t("joinPage.ecosystem");
  const joinCopy = t("joinPage");
  const {
    items: cards,
    visibleItems: visibleCards,
    goPrev,
    goNext,
    isFirst,
    isLast,
  } = useCarousel(copy.items, VISIBLE_CARD_COUNT);

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
            <Button onClick={openJoinQuiz} variant="primary">
              {joinCopy.primaryCta}
            </Button>

            <button
              type="button"
              onClick={openJoinQuiz}
              className="join-ecosystem__format-link"
            >
              {copy.formatCta}
              <span aria-hidden="true">→</span>
            </button>
          </div>

          <NavArrows
            className="join-ecosystem__nav"
            variant="outline"
            onPrev={goPrev}
            onNext={goNext}
            prevLabel={copy.prevLabel}
            nextLabel={copy.nextLabel}
            prevDisabled={isFirst}
            nextDisabled={isLast}
          />
        </div>
      </div>
    </section>
  );
};
