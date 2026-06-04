import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Button } from "../UI/Button";
import defaultShield from "../../assets/shield.png";
import { useLanguage } from "../../i18n/LanguageContext";
import "./style.css";

gsap.registerPlugin(ScrollTrigger, useGSAP);

export const Info = ({
  contentKey = "info",
  ctaContentKey,
  shieldSrc = defaultShield,
  aboutHref = "#",
  testHref = "#",
  applyHref = "#",
  showCta = true,
  showAboutBtn = true,
  headingId = "info-orgs-heading",
  ctaTitleId = "info-cta-title",
  className = "",
}) => {
  const { t } = useLanguage();
  const copy = t(contentKey);
  const ctaCopy = t(ctaContentKey ?? contentKey);
  const sectionRef = useRef(null);
  const shieldRef = useRef(null);

  const organizations = copy.organizations ?? [];
  const headingLines = copy.heading ?? [];
  const ctaTitleLines = ctaCopy.ctaTitle ?? [];
  const ctaTitleMobileLines = Array.isArray(ctaCopy.ctaTitleMobile)
    ? ctaCopy.ctaTitleMobile
    : ctaTitleLines;

  const sectionClassName = [
    "info-section",
    !showCta && "info-section--orgs-only",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const sectionLabelId = showCta ? ctaTitleId : headingId;

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
          .to(shieldImage, {
            y: -14,
            rotate: 2,
            duration: 0.28,
            ease: "sine.out",
          })
          .to(shieldImage, {
            y: 10,
            rotate: -1.5,
            duration: 0.28,
            ease: "sine.inOut",
          })
          .to(shieldImage, {
            y: -8,
            rotate: 1,
            duration: 0.28,
            ease: "sine.inOut",
          })
          .to(shieldImage, {
            y: 6,
            rotate: -0.5,
            duration: 0.28,
            ease: "sine.inOut",
          })
          .to(shieldImage, {
            y: 0,
            rotate: 0,
            duration: 0.28,
            ease: "sine.in",
          });
      });

      return () => mm.revert();
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      className={sectionClassName}
      aria-labelledby={sectionLabelId}
    >
      <div className="info-section__inner">
        <div className="info-section__orgs">
          <h2 id={headingId} className="info-section__heading">
            {headingLines.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </h2>

          <div className="info-section__orgs-inner">
            <div className="info-section__shield" aria-hidden="true">
              <img ref={shieldRef} src={shieldSrc} alt="" />
            </div>

            <div className="info-section__list-wrap">
              <ul className="info-section__list">
                {organizations.map((name) => (
                  <li key={name} className="info-section__list-item">
                    {name}
                  </li>
                ))}

                {showAboutBtn && copy.aboutBtn ? (
                  <Button
                    href={aboutHref}
                    variant="default"
                    className="info-section__about-btn"
                  >
                    {copy.aboutBtn}
                  </Button>
                ) : null}
              </ul>
            </div>
          </div>
        </div>

        {showCta ? (
          <article className="info-section__cta">
            <div className="info-section__cta-glow" aria-hidden="true" />

            <h2 id={ctaTitleId} className="info-section__cta-title">
              <span className="info-section__cta-title-lines info-section__cta-title-lines--desktop">
                {ctaTitleLines.map((line) => (
                  <span key={line}>{line}</span>
                ))}
              </span>
              <span className="info-section__cta-title-lines info-section__cta-title-lines--mobile">
                {ctaTitleMobileLines.map((line) => (
                  <span key={line}>{line}</span>
                ))}
              </span>
            </h2>

            <p className="info-section__cta-text">{ctaCopy.ctaText}</p>

            <div className="info-section__cta-actions">
              <Button href={testHref} variant="default">
                {ctaCopy.takeTest}
              </Button>
              <a href={applyHref} className="info-section__cta-link">
                {ctaCopy.applyDirectly}
                <span aria-hidden="true">→</span>
              </a>
            </div>
          </article>
        ) : null}
      </div>
    </section>
  );
};
