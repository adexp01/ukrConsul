import { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import shield from "../../assets/shield.png";
import { useLanguage } from "../../i18n/LanguageContext";
import "./style.css";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export const JoinProcess = () => {
  const { t } = useLanguage();
  const copy = t("joinPage.processSlider");
  const steps = copy.steps ?? [];
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const scrollTriggerRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);

  useGSAP(
    () => {
      const section = sectionRef.current;
      const track = trackRef.current;

      if (!section || !track || steps.length <= 1) return;

      const mm = gsap.matchMedia();

      mm.add("(min-width: 761px) and (prefers-reduced-motion: no-preference)", () => {
        const getTravelDistance = () =>
          Math.max(0, track.scrollWidth - window.innerWidth + 160);

        gsap.set(track, { x: 0 });

        const tween = gsap.to(track, {
          x: () => -getTravelDistance(),
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => `+=${window.innerHeight * (steps.length - 1)}`,
            scrub: 0.45,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              const nextProgress = self.progress;
              const nextIndex = Math.min(
                steps.length - 1,
                Math.round(nextProgress * (steps.length - 1)),
              );

              setScrollProgress(nextProgress);
              setActiveIndex(nextIndex);
            },
          },
        });

        scrollTriggerRef.current = tween.scrollTrigger;

        return () => {
          scrollTriggerRef.current = null;
          tween.scrollTrigger?.kill();
          tween.kill();
        };
      });

      return () => mm.revert();
    },
    { scope: sectionRef, dependencies: [steps.length] },
  );

  if (steps.length === 0) return null;

  const progress = steps.length > 1 ? scrollProgress : 0;

  const selectStep = (index) => {
    const scrollTrigger = scrollTriggerRef.current;

    setActiveIndex(index);
    setScrollProgress(steps.length > 1 ? index / (steps.length - 1) : 0);

    if (!scrollTrigger) return;

    const targetScroll =
      scrollTrigger.start +
      (scrollTrigger.end - scrollTrigger.start) *
        (steps.length > 1 ? index / (steps.length - 1) : 0);

    window.scrollTo({ top: targetScroll, behavior: "smooth" });
  };

  return (
    <section
      ref={sectionRef}
      className="join-process"
      aria-labelledby="join-process-title"
    >
      <div className="join-process__inner">
        <h2 id="join-process-title" className="join-process__title">
          {copy.title.map((line) => (
            <span key={line}>{line}</span>
          ))}
        </h2>

        <div className="join-process__stage">
          <div ref={trackRef} className="join-process__steps-track">
            {steps.map((step, index) => (
              <article
                key={step.shortTitle}
                className={`join-process__step${
                  activeIndex === index ? " is-active" : ""
                }`}
              >
                <span className="join-process__number">
                  {String(index + 1).padStart(2, "0")}.
                </span>
                <h3 className="join-process__step-title">
                  {(Array.isArray(step.title) ? step.title : [step.title]).map(
                    (line) => (
                      <span key={line}>{line}</span>
                    ),
                  )}
                </h3>
                <p className="join-process__step-text">{step.text}</p>
              </article>
            ))}
          </div>

          <div className="join-process__media" aria-hidden="true">
            <div className="join-process__glow" />
            <img
              src={shield}
              alt=""
              className="join-process__shield"
              width={200}
              height={200}
              loading="lazy"
              decoding="async"
            />
          </div>
        </div>

        <div className="join-process__controls" aria-label={copy.navigationLabel}>
          <div className="join-process__tabs">
            {steps.map((step, index) => (
              <button
                key={step.shortTitle}
                className={`join-process__tab${activeIndex === index ? " is-active" : ""}`}
                type="button"
                aria-current={activeIndex === index ? "step" : undefined}
                onClick={() => selectStep(index)}
              >
                <span aria-hidden="true">■</span>
                {index + 1}. {step.shortTitle}
              </button>
            ))}
          </div>

          <div className="join-process__progress" aria-hidden="true">
            <span
              className="join-process__progress-fill"
              style={{ width: `${progress * 100}%` }}
            />
            <span
              className="join-process__progress-dot"
              style={{ left: `${progress * 100}%` }}
            />
          </div>
        </div>
      </div>
    </section>
  );
};
