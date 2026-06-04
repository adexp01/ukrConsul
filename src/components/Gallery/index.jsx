import { useEffect, useMemo, useState } from "react";
import { useLanguage } from "../../i18n/LanguageContext";
import arrow from "../../assets/arrow.svg";
import "./style.css";
import f1 from "../../assets/f1.png";
import f2 from "../../assets/f2.png";
import f3 from "../../assets/f3.png";
import f4 from "../../assets/f4.png";
import f5 from "../../assets/f5.png";
import f6 from "../../assets/f6.png";
import f7 from "../../assets/f7.png";

const PHOTO_TRANSITION_MS = 560;

const SLIDE_MEDIA = [
  {
    id: 1,
    image: f1,
    thumb: f1,
  },
  {
    id: 2,
    image: f2,
    thumb: f2,
  },
  {
    id: 3,
    image: f3,
    thumb: f3,
  },
  {
    id: 4,
    image: f4,
    thumb: f4,
  },
  {
    id: 5,
    image: f5,
    thumb: f5,
  },
  {
    id: 6,
    image: f6,
    thumb: f6,
  },
  {
    id: 7,
    image: f7,
    thumb: f7,
  },
];

export const Gallery = () => {
  const { t, language } = useLanguage();
  const [activeIndex, setActiveIndex] = useState(0);
  const [leavingIndex, setLeavingIndex] = useState(null);

  const slides = useMemo(() => {
    const copy = t("gallery.slides");
    return SLIDE_MEDIA.map((media, index) => {
      const slideCopy = copy[index] ?? copy[copy.length - 1];
      const descriptionLines = Array.isArray(slideCopy.descriptionLines)
        ? slideCopy.descriptionLines
        : [slideCopy.description];

      return {
        ...media,
        ...slideCopy,
        descriptionLines,
        titleLines: Array.isArray(slideCopy.titleLines)
          ? slideCopy.titleLines
          : null,
      };
    });
  }, [t, language]);

  const slide = slides[activeIndex];
  const prevIndex = (activeIndex - 1 + slides.length) % slides.length;
  const headingLines = t("gallery.heading");

  useEffect(() => {
    if (leavingIndex === null) return undefined;
    const timer = window.setTimeout(
      () => setLeavingIndex(null),
      PHOTO_TRANSITION_MS,
    );
    return () => window.clearTimeout(timer);
  }, [leavingIndex]);

  const goTo = (index) => {
    if (index === activeIndex) return;
    setLeavingIndex(activeIndex);
    setActiveIndex(index);
  };

  const goPrev = () => goTo(prevIndex);
  const goNext = () => goTo((activeIndex + 1) % slides.length);
  const isPhotoTransitioning = leavingIndex !== null;

  return (
    <section className="gallery-section" aria-label="Projects gallery">
      <div className="gallery-section__inner">
        <h2 className="gallery-section__heading">
          {headingLines.map((line) => (
            <span key={line}>{line}</span>
          ))}
        </h2>

        <div className="gallery-section__slider">
          <div className="gallery-photo">
            <button
              type="button"
              className="gallery-section__thumb"
              onClick={goPrev}
              aria-label={t("gallery.prevProject")}
            >
              <img src={slides[prevIndex].thumb} alt="" />
            </button>

            <div className="gallery-section__main">
              {isPhotoTransitioning ? (
                <img
                  key={`leave-${leavingIndex}`}
                  className="gallery-section__main-img gallery-section__main-img--leave"
                  src={slides[leavingIndex].image}
                  alt=""
                  aria-hidden="true"
                />
              ) : null}
              <img
                key={`active-${activeIndex}`}
                className={`gallery-section__main-img${
                  isPhotoTransitioning
                    ? " gallery-section__main-img--enter"
                    : ""
                }`}
                src={slide.image}
                alt={slide.title}
              />
            </div>
          </div>

          <div
            className={`gallery-section__content gallery-section__content--slide-${slide.id}`}
          >
            <div className="gallery-section__content-head">
              <span className="gallery-section__index">{slide.id}</span>
              <h3 className="gallery-section__title">
                <span className="gallery-section__title-text gallery-section__title--desktop">
                  {slide.title}
                </span>
                {slide.titleLines ? (
                  <span className="gallery-section__title-lines gallery-section__title--mobile">
                    {slide.titleLines.map((line) => (
                      <span key={line}>{line}</span>
                    ))}
                  </span>
                ) : null}
              </h3>
            </div>

            <p className="gallery-section__desc gallery-section__desc--desktop">
              {slide.description}
            </p>

            <div className="gallery-section__desc-lines gallery-section__desc--mobile">
              {slide.descriptionLines.map((line) => (
                <span key={line}>{line}</span>
              ))}
            </div>

            <a href="#" className="gallery-section__link">
              {t("gallery.discover")}
              <span aria-hidden="true">→</span>
            </a>

            <div className="gallery-section__nav">
              <button
                type="button"
                className="gallery-section__nav-btn gallery-section__nav-btn--prev"
                onClick={goPrev}
                aria-label={t("gallery.prevSlide")}
              >
                <img src={arrow} alt="" aria-hidden="true" />
              </button>
              <button
                type="button"
                className="gallery-section__nav-btn gallery-section__nav-btn--next"
                onClick={goNext}
                aria-label={t("gallery.nextSlide")}
              >
                <img src={arrow} alt="" aria-hidden="true" />
              </button>
            </div>
          </div>

          <div
            className="gallery-section__pagination"
            role="tablist"
            aria-label="Gallery slides"
          >
            {slides.map((item, index) => (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={index === activeIndex}
                aria-label={`Slide ${item.id}`}
                className={`gallery-section__pagination-item${
                  index === activeIndex
                    ? " gallery-section__pagination-item--active"
                    : ""
                }`}
                onClick={() => goTo(index)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
