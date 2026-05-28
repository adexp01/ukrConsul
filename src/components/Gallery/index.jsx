import { useMemo, useState } from "react";
import { useLanguage } from "../../i18n/LanguageContext";
import arrow from "../../assets/arrow.svg";
import "./style.css";

const SLIDE_MEDIA = [
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&q=80",
    thumb:
      "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: 2,
    image:
      "https://images.unsplash.com/photo-1473968512647-3e447244af8f?auto=format&fit=crop&w=1200&q=80",
    thumb:
      "https://images.unsplash.com/photo-1581092160562-40aa08ad7881?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: 3,
    image:
      "https://images.unsplash.com/photo-1581092160562-40aa08ad7881?auto=format&fit=crop&w=1200&q=80",
    thumb:
      "https://images.unsplash.com/photo-1581092918056-0c4c3acd378e?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: 4,
    image:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80",
    thumb:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: 5,
    image:
      "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&q=80",
    thumb:
      "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=400&q=80",
  },
];

export const Gallery = () => {
  const { t, language } = useLanguage();
  const [activeIndex, setActiveIndex] = useState(0);

  const slides = useMemo(() => {
    const copy = t("gallery.slides");
    return SLIDE_MEDIA.map((media, index) => ({
      ...media,
      ...copy[index],
    }));
  }, [t, language]);

  const slide = slides[activeIndex];
  const prevIndex = (activeIndex - 1 + slides.length) % slides.length;
  const headingLines = t("gallery.heading");

  const goTo = (index) => setActiveIndex(index);
  const goPrev = () => goTo(prevIndex);
  const goNext = () => goTo((activeIndex + 1) % slides.length);

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
              <img src={slide.image} alt={slide.title} />
            </div>
          </div>

          <div className="gallery-section__content">
            <div className="gallery-section__content-head">
              <span className="gallery-section__index">{slide.id}</span>
              <h3 className="gallery-section__title">{slide.title}</h3>
            </div>

            <p className="gallery-section__desc">{slide.description}</p>

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
