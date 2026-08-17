import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "../../animation/gsapSetup";
import { useLanguage } from "../../i18n/LanguageContext";
import zel from "../../assets/zel.png";
import pynkt from "../../assets/pynkt.png";
import zbroya from "../../assets/zbroya.png";
import "./style.css";

/*
 * Підписи до слайдів беруться з локалі (track.bunner.slides) за id: раніше
 * і alt, і aria-label секції були зашиті українською, тому в англійській
 * версії скринрідер читав український текст.
 */
const SLIDES = [
  {
    id: "zel-left",
    src: zel,
    size: "sm",
    side: "left",
  },
  {
    id: "zbroya-center",
    src: zbroya,
    size: "md",
    side: "left",
  },
  {
    id: "pynkt-left",
    src: pynkt,
    size: "lg",
    side: "center",
  },
  {
    id: "zel-right",
    src: zel,
    size: "md",
    side: "right",
  },
  {
    id: "zbroya-right",
    src: zbroya,
    size: "sm",
    side: "right",
  },
];

const isSlideVisible = (element) => {
  const style = window.getComputedStyle(element);
  return style.display !== "none" && style.visibility !== "hidden";
};

const getSlideOffset = (slide) => {
  if (slide.classList.contains("track-bunner__slide--sm")) return 36;
  if (slide.classList.contains("track-bunner__slide--md")) return 48;
  return 56;
};

export const TrackBunner = () => {
  const { t } = useLanguage();
  const slideAlt = t("track.bunner.slides");
  const sectionRef = useRef(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return;

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const allSlides = gsap.utils.toArray(
          ".track-bunner__slide",
          section,
        );
        const centerSlide = allSlides.find(
          (slide) => slide.dataset.side === "center",
        );
        const sideSlides = allSlides.filter(
          (slide) => slide !== centerSlide && isSlideVisible(slide),
        );

        if (!centerSlide) return;

        gsap.set(centerSlide, {
          autoAlpha: 0,
          scale: 0.9,
          transformOrigin: "50% 50%",
          zIndex: 3,
        });

        sideSlides.forEach((slide) => {
          const fromLeft = slide.dataset.side === "left";
          const offset = getSlideOffset(slide);

          gsap.set(slide, {
            autoAlpha: 0,
            x: fromLeft ? -offset : offset,
            scale: 0.94,
            transformOrigin: "50% 50%",
          });
        });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top 85%",
            once: true,
          },
        });

        tl.to(centerSlide, {
          autoAlpha: 1,
          scale: 1,
          duration: 0.75,
          ease: "power3.out",
        });

        tl.to(
          sideSlides,
          {
            autoAlpha: 1,
            x: 0,
            scale: 1,
            duration: 0.5,
            ease: "power2.out",
            stagger: 0.12,
          },
          "-=0.3",
        );

        const rail = section.querySelector(".track-bunner__rail");
        if (rail) {
          gsap.set(rail, { autoAlpha: 0 });
          tl.to(rail, { autoAlpha: 1, duration: 0.6, ease: "power1.out" }, 0.25);
        }
      });

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(section.querySelectorAll(".track-bunner__slide"), {
          autoAlpha: 1,
          x: 0,
          scale: 1,
          clearProps: "transform",
        });
        gsap.set(section.querySelector(".track-bunner__rail"), {
          autoAlpha: 1,
        });
      });

      return () => mm.revert();
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      className="track-bunner"
      aria-label={t("track.bunner.sectionLabel")}
    >
      <div className="track-bunner__inner">
        <div className="track-bunner__rail" aria-hidden="true" />

        <ul className="track-bunner__stage">
          {SLIDES.map((slide) => (
            <li
              key={slide.id}
              data-slide-id={slide.id}
              data-side={slide.side}
              className={`track-bunner__slide track-bunner__slide--${slide.size}`}
            >
              <div className="track-bunner__frame">
                <img
                  src={slide.src}
                  alt={slideAlt[slide.id] ?? ""}
                  loading="lazy"
                />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};
