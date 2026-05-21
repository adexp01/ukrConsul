import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Button } from "../UI/Button";
import shield from "../../assets/shield.png";
import "./style.css";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const ORGANIZATIONS = [
  "DEFENSE ALLIANCE OF UKRAINE",
  "LEAGUE OF DEFENSE ENTERPRISES OF UKRAINE",
  "RADIOELECTRONIC ALLIANCE OF UKRAINE",
  "UKRAINIAN ROBOTIC FORCES",
  "TECHOSYSTEM DEFENSE",
  'ASSOCIATION OF MANUFACTURERS OF UAVS "ARMADA"',
  "ASSOCIATION OF MARITIME DRONES",
  "INDEPENDENT ASSOCIATION OF UAV SCHOOLS OF UKRAINE",
  "UCDI INVESTOR CLUB",
];

export const Info = () => {
  const sectionRef = useRef(null);
  const shieldRef = useRef(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      const shieldImage = shieldRef.current;
      if (!section || !shieldImage) return;

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.set(shieldImage, { transformOrigin: "50% 50%", force3D: true });

        gsap
          .timeline({
            scrollTrigger: {
              trigger: section,
              start: "top bottom",
              end: "bottom top",
              scrub: 1.4,
            },
          })
          .to(shieldImage, { y: -14, rotate: 2, duration: 0.28, ease: "sine.out" })
          .to(shieldImage, { y: 10, rotate: -1.5, duration: 0.28, ease: "sine.inOut" })
          .to(shieldImage, { y: -8, rotate: 1, duration: 0.28, ease: "sine.inOut" })
          .to(shieldImage, { y: 6, rotate: -0.5, duration: 0.28, ease: "sine.inOut" })
          .to(shieldImage, { y: 0, rotate: 0, duration: 0.28, ease: "sine.in" });
      });

      return () => mm.revert();
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      className="info-section"
      aria-labelledby="info-cta-title"
    >
      <div className="info-section__inner">
        <div className="info-section__orgs">
          <h2 className="info-section__heading info-section__mobile-only">
            <span>ASSOCIATIONS INCLUDED</span>
            <span>IN THE COUNCIL OF ARMS MAKERS</span>
          </h2>

          <div className="info-section__shield" aria-hidden="true">
            <img ref={shieldRef} src={shield} alt="" />
          </div>

          <div className="info-section__list-wrap">
            <ul className="info-section__list">
              {ORGANIZATIONS.map((name) => (
                <li key={name} className="info-section__list-item">
                  {name}
                </li>
              ))}

              <Button
                href="#"
                variant="default"
                className="info-section__about-btn info-section__mobile-only"
              >
                About us
              </Button>
            </ul>
          </div>
        </div>

        <article className="info-section__cta">
          <div className="info-section__cta-glow" aria-hidden="true" />

          <h2 id="info-cta-title" className="info-section__cta-title">
            <span>WANT TO JOIN</span>
            <span>THE GUNSMITHS</span>
            <span>COUNCIL</span>
            <span>ECOSYSTEM?</span>
          </h2>

          <p className="info-section__cta-text">
            Take a short test and find out which association or community suits
            you best.
          </p>

          <div className="info-section__cta-actions">
            <Button href="#" variant="primary">
              Take the test
            </Button>
            <a href="#" className="info-section__cta-link">
              Apply directly
              <span aria-hidden="true">→</span>
            </a>
          </div>
        </article>
      </div>
    </section>
  );
};
