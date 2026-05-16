import { useState } from "react";
import "./style.css";

const SLIDES = [
  {
    id: 1,
    title: "Zbroya Expo",
    description:
      "We ensure the systematic presence of Ukrainian defense industry manufacturers at key international exhibitions under the ZBROYA brand. We coordinate the participation of companies, organize stands, and support exhibitions at all stages.",
    image:
      "https://images.unsplash.com/photo-1581092918056-0c4c3acd378e?auto=format&fit=crop&w=1200&q=80",
    thumb:
      "https://images.unsplash.com/photo-1473968512647-3e447244af8f?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: 2,
    title: "Defence Innovation",
    description:
      "We ensure the systematic presence of Ukrainian defense industry manufacturers at key international exhibitions under the ZBROYA brand. We coordinate the participation of companies, organize stands, and support exhibitions at all stages.",
    image:
      "https://images.unsplash.com/photo-1473968512647-3e447244af8f?auto=format&fit=crop&w=1200&q=80",
    thumb:
      "https://images.unsplash.com/photo-1581092160562-40aa08ad7881?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: 3,
    title: "UAV Systems",
    description:
      "We ensure the systematic presence of Ukrainian defense industry manufacturers at key international exhibitions under the ZBROYA brand. We coordinate the participation of companies, organize stands, and support exhibitions at all stages.",
    image:
      "https://images.unsplash.com/photo-1581092160562-40aa08ad7881?auto=format&fit=crop&w=1200&q=80",
    thumb:
      "https://images.unsplash.com/photo-1581092918056-0c4c3acd378e?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: 4,
    title: "Industry Forum",
    description:
      "We ensure the systematic presence of Ukrainian defense industry manufacturers at key international exhibitions under the ZBROYA brand. We coordinate the participation of companies, organize stands, and support exhibitions at all stages.",
    image:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80",
    thumb:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=400&q=80",
  },
  {
    id: 5,
    title: "Maritime Defence",
    description:
      "We ensure the systematic presence of Ukrainian defense industry manufacturers at key international exhibitions under the ZBROYA brand. We coordinate the participation of companies, organize stands, and support exhibitions at all stages.",
    image:
      "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&q=80",
    thumb:
      "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=400&q=80",
  },
];

export const Gallery = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const slide = SLIDES[activeIndex];
  const prevIndex = (activeIndex - 1 + SLIDES.length) % SLIDES.length;

  const goTo = (index) => setActiveIndex(index);
  const goPrev = () => goTo(prevIndex);
  const goNext = () => goTo((activeIndex + 1) % SLIDES.length);

  return (
    <section className="gallery-section" aria-label="Projects gallery">
      <div className="gallery-section__inner">
        <h2 className="gallery-section__heading">
          <span>ACROSS THE FULL</span>
          <span>SPECTRUM OF</span>
          <span>DEFENCE</span>
          <span>INNOVATION</span>
        </h2>

        <div className="gallery-section__slider">
          <div className="gallery-photo">
            <button
              type="button"
              className="gallery-section__thumb"
              onClick={goPrev}
              aria-label="Previous project"
            >
              <img src={SLIDES[prevIndex].thumb} alt="" />
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
              Discover the project
              <span aria-hidden="true">→</span>
            </a>

            <div className="gallery-section__nav">
              <button
                type="button"
                className="gallery-section__nav-btn gallery-section__nav-btn--prev"
                onClick={goPrev}
                aria-label="Previous slide"
              >
                ←
              </button>
              <button
                type="button"
                className="gallery-section__nav-btn gallery-section__nav-btn--next"
                onClick={goNext}
                aria-label="Next slide"
              >
                →
              </button>
            </div>
          </div>

          <div
            className="gallery-section__pagination"
            role="tablist"
            aria-label="Gallery slides"
          >
            {SLIDES.map((item, index) => (
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
