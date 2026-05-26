import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TABS, MOBILE_TABS } from "../Bunner";
import { SpriteCanvas } from "../Bunner/SpriteCanvas";
import "../Bunner/style.css";
import "./style.css";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export const Anima = () => {
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

        // Scroll-scrub variant (restore if needed):
        // scrollTrigger: { trigger: tabsRef.current, start: "top 45%", end: "+=120", scrub: 1 }
      });

      return () => mm.revert();
    },
    { scope: tabsRef },
  );

  return (
    <div className="anima">
      <div className="anima__desktop">
        <div className="banner__top" style={{ marginTop: 0 }}>
          <span className="banner__label">You see ...</span>

          <SpriteCanvas className="banner__ring" />

          <div ref={tabsRef} className="banner__tabs">
            <div className="banner__tabs-inner">
              <p className="banner__tabs-base">
                {TABS.map((tab) => (
                  <span key={tab.id} className="banner__tab-item">
                    {tab.label}
                  </span>
                ))}
              </p>
              <p className="banner__tabs-fill" aria-hidden="true">
                {TABS.map((tab) => (
                  <span key={tab.id} className="banner__tab-item">
                    {tab.label}
                  </span>
                ))}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="anima__mobile">
        <div className="anima__mobile-tabs">
          {MOBILE_TABS.map((tab) => (
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
