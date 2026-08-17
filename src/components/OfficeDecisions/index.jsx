import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "../../animation/gsapSetup";
import { useCarousel } from "../../hooks/useCarousel";
import { useLanguage } from "../../i18n/LanguageContext";
import { NavArrows } from "../UI/Button";
import "./style.css";
import g11 from "../../assets/g11.png";

const VISIBLE_CARDS = 3;

const CheckIcon = () => (
  <img
    className="office-decisions__check"
    src={g11}
    alt=""
    loading="lazy"
    decoding="async"
    aria-hidden="true"
  />
);

export const OfficeDecisions = ({ copyKey = "office.decisions" }) => {
  const { t } = useLanguage();
  const copy = t(copyKey);
  const sectionRef = useRef(null);
  const { items, visibleItems, goPrev, goNext, isFirst, isLast } = useCarousel(
    copy.items,
    VISIBLE_CARDS,
  );

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return undefined;

      const header = section.querySelector(".office-decisions__header");
      const label = section.querySelector(".office-decisions__label");
      const cards = gsap.utils.toArray(".office-decisions__card", section);
      const nav = section.querySelector(".office-decisions__nav");

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.set([header, label, nav, ...cards].filter(Boolean), {
          autoAlpha: 0,
          y: 24,
        });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top 78%",
            once: true,
          },
        });

        tl.to(header, {
          autoAlpha: 1,
          y: 0,
          duration: 0.5,
          ease: "power2.out",
        })
          .to(
            label,
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.42,
              ease: "power2.out",
            },
            "-=0.18",
          )
          .to(
            cards,
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.48,
              stagger: 0.08,
              ease: "power2.out",
            },
            "-=0.16",
          )
          .to(
            nav,
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.35,
              ease: "power2.out",
            },
            "-=0.22",
          );

        return () => {
          tl.scrollTrigger?.kill();
          tl.kill();
        };
      });

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set([header, label, nav, ...cards].filter(Boolean), {
          autoAlpha: 1,
          y: 0,
        });
      });

      return () => mm.revert();
    },
    // Довжина списку, а не вікно: інакше поява прогрувалась заново на кожен клік
    { scope: sectionRef, dependencies: [items.length] },
  );

  if (items.length === 0) return null;

  return (
    <section
      ref={sectionRef}
      className="office-decisions"
      aria-labelledby="office-decisions-title"
    >
      <div className="office-decisions__inner">
        <header className="office-decisions__header">
          <h2 id="office-decisions-title" className="office-decisions__title">
            {copy.title}
          </h2>
          <p className="office-decisions__description">{copy.description}</p>
        </header>

        <p className="office-decisions__label">
          <span aria-hidden="true" />
          {copy.label}
        </p>

        <div className="office-decisions__grid">
          {visibleItems.map((item) => (
            <article key={item.id} className="office-decisions__card">
              <CheckIcon />
              <p>{item.text}</p>
            </article>
          ))}
        </div>

        <NavArrows
          className="office-decisions__nav"
          variant="outline"
          prevLabel={copy.prevLabel}
          nextLabel={copy.nextLabel}
          prevDisabled={isFirst}
          nextDisabled={isLast}
          onPrev={goPrev}
          onNext={goNext}
        />
      </div>
    </section>
  );
};
