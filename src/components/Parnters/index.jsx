import { useLayoutEffect, useRef } from "react";
import { useLanguage } from "../../i18n/LanguageContext";
import partnersRow1 from "../../assets/comm1.png";
import partnersRow2 from "../../assets/comm2.png";
import "./style.css";

const MARQUEE_COPIES = 3;

const setMarqueeShift = (track) => {
  if (!track) return;
  const strip = track.querySelector(".partners__strip");
  if (!strip) return;
  track.style.setProperty("--marquee-shift", `${strip.offsetWidth}px`);
};

export const Parnters = () => {
  const { t } = useLanguage();
  const title = t("track.partners.title");
  const topTrackRef = useRef(null);
  const bottomTrackRef = useRef(null);

  useLayoutEffect(() => {
    const tracks = [topTrackRef.current, bottomTrackRef.current].filter(Boolean);
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

  const renderRow = (src, aspectClass, trackRef, direction) => (
    <div className="partners__marquee">
      <div
        ref={trackRef}
        className={`partners__track partners__track--${direction}`}
      >
        {Array.from({ length: MARQUEE_COPIES }, (_, index) => (
          <img
            key={`${direction}-${index}`}
            src={src}
            alt=""
            className={`partners__strip ${aspectClass}`}
            draggable={false}
            loading={index === 0 ? "lazy" : undefined}
            decoding="async"
            aria-hidden={index > 0}
          />
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

        <div className="partners__rows">
          {renderRow(partnersRow1, "partners__strip--row1", topTrackRef, "left")}
          {renderRow(
            partnersRow2,
            "partners__strip--row2",
            bottomTrackRef,
            "right",
          )}
        </div>
      </div>
    </section>
  );
};
