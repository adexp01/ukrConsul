import { useRef } from "react";
import { useDialSection } from "../../animation/useDialSection";
import { useLanguage } from "../../i18n/LanguageContext";
import clockArt from "../../assets/test111.svg";
import "./style.css";

/*
 * «Офіс підтримки експорту»: піновий циферблат із трьома напрямами роботи.
 * Сам рух — у useDialSection, спільному з блоком «Над чим працюємо».
 */
const ITEM_DIM = "rgba(255, 255, 255, 0.38)";

export const Clock = () => {
  const { t } = useLanguage();
  const copy = t("office.clock");
  const sectionRef = useRef(null);
  const pinRef = useRef(null);
  const featuresRef = useRef(null);
  const itemsViewportRef = useRef(null);
  const itemsTrackRef = useRef(null);

  useDialSection({
    prefix: "clock",
    itemDim: ITEM_DIM,
    introTextSelector: ".clock__hero .clock__text",
    introTextStagger: 0.12,
    refs: {
      section: sectionRef,
      pin: pinRef,
      stage: featuresRef,
      viewport: itemsViewportRef,
      track: itemsTrackRef,
    },
    dependencies: [copy.title, copy.columns, copy.items],
  });

  return (
    <section ref={sectionRef} className="clock" aria-labelledby="clock-title">
      <div className="clock__backdrop" aria-hidden="true" />
      <div className="clock__glow" aria-hidden="true" />

      <div className="clock__inner">
        <div className="clock__hero">
          <h2 id="clock-title" className="clock__title">
            {copy.title.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </h2>

          <div className="clock__columns">
            {copy.columns.map((text) => (
              <p key={text} className="clock__text">
                {text}
              </p>
            ))}
          </div>
        </div>

        <div ref={pinRef} className="clock__features-pin">
          <div
            ref={featuresRef}
            className="clock__features"
            aria-labelledby="clock-features-title"
          >
            <div className="clock__dial-stage">
              <p id="clock-features-title" className="clock__dial-label">
                {copy.dialLabel.map((line) => (
                  <span key={line}>{line}</span>
                ))}
              </p>

              <div className="clock__dial" aria-hidden="true">
                <img
                  className="clock__dial-art"
                  src={clockArt}
                  alt=""
                  loading="lazy"
                  decoding="async"
                />
                <div className="clock__dial-marker" />
              </div>
            </div>

            <div
              ref={itemsViewportRef}
              className="clock__items-viewport"
              aria-live="polite"
            >
              <ul ref={itemsTrackRef} className="clock__items-track">
                {copy.items.map((text, index) => (
                  <li key={`${index}-${text}`} className="clock__item">
                    {text}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
