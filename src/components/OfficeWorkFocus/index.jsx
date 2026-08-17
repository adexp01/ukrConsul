import { useRef } from "react";
import { useDialSection } from "../../animation/useDialSection";
import { useLanguage } from "../../i18n/LanguageContext";
import dialArt from "../../assets/test111.svg";
import "./style.css";

/*
 * «Над чим працюємо»: піновий циферблат із напрямами GR-роботи.
 * Сам рух — у useDialSection, спільному з блоком «Офіс підтримки експорту».
 */
const ITEM_DIM = "rgba(255, 255, 255, 0.24)";

export const OfficeWorkFocus = ({ copyKey = "office.workFocus" }) => {
  const { t } = useLanguage();
  const copy = t(copyKey);
  const sectionRef = useRef(null);
  const pinRef = useRef(null);
  const featuresRef = useRef(null);
  const itemsViewportRef = useRef(null);
  const itemsTrackRef = useRef(null);

  useDialSection({
    prefix: "office-work-focus",
    itemDim: ITEM_DIM,
    introTextSelector: ".office-work-focus__description",
    refs: {
      section: sectionRef,
      pin: pinRef,
      stage: featuresRef,
      viewport: itemsViewportRef,
      track: itemsTrackRef,
    },
    dependencies: [copyKey, copy.items],
  });

  return (
    <section
      ref={sectionRef}
      className="office-work-focus"
      aria-labelledby="office-work-focus-title"
    >
      <div className="office-work-focus__inner">
        <header className="office-work-focus__intro">
          <h2 id="office-work-focus-title" className="office-work-focus__title">
            {copy.title}
          </h2>
          <p className="office-work-focus__description">{copy.description}</p>
        </header>

        <div ref={pinRef} className="office-work-focus__features-pin">
          <div
            ref={featuresRef}
            className="office-work-focus__content"
            aria-labelledby="office-work-focus-dial-title"
          >
            <div className="office-work-focus__dial-wrap">
              <p
                id="office-work-focus-dial-title"
                className="office-work-focus__dial-label"
              >
                {copy.dialLabel.map((line) => (
                  <span key={line}>{line}</span>
                ))}
              </p>

              <div className="office-work-focus__dial" aria-hidden="true">
                <img
                  className="office-work-focus__dial-art"
                  src={dialArt}
                  alt=""
                  loading="lazy"
                  decoding="async"
                />
                <div className="office-work-focus__dial-marker" />
              </div>
            </div>

            <div
              ref={itemsViewportRef}
              className="office-work-focus__items-viewport"
              aria-live="polite"
            >
              <ul ref={itemsTrackRef} className="office-work-focus__items">
                {/*
                  Ключ по індексу, а не по тексту: у локалях третій пункт поки
                  дублює другий, і однакові ключі ламали б React.
                */}
                {copy.items.map((item, index) => (
                  <li
                    key={`${index}-${item}`}
                    className="office-work-focus__item"
                  >
                    {item}
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
