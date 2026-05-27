import { useRef } from "react";
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
  const tabsRef = useRef(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(min-width: 1025px)", () => {
        const inner = tabsRef.current?.querySelector(".banner__tabs-inner");
        if (!inner) return;

        gsap.fromTo(
          inner,
          { "--tabs-reveal": "0%" },
          {
            "--tabs-reveal": "100%",
            duration: 1.2,
            ease: "power2.out",
            scrollTrigger: {
              trigger: tabsRef.current,
              start: "top 75%",
              once: true,
            },
          },
        );
      });

      return () => mm.revert();
    },
    { scope: tabsRef },
  );

  const titleLines = t("banner.title");

  return (
    <section className="banner" aria-label="Hero banner">
      <div className="banner__inner">
        <div className="banner__top">
          <span className="banner__label banner__desktop-only">
            {t("banner.label")}
          </span>

          <SpriteCanvas className="banner__ring" />

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

          <div ref={tabsRef} className="banner__tabs banner__desktop-only">
            <div className="banner__tabs-inner">
              <p className="banner__tabs-base">
                {tabs.map((tab) => (
                  <span key={tab.id} className="banner__tab-item">
                    {tab.label}
                  </span>
                ))}
              </p>
              <p className="banner__tabs-fill" aria-hidden="true">
                {tabs.map((tab) => (
                  <span key={tab.id} className="banner__tab-item">
                    {tab.label}
                  </span>
                ))}
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
