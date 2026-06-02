import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLanguage } from "../../i18n/LanguageContext";
import "./style.css";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export const AnimationCards = () => {
  const { t } = useLanguage();
  const sectionRef = useRef(null);
  const titleLines = t("track.cards.title");
  const items = Array.isArray(t("track.cards.items"))
    ? t("track.cards.items")
    : [];

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;

      const title = section.querySelector(".animation-cards__title");
      const rows = gsap.utils.toArray(".animation-cards__row", section);
      if (!title || !rows.length) return;

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.set(title, { autoAlpha: 0, y: 20 });
        gsap.set(rows, { autoAlpha: 0, y: 16 });

        gsap.to(title, {
          autoAlpha: 1,
          y: 0,
          duration: 0.6,
          ease: "power2.out",
          scrollTrigger: {
            trigger: section,
            start: "top 85%",
            once: true,
          },
        });

        gsap.to(rows, {
          autoAlpha: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.08,
          ease: "power2.out",
          delay: 0.12,
          scrollTrigger: {
            trigger: section,
            start: "top 82%",
            once: true,
          },
        });
      });

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set([title, ...rows], { autoAlpha: 1, clearProps: "transform" });
      });

      return () => mm.revert();
    },
    { scope: sectionRef, dependencies: [items.length] },
  );

  return (
    <section
      ref={sectionRef}
      className="animation-cards"
      aria-labelledby="animation-cards-title"
    >
      <div className="animation-cards__glow" aria-hidden="true" />

      <div className="animation-cards__inner">
        <h2 id="animation-cards-title" className="animation-cards__title">
          {titleLines.map((line) => (
            <span key={line}>{line}</span>
          ))}
        </h2>

        <ol className="animation-cards__list">
          {items.map((item, index) => (
            <li key={item.id} className="animation-cards__row">
              <span className="animation-cards__index" aria-hidden="true">
                {index + 1}
              </span>
              <h3 className="animation-cards__row-title">{item.title}</h3>
              <p className="animation-cards__row-text">{item.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
};
