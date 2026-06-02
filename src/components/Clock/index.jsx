import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLanguage } from "../../i18n/LanguageContext";
import clockArt from "../../assets/test111.svg";
import "./style.css";

gsap.registerPlugin(ScrollTrigger, useGSAP);

/** Dial pivot & ticks from test111.svg viewBox (315×590), center ~(23.26, 294.61). */
const DIAL_ITEM_ANGLES = [-90, 0, 90];
const ITEM_DIM = "rgba(255, 255, 255, 0.38)";
const ITEM_ACTIVE = "#ffffff";
const SCROLL_STEP_VH = 1.85;
const SCRUB_SMOOTHING = 3.8;
const STEP_MOVE = 0.52;
const STEP_HOLD = 0.48;
const SMOOTH_EASE = "sine.inOut";

export const Clock = () => {
  const { t } = useLanguage();
  const copy = t("office.clock");
  const sectionRef = useRef(null);
  const pinRef = useRef(null);
  const featuresRef = useRef(null);
  const itemsViewportRef = useRef(null);
  const itemsTrackRef = useRef(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return undefined;

      const title = section.querySelector(".clock__title");
      const columns = gsap.utils.toArray(".clock__hero .clock__text", section);
      const dial = section.querySelector(".clock__dial");
      const dialLabel = section.querySelector(".clock__dial-label");
      const dialMarker = section.querySelector(".clock__dial-marker");
      const pinWrap = pinRef.current;
      const features = featuresRef.current;
      const viewport = itemsViewportRef.current;
      const track = itemsTrackRef.current;

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(
          [title, ...columns, dial, dialLabel, track].filter(Boolean),
          { autoAlpha: 1, clearProps: "transform" },
        );
        gsap.utils.toArray(".clock__item", section).forEach((item) => {
          gsap.set(item, { color: ITEM_ACTIVE, clearProps: "opacity" });
        });
      });

      mm.add("(max-width: 1024px)", () => {
        gsap.set(title, { autoAlpha: 0, y: 28 });
        gsap.set(columns, { autoAlpha: 0, y: 22 });
        gsap.set([dial, dialLabel, track], { autoAlpha: 1, y: 0 });

        const heroTl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top 82%",
            once: true,
          },
        });

        heroTl
          .to(title, { autoAlpha: 1, y: 0, duration: 0.75, ease: "power2.out" })
          .to(
            columns,
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.6,
              stagger: 0.12,
              ease: "power2.out",
            },
            "-=0.35",
          );

        gsap.utils.toArray(".clock__item", section).forEach((item) => {
          gsap.set(item, { color: ITEM_ACTIVE });
        });

        return () => heroTl.scrollTrigger?.kill();
      });

      mm.add("(min-width: 1025px) and (prefers-reduced-motion: no-preference)", () => {
        if (!pinWrap || !features || !viewport || !track || !dialMarker) {
          return undefined;
        }

        const itemEls = gsap.utils.toArray(".clock__item", track);
        const itemCount = itemEls.length;

        if (itemCount < 2) return undefined;

        gsap.set(title, { autoAlpha: 0, y: 28 });
        gsap.set(columns, { autoAlpha: 0, y: 22 });
        gsap.set([dial, dialLabel], { autoAlpha: 0 });
        itemEls.forEach((item, index) => {
          gsap.set(item, {
            color: index === 0 ? ITEM_ACTIVE : ITEM_DIM,
          });
        });
        gsap.set(dialMarker, {
          rotation: DIAL_ITEM_ANGLES[0],
          transformOrigin: "7.38% 49.93%",
        });

        const heroTl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top 82%",
            once: true,
          },
        });

        heroTl
          .to(title, { autoAlpha: 1, y: 0, duration: 0.75, ease: "power2.out" })
          .to(
            columns,
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.6,
              stagger: 0.12,
              ease: "power2.out",
            },
            "-=0.35",
          );

        const measureOffsets = () =>
          itemEls.map((item) => {
            const viewportHeight = viewport.clientHeight;
            const itemCenter = item.offsetTop + item.offsetHeight / 2;
            return viewportHeight / 2 - itemCenter;
          });

        const buildScrollTimeline = () => {
          const offsets = measureOffsets();
          gsap.set(track, { y: offsets[0] });

          const scrollTl = gsap.timeline({
            defaults: { ease: SMOOTH_EASE },
            scrollTrigger: {
              trigger: pinWrap,
              start: "top top",
              end: () =>
                `+=${window.innerHeight * (itemCount - 1) * SCROLL_STEP_VH}`,
              pin: features,
              scrub: SCRUB_SMOOTHING,
              anticipatePin: 1,
              invalidateOnRefresh: true,
              onEnter: () => {
                gsap.to([dial, dialLabel], {
                  autoAlpha: 1,
                  duration: 0.65,
                  ease: SMOOTH_EASE,
                });
              },
            },
          });

          for (let index = 1; index < itemCount; index += 1) {
            const y = offsets[index];
            const overlap = "<0.08";

            scrollTl.to(track, {
              y,
              duration: STEP_MOVE,
              ease: SMOOTH_EASE,
            });

            scrollTl.to(
              dialMarker,
              {
                rotation: DIAL_ITEM_ANGLES[index],
                duration: STEP_MOVE,
                ease: SMOOTH_EASE,
              },
              overlap,
            );

            itemEls.forEach((item, itemIndex) => {
              scrollTl.to(
                item,
                {
                  color: itemIndex === index ? ITEM_ACTIVE : ITEM_DIM,
                  duration: STEP_MOVE,
                  ease: SMOOTH_EASE,
                },
                overlap,
              );
            });

            scrollTl.to({}, { duration: STEP_HOLD });
          }

          return scrollTl;
        };

        const scrollTl = buildScrollTimeline();

        return () => {
          heroTl.scrollTrigger?.kill();
          heroTl.kill();
          scrollTl.scrollTrigger?.kill();
          scrollTl.kill();
        };
      });

      return () => mm.revert();
    },
    { scope: sectionRef, dependencies: [copy.title, copy.columns, copy.items] },
  );

  return (
    <section ref={sectionRef} className="clock" aria-labelledby="clock-title">
      <div className="clock__backdrop" aria-hidden="true" />
      <div className="clock__glow" aria-hidden="true" />

      <div className="clock__inner">
        <div className="clock__hero">
          <h2 id="clock-title" className="clock__title">
            {copy.title.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </h2>

          <div className="clock__columns">
            {copy.columns.map((text) => (
              <p key={text} className="clock__text">
                {text}
              </p>
            ))}
          </div>
        </div>

        <div ref={pinRef} className="clock__features-pin">
          <div
            ref={featuresRef}
            className="clock__features"
            aria-labelledby="clock-features-title"
          >
            <div className="clock__dial-stage">
              <p id="clock-features-title" className="clock__dial-label">
                {copy.dialLabel.map((line) => (
                  <span key={line}>{line}</span>
                ))}
              </p>

              <div className="clock__dial" aria-hidden="true">
                <img
                  className="clock__dial-art"
                  src={clockArt}
                  alt=""
                  loading="lazy"
                  decoding="async"
                />
                <div className="clock__dial-marker" />
              </div>
            </div>

            <div
              ref={itemsViewportRef}
              className="clock__items-viewport"
              aria-live="polite"
            >
              <ul ref={itemsTrackRef} className="clock__items-track">
                {copy.items.map((text) => (
                  <li key={text} className="clock__item">
                    {text}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
