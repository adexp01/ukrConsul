import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SpriteCanvas } from "../Bunner/SpriteCanvas";
import { useLanguage } from "../../i18n/LanguageContext";
import { useBannerTabs } from "../../i18n/useBannerTabs";
import "../Bunner/style.css";
import "./style.css";

gsap.registerPlugin(ScrollTrigger, useGSAP);

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

      requestAnimationFrame(() => ScrollTrigger.refresh());

      return () => mm.revert();
    },
    { scope: textRevealRef },
  );

  return (
    <div className="anima">
      <div className="anima__desktop">
        <div className="banner__top" style={{ marginTop: 0 }}>
          <SpriteCanvas className="banner__ring" />

          <div ref={textRevealRef} className="banner__top-line">
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
      </div>

      <div className="anima__mobile">
        <div className="anima__mobile-tabs">
          {mobileTabs.map((tab) => (
            <span
              key={tab.id}
              className={`anima__tab${tab.active ? " anima__tab--active" : ""}`}
            >
              {tab.label}
            </span>
          ))}
        </div>

        <div className="anima__mobile-frame">
          <SpriteCanvas className="anima__ring" />
        </div>
      </div>
    </div>
  );
};
