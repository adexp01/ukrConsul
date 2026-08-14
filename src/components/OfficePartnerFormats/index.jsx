import { useEffect, useState } from "react";
import { IconButton } from "../UI/Button";
import "./style.css";

const WIDE_SCREEN = "(min-width: 901px)";
const CARDS_PER_VIEW_WIDE = 3;

/**
 * «Формати партнерства» — карусель карток. Доріжка їде трансформом,
 * ширина картки й крок рахуються з однієї величини (див. style.css).
 */
export const OfficePartnerFormats = ({ copy }) => {
  const items = copy?.items ?? [];
  const [perView, setPerView] = useState(CARDS_PER_VIEW_WIDE);
  const [startIndex, setStartIndex] = useState(0);

  useEffect(() => {
    const query = window.matchMedia(WIDE_SCREEN);
    const sync = () => setPerView(query.matches ? CARDS_PER_VIEW_WIDE : 1);

    sync();
    query.addEventListener("change", sync);

    return () => query.removeEventListener("change", sync);
  }, []);

  if (items.length === 0) return null;

  const maxStartIndex = Math.max(0, items.length - perView);
  const offset = Math.min(startIndex, maxStartIndex);

  return (
    <section
      className="partner-formats"
      aria-labelledby="partner-formats-title"
    >
      <div className="partner-formats__inner">
        <h2 id="partner-formats-title" className="partner-formats__title">
          {(copy.title ?? []).map((line) => (
            <span key={line}>{line}</span>
          ))}
        </h2>

        <div className="partner-formats__viewport">
          <div
            className="partner-formats__track"
            style={{ "--offset": offset, "--per-view": perView }}
          >
            {items.map((item, index) => {
              const isVisible = index >= offset && index < offset + perView;

              return (
                <article
                  key={item.id}
                  className="partner-formats__card"
                  aria-hidden={isVisible ? undefined : true}
                >
                  <h3 className="partner-formats__card-title">{item.title}</h3>
                  <p className="partner-formats__card-text">{item.description}</p>

                  {item.linkLabel ? (
                    <a
                      className="partner-formats__link"
                      href={item.href}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {item.linkLabel}
                      <span aria-hidden="true">↗</span>
                    </a>
                  ) : null}
                </article>
              );
            })}
          </div>
        </div>

        <div className="partner-formats__controls">
          <IconButton
            direction="left"
            onClick={() => setStartIndex(Math.max(0, offset - 1))}
            disabled={offset === 0}
            aria-label={copy.prevLabel}
          />
          <IconButton
            direction="right"
            onClick={() => setStartIndex(Math.min(maxStartIndex, offset + 1))}
            disabled={offset >= maxStartIndex}
            aria-label={copy.nextLabel}
          />
        </div>
      </div>
    </section>
  );
};
