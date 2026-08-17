import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "../../animation/gsapSetup";
import { SpriteCanvas } from "../Bunner/SpriteCanvas";
import { useLanguage } from "../../i18n/LanguageContext";
import { useBannerTabs } from "../../i18n/useBannerTabs";
import "../Bunner/style.css";
import { CenterFrame } from "../Bunner/CenterFrame";
import "./style.css";

export const Anima = () => {
  const { t } = useLanguage();
  const { tabs, mobileTabs } = useBannerTabs();
  const textRevealRef = useRef(null);

  useGSAP(
    () => {
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

      // Скасовуємо разом з ефектом: інакше після анмаунту прилітає зайвий
      // глобальний refresh, який переміряє всі піни на новій сторінці
      const refreshFrame = requestAnimationFrame(() => ScrollTrigger.refresh());

      return () => {
        cancelAnimationFrame(refreshFrame);
        mm.revert();
      };
    },
    { scope: textRevealRef },
  );

  return (
    <div className="anima">
      <div className="anima__stage">
        <CenterFrame />

        <SpriteCanvas className="banner__ring anima__ring" />

        <div ref={textRevealRef} className="anima__center-line banner__top-line">
          <div className="banner__top-line-inner text-reveal-inner">
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

        <div className="anima__mobile-tabs">
          {mobileTabs.map((tab) => (
            <span
              key={tab.id}
              className={`anima__mobile-tab${tab.active ? " anima__mobile-tab--active" : ""}`}
            >
              {tab.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
