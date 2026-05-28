import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLanguage } from "../../i18n/LanguageContext";
import { CARD_ICONS } from "./icons";
import "./style.css";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const getCardVisuals = (distance) => {
  const d = distance;
  const abs = Math.abs(d);

  const opacity = clamp(0.52, 1, Math.exp(-0.42 * abs * abs));
  const scale = clamp(0.985, 1, 1 - abs * 0.012);
  const y = clamp(-10, 10, d * 6);

  return { opacity, scale, y };
};

export const AnimationCards = () => {
  const { t } = useLanguage();
  const sectionRef = useRef(null);
  const pinRef = useRef(null);
  const viewportRef = useRef(null);
  const trackRef = useRef(null);
  const titleLines = t("track.cards.title");
  const items = Array.isArray(t("track.cards.items"))
    ? t("track.cards.items")
    : [];

  useGSAP(
    () => {
      const section = sectionRef.current;
      const pinWrap = pinRef.current;
      const viewport = viewportRef.current;
      const track = trackRef.current;
      if (!section || !pinWrap || !viewport || !track) return;

      const title = section.querySelector(".animation-cards__title");
      const cards = gsap.utils.toArray(".animation-cards__card", section);
      if (!cards.length) return;

      const cardSetters = cards.map((card) => ({
        opacity: gsap.quickSetter(card, "opacity"),
        scale: gsap.quickSetter(card, "scale"),
        y: gsap.quickSetter(card, "y", "px"),
      }));

      const measure = () => {
        const styles = getComputedStyle(track);
        const gap = parseFloat(styles.rowGap || styles.gap) || 36;
        const viewHeight = viewport.clientHeight;
        const focusY = viewHeight * 0.44;
        const first = cards[0];
        const last = cards[cards.length - 1];
        const cardHeight = first.offsetHeight;
        const step = cardHeight + gap;

        const travel = Math.max(
          0,
          last.offsetTop + last.offsetHeight * 0.5 - focusY,
        );

        const scrollLength = Math.max(
          window.innerHeight * 0.72,
          travel + step * 0.65,
        );

        return { travel, scrollLength, gap, cardHeight, focusY, step };
      };

      let layout = measure();

      const applyCardVisuals = () => {
        const moved = Math.abs(Number(gsap.getProperty(track, "y")) || 0);
        const { focusY, step } = layout;

        cards.forEach((card, index) => {
          const cardMid = card.offsetTop + card.offsetHeight * 0.5 - moved;
          const distance = (cardMid - focusY) / step;
          const { opacity, scale, y } = getCardVisuals(distance);

          cardSetters[index].opacity(opacity);
          cardSetters[index].scale(scale);
          cardSetters[index].y(y);
          card.classList.toggle("is-focus", Math.abs(distance) < 0.38);
        });
      };

      const mm = gsap.matchMedia();

      mm.add(
        "(min-width: 1025px) and (prefers-reduced-motion: no-preference)",
        () => {
          gsap.set(title, { autoAlpha: 0, y: 24 });
          gsap.set(track, { force3D: true });
          gsap.set(cards, { opacity: 1, scale: 1, y: 0 });

          gsap.to(title, {
            autoAlpha: 1,
            y: 0,
            duration: 0.65,
            ease: "power2.out",
            scrollTrigger: {
              trigger: section,
              start: "top 82%",
              once: true,
            },
          });

          layout = measure();
          applyCardVisuals();

          const steps = Math.max(1, cards.length - 1);

          gsap.to(track, {
            y: () => -measure().travel,
            ease: "none",
            scrollTrigger: {
              trigger: pinWrap,
              start: "top top+=100",
              end: () => `+=${measure().scrollLength}`,
              pin: pinWrap,
              pinSpacing: true,
              scrub: 0.25,
              anticipatePin: 1,
              invalidateOnRefresh: true,
              fastScrollEnd: true,
              snap: {
                snapTo: 1 / steps,
                duration: { min: 0.15, max: 0.35 },
                delay: 0.02,
                ease: "power2.inOut",
              },
              onUpdate: applyCardVisuals,
            },
          });

          const onRefresh = () => {
            layout = measure();
            applyCardVisuals();
          };

          ScrollTrigger.addEventListener("refreshInit", onRefresh);

          requestAnimationFrame(() => {
            ScrollTrigger.refresh();
            applyCardVisuals();
          });

          return () => {
            ScrollTrigger.removeEventListener("refreshInit", onRefresh);
            cards.forEach((card) => card.classList.remove("is-focus"));
          };
        },
      );

      mm.add(
        "(max-width: 1024px) and (prefers-reduced-motion: no-preference)",
        () => {
          gsap.set([title, track, ...cards], {
            clearProps: "transform,opacity,scale",
          });
          gsap.set(title, { autoAlpha: 0, y: 16 });

          gsap.to(title, {
            autoAlpha: 1,
            y: 0,
            duration: 0.55,
            ease: "power2.out",
            scrollTrigger: {
              trigger: section,
              start: "top 88%",
              once: true,
            },
          });

          cards.forEach((card, index) => {
            gsap.fromTo(
              card,
              { autoAlpha: 0, y: 24 },
              {
                autoAlpha: 1,
                y: 0,
                duration: 0.5,
                ease: "power2.out",
                scrollTrigger: {
                  trigger: card,
                  start: "top 94%",
                  once: true,
                },
                delay: index * 0.04,
              },
            );
          });
        },
      );

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set([title, track, ...cards], {
          autoAlpha: 1,
          opacity: 1,
          scale: 1,
          y: 0,
          clearProps: "transform",
        });
      });

      const refresh = () => ScrollTrigger.refresh();
      window.addEventListener("load", refresh);
      window.addEventListener("resize", refresh);
      document.fonts?.ready.then(refresh).catch(() => {});

      return () => {
        window.removeEventListener("load", refresh);
        window.removeEventListener("resize", refresh);
        mm.revert();
      };
    },
    { scope: sectionRef, dependencies: [items.length] },
  );

  return (
    <section
      ref={sectionRef}
      className="animation-cards"
      aria-labelledby="animation-cards-title"
    >
      <div className="animation-cards__glow" aria-hidden="true" />

      <div className="animation-cards__inner">
        <div ref={pinRef} className="animation-cards__pin">
          <header className="animation-cards__head">
            <h2 id="animation-cards-title" className="animation-cards__title">
              {titleLines.map((line) => (
                <span key={line}>{line}</span>
              ))}
            </h2>
          </header>

          <div className="animation-cards__stage">
            <div ref={viewportRef} className="animation-cards__viewport">
              <div ref={trackRef} className="animation-cards__track">
                {items.map((item) => {
                  const iconSrc = CARD_ICONS[item.icon] ?? CARD_ICONS.diamond;

                  return (
                    <article
                      key={item.id}
                      data-side={item.side}
                      className={`animation-cards__card animation-cards__card--${item.side}`}
                    >
                      <div className="animation-cards__card-icon">
                        <img
                          src={iconSrc}
                          alt=""
                          className="animation-cards__card-icon-img"
                          width={48}
                          height={48}
                          loading="lazy"
                          decoding="async"
                        />
                      </div>
                      <h3 className="animation-cards__card-title">
                        {item.title}
                      </h3>
                      <p className="animation-cards__card-text">{item.text}</p>
                    </article>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
