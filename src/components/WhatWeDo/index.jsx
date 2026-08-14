import { useEffect, useRef, useState } from "react";
import { useLanguage } from "../../i18n/LanguageContext";
import "./style.css";

// На вузьких екранах картка одна на весь екран — інакше стрілки
// впирались би в межу і до останніх напрямів було б не дійти
const WIDE_SCREEN = "(min-width: 901px)";
const CARDS_PER_VIEW_WIDE = 3;

const usePerView = () => {
  const [perView, setPerView] = useState(() =>
    typeof window === "undefined" || window.matchMedia(WIDE_SCREEN).matches
      ? CARDS_PER_VIEW_WIDE
      : 1,
  );

  useEffect(() => {
    const query = window.matchMedia(WIDE_SCREEN);
    const sync = () => setPerView(query.matches ? CARDS_PER_VIEW_WIDE : 1);

    sync();
    query.addEventListener("change", sync);

    return () => query.removeEventListener("change", sync);
  }, []);

  return perView;
};

export const WhatWeDo = ({ contentKey = "aboutUsPage.whatWeDo" }) => {
  const { t } = useLanguage();
  const copy = t(contentKey);
  const items = copy.items ?? [];
  const itemCount = items.length;

  const sectionRef = useRef(null);
  const perView = usePerView();
  const [startIndex, setStartIndex] = useState(0);

  const maxStartIndex = Math.max(0, itemCount - perView);
  // Після зміни ширини екрана крайня позиція може стати меншою
  const offset = Math.min(startIndex, maxStartIndex);
  const canGoPrev = offset > 0;
  const canGoNext = offset < maxStartIndex;

  const goPrev = () => setStartIndex(Math.max(0, offset - 1));
  const goNext = () => setStartIndex(Math.min(maxStartIndex, offset + 1));

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

        {/*
          Показуємо всі картки й зсуваємо доріжку трансформом — так перехід
          між напрямами анімується. Раніше масив різався по startIndex,
          і картки просто підмінялись без переходу.
        */}
        <div className="what-we-do__viewport">
          <div
            className="what-we-do__cards"
            style={{ "--offset": offset, "--per-view": perView }}
          >
            {items.map((item, index) => {
              const isVisible = index >= offset && index < offset + perView;

              return (
                <article
                  key={item.id}
                  className="what-we-do__card"
                  aria-hidden={isVisible ? undefined : true}
                >
                  <h3 className="what-we-do__card-title">{item.title}</h3>
                  <p className="what-we-do__card-text">{item.description}</p>
                </article>
              );
            })}
          </div>
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
