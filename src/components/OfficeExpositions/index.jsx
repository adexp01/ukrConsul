import { useState } from "react";
import { IconButton } from "../UI/Button";
import "./style.css";

/**
 * «Українські експозиції» — по одній події за раз: знімок ліворуч,
 * номер, назва й опис праворуч. Праворуч унизу — індикатор позиції.
 */
export const OfficeExpositions = ({ copy }) => {
  const items = copy?.items ?? [];
  const [index, setIndex] = useState(0);

  if (items.length === 0) return null;

  const item = items[Math.min(index, items.length - 1)];
  const goPrev = () => setIndex((i) => Math.max(0, i - 1));
  const goNext = () => setIndex((i) => Math.min(items.length - 1, i + 1));

  return (
    <section
      className="office-expositions"
      aria-labelledby="office-expositions-title"
    >
      <div className="office-expositions__inner">
        <h2
          id="office-expositions-title"
          className="office-expositions__title"
        >
          {copy.title}
        </h2>

        <div className="office-expositions__stage">
          <div className="office-expositions__media">
            <span className="office-expositions__media-corner" aria-hidden="true" />
            <div className="office-expositions__media-frame">
              {item.image ? (
                <img src={item.image} alt="" loading="lazy" decoding="async" />
              ) : null}
            </div>
          </div>

          <div className="office-expositions__body">
            <div className="office-expositions__head">
              <span className="office-expositions__number" aria-hidden="true">
                {index + 1}
              </span>
              <h3 className="office-expositions__name">{item.title}</h3>
            </div>

            <p className="office-expositions__text">{item.description}</p>

            {items.length > 1 ? (
              <div className="office-expositions__controls">
                <IconButton
                  direction="left"
                  onClick={goPrev}
                  disabled={index === 0}
                  aria-label={copy.prevLabel}
                />
                <IconButton
                  direction="right"
                  onClick={goNext}
                  disabled={index === items.length - 1}
                  aria-label={copy.nextLabel}
                />
              </div>
            ) : null}
          </div>

          {items.length > 1 ? (
            <ol className="office-expositions__dots" aria-hidden="true">
              {items.map((entry, dotIndex) => (
                <li
                  key={entry.id ?? entry.title}
                  className={`office-expositions__dot${
                    dotIndex === index ? " is-active" : ""
                  }`}
                />
              ))}
            </ol>
          ) : null}
        </div>
      </div>
    </section>
  );
};
