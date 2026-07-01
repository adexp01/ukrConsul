import { useRef, useState } from "react";
import { useLanguage } from "../../i18n/LanguageContext";
import "./style.css";

const VISIBLE_CARD_COUNT = 3;

export const WhatWeDo = ({ contentKey = "aboutUsPage.whatWeDo" }) => {
  const { t } = useLanguage();
  const copy = t(contentKey);
  const items = copy.items ?? [];
  const itemCount = items.length;

  const sectionRef = useRef(null);
  const [startIndex, setStartIndex] = useState(0);
  const maxStartIndex = Math.max(0, itemCount - VISIBLE_CARD_COUNT);
  const visibleItems = items.slice(startIndex, startIndex + VISIBLE_CARD_COUNT);
  const canGoPrev = startIndex > 0;
  const canGoNext = startIndex < maxStartIndex;

  const goPrev = () => {
    setStartIndex((currentIndex) => Math.max(0, currentIndex - 1));
  };

  const goNext = () => {
    setStartIndex((currentIndex) => Math.min(maxStartIndex, currentIndex + 1));
  };

  if (itemCount === 0) return null;

  return (
    <section
      ref={sectionRef}
      className="what-we-do"
      aria-labelledby="what-we-do-title"
    >
      <div className="what-we-do__inner">
        <h2 id="what-we-do-title" className="what-we-do__title">
          {copy.title}
        </h2>

        <div className="what-we-do__cards" aria-live="polite">
          {visibleItems.map((item) => (
            <article key={item.id} className="what-we-do__card">
              <h3 className="what-we-do__card-title">{item.title}</h3>
              <p className="what-we-do__card-text">{item.description}</p>
            </article>
          ))}
        </div>

        <div className="what-we-do__controls">
          <button
            className="what-we-do__control"
            type="button"
            onClick={goPrev}
            disabled={!canGoPrev}
            aria-label={copy.prevLabel}
          >
            ←
          </button>
          <button
            className="what-we-do__control"
            type="button"
            onClick={goNext}
            disabled={!canGoNext}
            aria-label={copy.nextLabel}
          >
            →
          </button>
        </div>
      </div>
    </section>
  );
};
