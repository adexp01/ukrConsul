import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Button } from "../UI/Button";
import { SpriteCanvas } from "./SpriteCanvas";
import { useLanguage } from "../../i18n/LanguageContext";
import { useBannerTabs } from "../../i18n/useBannerTabs";
import "./style.css";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export const Bunner = () => {
  const { t } = useLanguage();
  const { tabs, mobileTabs } = useBannerTabs();
  const textRevealRef = useRef(null);
  const TEXT_ANIMATION_DELAY_MS = 1000;
  const TEXT_REVEAL_DURATION_MS = 2550;

  const [isPageLoaded, setIsPageLoaded] = useState(
    () => typeof document !== "undefined" && document.readyState === "complete",
  );
  const [canAnimateText, setCanAnimateText] = useState(false);

  useEffect(() => {
    if (isPageLoaded) return undefined;

    const markLoaded = () => setIsPageLoaded(true);

    if (document.readyState === "complete") {
      markLoaded();
      return undefined;
    }

    window.addEventListener("load", markLoaded, { once: true });
    return () => window.removeEventListener("load", markLoaded);
  }, [isPageLoaded]);

  useEffect(() => {
    if (!isPageLoaded) return undefined;

    const timer = window.setTimeout(
      () => setCanAnimateText(true),
      TEXT_ANIMATION_DELAY_MS,
    );

    return () => clearTimeout(timer);
  }, [isPageLoaded]);

  useGSAP(
    () => {
      if (!canAnimateText) return;

      const mm = gsap.matchMedia();

      mm.add("(min-width: 1025px)", () => {
        const inner = textRevealRef.current?.querySelector(
          ".banner__top-line-inner",
        );
        const fill = inner?.querySelector(".banner__top-line-fill");
        if (!inner || !fill) return;

        gsap.set(inner, { "--tabs-reveal": "0%" });
        gsap.set(fill, { opacity: 0 });

        gsap
          .timeline({
            scrollTrigger: {
              trigger: textRevealRef.current,
              start: "top 75%",
              once: true,
            },
          })
          .to(fill, {
            opacity: 1,
            duration: 0.9,
            ease: "sine.inOut",
          })
          .to(
            inner,
            {
              "--tabs-reveal": "100%",
              duration: 2.2,
              ease: "sine.inOut",
            },
            0.35,
          );
      });

      requestAnimationFrame(() => ScrollTrigger.refresh());

      return () => mm.revert();
    },
    { scope: textRevealRef, dependencies: [canAnimateText] },
  );

  const titleLines = t("banner.title");

  return (
    <section className="banner" aria-label="Hero banner">
      <div className="banner__inner">
        <div className="banner__top">
          <div
            className="banner__mobile-frame banner__mobile-only"
            aria-hidden="true"
          >
            <svg
              className="banner__mobile-frame-svg"
              width="344"
              viewBox="0 0 344 22"
              preserveAspectRatio="none"
            >
              <path
                d="M0.5 21.5V8.5C0.5 4.08172 4.08172 0.5 8.5 0.5H335.5C339.918 0.5 343.5 4.08172 343.5 8.5V21.5"
                fill="none"
              />
            </svg>
          </div>

          <SpriteCanvas
            className="banner__ring"
            play={canAnimateText}
            playbackDurationMs={TEXT_REVEAL_DURATION_MS}
          />

          <div className="banner__tabs-mobile banner__mobile-only">
            {mobileTabs.map((tab) => (
              <span
                key={tab.id}
                className={`banner__tab-mobile${tab.active ? " banner__tab-mobile--active" : ""}`}
              >
                {tab.label}
              </span>
            ))}
          </div>

          <div
            ref={textRevealRef}
            className="banner__top-line banner__desktop-only"
          >
            <div className="banner__top-line-inner">
              <p className="banner__top-line-base">
                <span className="banner__top-line-label">
                  {t("banner.label")}
                </span>
                <span className="banner__top-line-tabs">
                  {tabs.map((tab) => (
                    <span key={tab.id} className="banner__top-line-tab">
                      {tab.label}
                    </span>
                  ))}
                </span>
              </p>
              <p className="banner__top-line-fill" aria-hidden="true">
                <span className="banner__top-line-label">
                  {t("banner.label")}
                </span>
                <span className="banner__top-line-tabs">
                  {tabs.map((tab) => (
                    <span key={tab.id} className="banner__top-line-tab">
                      {tab.label}
                    </span>
                  ))}
                </span>
              </p>
            </div>
          </div>
        </div>

        <div className="banner__panel">
          <p className="banner__text">{t("banner.panelText")}</p>
        </div>

        <div className="banner__hero">
          <h2 className="banner__title">
            {titleLines.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </h2>

          <Button href="#" className="banner__cta">
            {t("banner.sendRequest")}
          </Button>
        </div>
      </div>
    </section>
  );
};
