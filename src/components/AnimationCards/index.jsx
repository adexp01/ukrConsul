import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "../../animation/gsapSetup";
import { useCarousel } from "../../hooks/useCarousel";
import { useLanguage } from "../../i18n/LanguageContext";
import { NavArrows } from "../UI/Button";
import "./style.css";
import m111 from "../../assets/m111.png";
import m112 from "../../assets/m112.png";
import m113 from "../../assets/m113.png";
import m114 from "../../assets/m114.png";
import m115 from "../../assets/m115.png";

const iconMap = {
  diamond: m111,
  eagle: m112,
  links: m113,
  zigzag: m114,
  cross: m115,
};

const VISIBLE_CARDS = 3;

export const AnimationCards = () => {
  const { t } = useLanguage();
  const sectionRef = useRef(null);
  const titleLines = t("track.cards.title");
  const { items, visibleItems, goPrev, goNext, isFirst, isLast } = useCarousel(
    t("track.cards.items"),
    VISIBLE_CARDS,
  );

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;

      const cards = gsap.utils.toArray(".animation-cards__card", section);
      const nav = section.querySelector(".animation-cards__nav");
      if (!cards.length) return;

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.set(cards, { autoAlpha: 0, y: 18 });
        if (nav) gsap.set(nav, { autoAlpha: 0, y: 10 });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top 82%",
            once: true,
          },
        });

        tl.to(cards, {
          autoAlpha: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.08,
          ease: "power2.out",
        });

        if (nav) {
          tl.to(
            nav,
            { autoAlpha: 1, y: 0, duration: 0.35, ease: "power2.out" },
            "-=0.2",
          );
        }
      });

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set([cards, nav].filter(Boolean), {
          autoAlpha: 1,
          clearProps: "transform",
        });
      });

      return () => mm.revert();
    },
    /*
     * Залежність від довжини списку, а не від видимого вікна: раніше тут стояв
     * visibleItems — новий масив на кожен клік по стрілці, тому useGSAP щоразу
     * реверти́в анімацію й програвав появу заново, і картки блимали.
     */
    { scope: sectionRef, dependencies: [items.length] },
  );

  if (items.length === 0) return null;

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

        <div className="animation-cards__grid">
          {visibleItems.map((item) => (
            <article key={item.id} className="animation-cards__card">
              <img
                src={iconMap[item.icon]}
                alt=""
                className="animation-cards__icon"
                loading="lazy"
                decoding="async"
              />
              <h3 className="animation-cards__card-title">{item.title}</h3>
              <p className="animation-cards__card-text">{item.text}</p>
            </article>
          ))}
        </div>

        <NavArrows
          className="animation-cards__nav"
          variant="outline"
          onPrev={goPrev}
          onNext={goNext}
          prevLabel={t("gallery.prevSlide")}
          nextLabel={t("gallery.nextSlide")}
          prevDisabled={isFirst}
          nextDisabled={isLast}
        />
      </div>
    </section>
  );
};
