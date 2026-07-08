import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLanguage } from "../../i18n/LanguageContext";
import "./style.css";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export const ExportMap = () => {
  const { t } = useLanguage();
  const copy = t("office.exportMap");
  const sectionRef = useRef(null);
  const headRef = useRef(null);
  const lineRef = useRef(null);
  const accentRef = useRef(null);
  const leftCardRef = useRef(null);
  const rightCardRef = useRef(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      const head = headRef.current;
      const line = lineRef.current;
      const accent = accentRef.current;
      const leftCard = leftCardRef.current;
      const rightCard = rightCardRef.current;

      if (!section || !head || !leftCard || !rightCard) return undefined;

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.set(head, { autoAlpha: 0, y: 24 });
        gsap.set([leftCard, rightCard], { autoAlpha: 0, y: 24 });

        if (line) {
          gsap.set(line, {
            autoAlpha: 0,
            clipPath: "inset(0 100% 0 0)",
          });
        }

        if (accent) {
          gsap.set(accent, { autoAlpha: 0, scaleX: 0, transformOrigin: "left center" });
        }

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top 76%",
            once: true,
          },
        });

        tl.to(head, {
          autoAlpha: 1,
          y: 0,
          duration: 0.55,
          ease: "power2.out",
        });

        if (line) {
          tl.to(
            line,
            {
              autoAlpha: 1,
              clipPath: "inset(0 0% 0 0)",
              duration: 0.85,
              ease: "power2.inOut",
            },
            "-=0.18",
          );
        }

        if (accent) {
          tl.to(
            accent,
            {
              autoAlpha: 1,
              scaleX: 1,
              duration: 0.28,
              ease: "power2.out",
            },
            "-=0.42",
          );
        }

        tl.to(
          rightCard,
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.48,
            ease: "power2.out",
          },
          "-=0.08",
        ).to(
          leftCard,
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.48,
            ease: "power2.out",
          },
          "-=0.24",
        );

        return () => {
          tl.scrollTrigger?.kill();
          tl.kill();
        };
      });

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set([head, line, accent, leftCard, rightCard], {
          autoAlpha: 1,
          y: 0,
          clearProps: "clipPath,scaleX",
        });
      });

      return () => mm.revert();
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      className="export-map"
      aria-labelledby="export-map-title"
    >
      <div className="export-map__inner">
        <header ref={headRef} className="export-map__head">
          <h2 id="export-map-title" className="export-map__title">
            {copy.title}
          </h2>
          <p className="export-map__description">{copy.description}</p>
        </header>

        <div className="export-map__stage">
          <div ref={lineRef} className="export-map__line" aria-hidden="true">
            <span ref={accentRef} className="export-map__line-accent" />
          </div>

          <article
            ref={leftCardRef}
            className="export-map__card export-map__card--left"
          >
            <p>{copy.cardLeft}</p>
          </article>

          <article
            ref={rightCardRef}
            className="export-map__card export-map__card--right"
          >
            <p>{copy.cardRight}</p>
          </article>
        </div>
      </div>
    </section>
  );
};
