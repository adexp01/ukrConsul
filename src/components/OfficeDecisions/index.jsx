import { useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLanguage } from "../../i18n/LanguageContext";
import { NavArrows } from "../UI/Button";
import "./style.css";
import g11 from "../../assets/g11.png";

gsap.registerPlugin(ScrollTrigger, useGSAP);

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
  const items = Array.isArray(copy.items) ? copy.items : [];
  const maxStartIndex = Math.max(0, items.length - VISIBLE_CARDS);
  const [startIndex, setStartIndex] = useState(0);

  const visibleItems = useMemo(
    () => items.slice(startIndex, startIndex + VISIBLE_CARDS),
    [items, startIndex],
  );

  const goPrev = () => {
    setStartIndex((currentIndex) => Math.max(0, currentIndex - 1));
  };

  const goNext = () => {
    setStartIndex((currentIndex) => Math.min(maxStartIndex, currentIndex + 1));
  };

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
    { scope: sectionRef, dependencies: [visibleItems] },
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
          prevDisabled={startIndex === 0}
          nextDisabled={startIndex >= maxStartIndex}
          onPrev={goPrev}
          onNext={goNext}
        />
      </div>
    </section>
  );
};
