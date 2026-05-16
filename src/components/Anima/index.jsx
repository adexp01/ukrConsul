import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { TABS } from "../Bunner";
import "../Bunner/style.css";
import "./style.css";
import { SpriteCanvas } from "../Bunner/SpriteCanvas";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export const Anima = () => {
  const tabsRef = useRef(null);

  useGSAP(
    () => {
      const inner = tabsRef.current?.querySelector(".banner__tabs-inner");
      if (!inner) return;

      gsap.fromTo(
        inner,
        { "--tabs-reveal": "0%" },
        {
          "--tabs-reveal": "100%",
          ease: "none",
          scrollTrigger: {
            trigger: tabsRef.current,
            start: "top 45%",
            end: "+=120",
            scrub: 1,
          },
        },
      );
    },
    { scope: tabsRef },
  );

  return (
    <div className="anima">
      <div
        className="banner__top"
        style={{
          marginTop: "0",
        }}
      >
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
  );
};
