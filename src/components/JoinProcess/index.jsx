import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "../../animation/gsapSetup";
import { ShieldSequence } from "../ShieldSequence";
import { useLanguage } from "../../i18n/LanguageContext";
import "./style.css";

export const JoinProcess = () => {
  const { t } = useLanguage();
  const copy = t("joinPage.processSlider");
  const steps = copy.steps ?? [];
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const scrollTriggerRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  /*
   * Пінований таймлайн існує тільки на широких екранах і без
   * prefers-reduced-motion. Поки його немає, прогрес зовні задавати нічим —
   * і щит, якому його передавали завжди, назавжди застигав на першому кадрі.
   * Тоді краще не передавати нічого: секвенція сама рахує поворот по скролу.
   */
  const [isScrubbed, setIsScrubbed] = useState(false);

  useGSAP(
    () => {
      const section = sectionRef.current;
      const track = trackRef.current;

      if (!section || !track || steps.length <= 1) return;

      const mm = gsap.matchMedia();

      mm.add(
        "(min-width: 761px) and (prefers-reduced-motion: no-preference)",
        () => {
          /*
           * Проїзд рахуємо по кроку між картками, а не по ширині стрічки.
           *
           * Було `track.scrollWidth - innerWidth + 160`, і через це кожен крок
           * зупинявся не там, де попередній. Арифметика: при 5 кроках ширина
           * стрічки 6746, проїзд виходив 5306, тобто 1326 на крок — а відстань
           * між лівими краями сусідніх карток 1550. Різниця 224px копилась, і
           * заміряно: активна картка зупинялася на 113, 337, 560, 784, 1010.
           * Тобто вона повзла праворуч і на трьох із пʼяти зупинок лягала
           * просто на щит — перекриття 47, 160 і 96 пікселів.
           *
           * Тепер проїзд дорівнює (кроків − 1) × відстань між картками, тому
           * кожна картка зупиняється рівно там, де перша: ліворуч від щита,
           * як у макеті. Крізь щит картка проходить лише в русі.
           */
          const getStepGap = () => {
            const items = track.children;
            if (items.length < 2) return 0;
            return items[1].offsetLeft - items[0].offsetLeft;
          };

          const getTravelDistance = () =>
            Math.max(0, getStepGap() * (steps.length - 1));

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
          setIsScrubbed(true);

          return () => {
            scrollTriggerRef.current = null;
            setIsScrubbed(false);
            tween.scrollTrigger?.kill();
            tween.kill();
          };
        },
      );

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
            <ShieldSequence
              className="join-process__shield"
              /*
               * Пінований таймлайн існує лише на широких екранах. Там щит веде
               * прокрутка, а на мобільному — крутиться сам.
               */
              autoplay={!isScrubbed}
              {...(isScrubbed ? { progress: scrollProgress } : {})}
            />
          </div>
        </div>

        <div
          className="join-process__controls"
          aria-label={copy.navigationLabel}
        >
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
