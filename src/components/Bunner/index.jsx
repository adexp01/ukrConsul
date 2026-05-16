import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Button } from "../UI/Button";
import { SpriteCanvas } from "./SpriteCanvas";
import "./style.css";

export const TABS = [
  { id: "industry", label: "Ukraine’s private defence industry" },
  { id: "partners", label: "partners" },
  { id: "capacity", label: "capacity" },
];

const PANEL_TEXT =
  "We unite industry associations, present a common position, and work with the state, military, and international partners to accelerate production and scaling of the defense industry.";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export const Bunner = () => {
  const bannerRef = useRef(null);

  useGSAP(
    () => {
      gsap.fromTo(
        ".banner__tabs-inner",
        { "--tabs-reveal": "0%" },
        {
          "--tabs-reveal": "100%",
          ease: "none",
          scrollTrigger: {
            trigger: bannerRef.current,
            start: "top 45%",
            end: "+=220",
            scrub: 1,
          },
        },
      );
    },
    { scope: bannerRef },
  );

  return (
    <section className="banner" aria-label="Hero banner">
      <div className="banner__inner">
        <div className="banner__top">
          <span className="banner__label">You see ...</span>

          <SpriteCanvas className="banner__ring" />

          <div ref={bannerRef} className="banner__tabs">
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

        <div className="banner__panel">
          <p className="banner__text">{PANEL_TEXT}</p>
        </div>

        <div className="banner__hero">
          <h2 className="banner__title">
            <span>UKRAINIAN COUNCIL</span>
            <span>OF ARMS MAKERS</span>
          </h2>

          <Button href="#" variant="primary">
            Send a request
          </Button>
        </div>
      </div>
    </section>
  );
};
