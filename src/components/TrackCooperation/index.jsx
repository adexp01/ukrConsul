import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import shield from "../../assets/shield.png";
import { useLanguage } from "../../i18n/LanguageContext";
import "./style.css";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export const TrackCooperation = () => {
  const { t } = useLanguage();
  const sectionRef = useRef(null);
  const text = t("track.cooperation.text");

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.from(section, {
          autoAlpha: 0,
          y: 32,
          duration: 0.7,
          ease: "power2.out",
          scrollTrigger: {
            trigger: section,
            start: "top 88%",
            once: true,
          },
        });
      });

      return () => mm.revert();
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      className="track-cooperation"
      aria-label={text}
    >
      <div className="track-cooperation__inner">
        <article className="track-cooperation__card">
          <div className="track-cooperation__media" aria-hidden="true">
            <div className="track-cooperation__glow" />
            <img
              src={shield}
              alt=""
              className="track-cooperation__shield"
              width={200}
              height={200}
              loading="lazy"
              decoding="async"
            />
          </div>

          <p className="track-cooperation__text">{text}</p>
        </article>
      </div>
    </section>
  );
};
