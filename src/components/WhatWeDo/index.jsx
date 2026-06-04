import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLanguage } from "../../i18n/LanguageContext";
import { WhatWeDoIcon } from "./icons";
import "./style.css";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const STEP_SCROLL_VH = 0.52;

export const WhatWeDo = ({ contentKey = "aboutUsPage.whatWeDo" }) => {
  const { t, language } = useLanguage();
  const copy = t(contentKey);
  const items = copy.items ?? [];
  const itemCount = items.length;

  const sectionRef = useRef(null);
  const pinWrapRef = useRef(null);
  const stageRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useGSAP(
    () => {
      const section = sectionRef.current;
      const pinWrap = pinWrapRef.current;
      const stage = stageRef.current;
      if (!section || itemCount < 1) return undefined;

      const mm = gsap.matchMedia();

      const getIndexFromProgress = (progress) => {
        if (itemCount <= 1) return 0;
        return Math.min(itemCount - 1, Math.round(progress * (itemCount - 1)));
      };

      mm.add("(prefers-reduced-motion: reduce)", () => {
        setActiveIndex(0);
      });

      mm.add(
        "(min-width: 1025px) and (prefers-reduced-motion: no-preference)",
        () => {
          if (!pinWrap || !stage) return undefined;

          setActiveIndex(0);

          const scrollDistance = Math.max(
            window.innerHeight * (itemCount - 1) * STEP_SCROLL_VH,
            window.innerHeight * 0.35,
          );

          const pinTrigger = ScrollTrigger.create({
            trigger: pinWrap,
            start: "top 10%",
            end: () => `+=${scrollDistance}`,
            pin: stage,
            pinSpacing: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              setActiveIndex(getIndexFromProgress(self.progress));
            },
            onLeave: () => setActiveIndex(itemCount - 1),
            onEnterBack: () => setActiveIndex(0),
          });

          return () => pinTrigger.kill();
        },
      );

      return () => mm.revert();
    },
    { scope: sectionRef, dependencies: [itemCount, language] },
  );

  if (itemCount === 0) return null;

  return (
    <section
      ref={sectionRef}
      className="what-we-do"
      aria-labelledby="what-we-do-title"
    >
      <div className="what-we-do__inner">
        <h2 id="what-we-do-title" className="what-we-do__title">
          {copy.title}
        </h2>

        <div ref={pinWrapRef} className="what-we-do__pin-wrap">
          <div ref={stageRef} className="what-we-do__stage">
            <div className="what-we-do__visual" aria-hidden="true">
              <div className="what-we-do__orbits">
                <div className="what-we-do__orbit what-we-do__orbit--left">
                  <div className="what-we-do__orbit-media">
                    <span>{copy.imagePlaceholder}</span>
                  </div>
                </div>
                <div className="what-we-do__orbit what-we-do__orbit--center">
                  <div className="what-we-do__orbit-media">
                    <span>{copy.imagePlaceholder}</span>
                  </div>
                </div>
                <div className="what-we-do__orbit what-we-do__orbit--right">
                  <div className="what-we-do__orbit-media">
                    <span>{copy.imagePlaceholder}</span>
                  </div>
                </div>
              </div>

              <div className="what-we-do__connector">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="36"
                  height="36"
                  viewBox="0 0 36 36"
                  fill="none"
                >
                  <rect
                    width="36"
                    height="36"
                    rx="7"
                    fill="white"
                    fill-opacity="0.04"
                  />
                  <circle cx="18" cy="18" r="4" fill="#4D43BC" />
                </svg>
                <span className="what-we-do__connector-line" />
              </div>
            </div>

            <div className="what-we-do__cards" aria-live="polite">
              {items.map((item, index) => {
                const offset = index - activeIndex;
                const stackClass =
                  offset === 0
                    ? "what-we-do__card--active"
                    : offset === 1
                      ? "what-we-do__card--next"
                      : offset < 0
                        ? "what-we-do__card--past"
                        : "what-we-do__card--hidden";

                return (
                  <article
                    key={item.id}
                    className={`what-we-do__card ${stackClass}`}
                    aria-hidden={offset !== 0}
                  >
                    <div className="what-we-do__card-icon">
                      <WhatWeDoIcon name={item.icon} />
                    </div>
                    <div className="what-we-do__card-body">
                      <h3 className="what-we-do__card-title">{item.title}</h3>
                      <p className="what-we-do__card-text">
                        {item.description}
                      </p>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>

          <ol className="what-we-do__mobile-list">
            {items.map((item) => (
              <li key={item.id} className="what-we-do__mobile-item">
                <article className="what-we-do__card what-we-do__card--mobile">
                  <div className="what-we-do__card-icon">
                    <WhatWeDoIcon name={item.icon} />
                  </div>
                  <div className="what-we-do__card-body">
                    <h3 className="what-we-do__card-title">{item.title}</h3>
                    <p className="what-we-do__card-text">{item.description}</p>
                  </div>
                </article>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
};
