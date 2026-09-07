import { useCallback, useLayoutEffect, useMemo, useRef } from "react";
import { useLanguage } from "../../i18n/LanguageContext";
import { PARTNERS } from "./logos";
import "./style.css";

/*
 * Скільки разів дублюємо ряд усередині доріжки. Три копії — щоб під час
 * перемотування на ширину однієї копії наступна вже стояла на екрані.
 */
const MARQUEE_COPIES = 3;

/*
 * Крок анімації — це відстань між однаковими картками сусідніх копій.
 *
 * Раніше тут була ширина самої смуги, і між копіями лишалась щілина завширшки
 * з проміжок між картками: на кожному оберті стрічка помітно смикалась.
 * Різниця offsetLeft двох копій уже враховує і ширину, і проміжок.
 */
const setMarqueeShift = (track) => {
  if (!track) return;

  const strips = track.querySelectorAll(".partners__strip");
  if (strips.length < 2) return;

  const shift = strips[1].offsetLeft - strips[0].offsetLeft;
  if (shift > 0) track.style.setProperty("--marquee-shift", `${shift}px`);
};

export const Parnters = ({
  titleKey = "track.partners.title",
  description,
}) => {
  const { t } = useLanguage();
  const title = t(titleKey);
  const topTrackRef = useRef(null);
  const bottomTrackRef = useRef(null);

  // Парні позиції — у верхній ряд, непарні — у нижній: групи не збиваються докупи
  const rows = useMemo(
    () => [
      PARTNERS.filter((_, index) => index % 2 === 0),
      PARTNERS.filter((_, index) => index % 2 === 1),
    ],
    [],
  );

  // Перерахунок кроку доступний і ззовні ефекту — по ньому б'ють onLoad картинок
  const updateShift = useCallback(() => {
    [topTrackRef.current, bottomTrackRef.current]
      .filter(Boolean)
      .forEach(setMarqueeShift);
  }, []);

  useLayoutEffect(() => {
    const tracks = [topTrackRef.current, bottomTrackRef.current].filter(
      Boolean,
    );
    if (!tracks.length) return;

    const update = () => {
      tracks.forEach(setMarqueeShift);
    };

    update();

    const observer = new ResizeObserver(update);
    tracks.forEach((track) => observer.observe(track));

    window.addEventListener("load", update);

    return () => {
      observer.disconnect();
      window.removeEventListener("load", update);
    };
  }, []);

  const renderRow = (items, trackRef, direction) => (
    <div className="partners__marquee">
      <div
        ref={trackRef}
        className={`partners__track partners__track--${direction}`}
      >
        {Array.from({ length: MARQUEE_COPIES }, (_, copy) => (
          <div
            key={`${direction}-${copy}`}
            className="partners__strip"
            aria-hidden={copy > 0}
          >
            {items.map((partner) => (
              <img
                key={partner.name}
                src={partner.src}
                /* Копії — та сама стрічка ще раз, читати їх голосом не треба */
                alt={copy === 0 ? partner.name : ""}
                className="partners__logo"
                /*
                 * Розміри проставлені атрибутами навмисно: висота картки
                 * задана в CSS, а ширину браузер має знати ще до того, як
                 * файл прийде. Без цього перша копія ряду під час завантаження
                 * має нульову ширину — і крок анімації рахувався по порожній
                 * доріжці, тобто стрічка стрибала.
                 */
                width={324}
                height={280}
                draggable={false}
                decoding="async"
                loading={copy === 0 ? "eager" : "lazy"}
                onLoad={updateShift}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <section className="partners" aria-labelledby="partners-title">
      <div className="partners__inner">
        <h2 id="partners-title" className="partners__title">
          {title}
        </h2>

        {description ? <p className="partners__lead">{description}</p> : null}

        <div className="partners__rows">
          {renderRow(rows[0], topTrackRef, "left")}
          {renderRow(rows[1], bottomTrackRef, "right")}
        </div>
      </div>
    </section>
  );
};
