import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLanguage } from "../../i18n/LanguageContext";
import dialArt from "../../assets/test111.svg";
import "./style.css";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export const OfficeWorkFocus = ({ copyKey = "office.workFocus" }) => {
  const { t } = useLanguage();
  const copy = t(copyKey);
  const sectionRef = useRef(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return undefined;

      const intro = section.querySelector(".office-work-focus__intro");
      const dial = section.querySelector(".office-work-focus__dial-wrap");
      const items = gsap.utils.toArray(".office-work-focus__item", section);

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.set([intro, dial, ...items].filter(Boolean), {
          autoAlpha: 0,
          y: 28,
        });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top 74%",
            once: true,
          },
        });

        tl.to(intro, {
          autoAlpha: 1,
          y: 0,
          duration: 0.55,
          ease: "power2.out",
        })
          .to(
            dial,
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.65,
              ease: "power2.out",
            },
            "-=0.2",
          )
          .to(
            items,
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.45,
              stagger: 0.12,
              ease: "power2.out",
            },
            "-=0.38",
          );

        return () => {
          tl.scrollTrigger?.kill();
          tl.kill();
        };
      });

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set([intro, dial, ...items].filter(Boolean), {
          autoAlpha: 1,
          y: 0,
        });
      });

      return () => mm.revert();
    },
    { scope: sectionRef, dependencies: [copyKey] },
  );

  return (
    <section
      ref={sectionRef}
      className="office-work-focus"
      aria-labelledby="office-work-focus-title"
    >
      <div className="office-work-focus__inner">
        <h2 id="office-work-focus-title" className="office-work-focus__title">
          {copy.title}
        </h2>
        <p className="office-work-focus__description">{copy.description}</p>
        <header className="office-work-focus__intro"></header>

        <div className="office-work-focus__content">
          <div className="office-work-focus__dial-wrap">
            <p className="office-work-focus__dial-label">
              {copy.dialLabel.map((line) => (
                <span key={line}>{line}</span>
              ))}
            </p>
            <img
              className="office-work-focus__dial"
              src={dialArt}
              alt=""
              loading="lazy"
              decoding="async"
            />
          </div>

          <ul className="office-work-focus__items">
            {copy.items.map((item, index) => (
              <li
                key={item}
                className={`office-work-focus__item${
                  index === 1 ? " is-active" : ""
                }`}
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};
