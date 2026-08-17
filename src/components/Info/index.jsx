import { useRef } from "react";
import { Link } from "react-router-dom";
import { useGSAP } from "@gsap/react";
import { gsap } from "../../animation/gsapSetup";
import { Button } from "../UI/Button";
import { ShieldSequence } from "../ShieldSequence";
import { useLanguage } from "../../i18n/LanguageContext";
import { useJoinQuiz } from "../JoinQuiz/JoinQuizContext";
import "./style.css";

export const Info = ({
  contentKey = "info",
  ctaContentKey,
  aboutHref = "/about-us",
  applyHref,
  showCta = true,
  showOrgs = true,
  showAboutBtn = true,
  headingId = "info-orgs-heading",
  ctaTitleId = "info-cta-title",
  className = "",
}) => {
  const { t, localizePath } = useLanguage();
  const { openJoinQuiz } = useJoinQuiz();
  const copy = t(contentKey);
  const ctaCopy = t(ctaContentKey ?? contentKey);
  const sectionRef = useRef(null);
  const orgsRef = useRef(null);
  const orgsInnerRef = useRef(null);
  const shieldWrapRef = useRef(null);
  const listWrapRef = useRef(null);

  const organizations = copy.organizations ?? [];
  const headingLines = copy.heading ?? [];
  const ctaTitleLines = ctaCopy.ctaTitle ?? [];
  const ctaTitleMobileLines = Array.isArray(ctaCopy.ctaTitleMobile)
    ? ctaCopy.ctaTitleMobile
    : ctaTitleLines;
  const formHref = applyHref ?? copy.applyHref;
  const isExternalHref =
    typeof formHref === "string" &&
    (/^https?:\/\//i.test(formHref) ||
      formHref.startsWith("mailto:") ||
      formHref.startsWith("tel:"));

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
      const orgs = orgsRef.current;
      const orgsInner = orgsInnerRef.current;
      const shieldWrap = shieldWrapRef.current;
      const listWrap = listWrapRef.current;
      if (!orgs || !orgsInner || !shieldWrap || !listWrap) return;

      const mm = gsap.matchMedia();

      // Поява заголовка й списку — рядок за рядком, коли блок входить у вікно
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const heading = orgs.querySelectorAll(".info-section__heading span");
        const items = listWrap.querySelectorAll(".info-section__list-item");
        const targets = [...heading, ...items];
        if (targets.length === 0) return undefined;

        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: orgs,
            start: "top 80%",
            once: true,
          },
        });

        timeline
          .fromTo(
            heading,
            { y: 24, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.7,
              ease: "power2.out",
              stagger: 0.09,
            },
          )
          .fromTo(
            items,
            { y: 18, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.6,
              ease: "power2.out",
              stagger: 0.07,
            },
            0.2,
          );

        return () => {
          timeline.scrollTrigger?.kill();
          timeline.kill();
          gsap.set(targets, { clearProps: "all" });
        };
      });

      mm.add(
        "(min-width: 1025px) and (prefers-reduced-motion: no-preference)",
        () => {
          const measureTravel = () =>
            Math.max(0, listWrap.offsetHeight - shieldWrap.offsetHeight);

          gsap.set(shieldWrap, { y: 0, force3D: true });

          const tween = gsap.to(shieldWrap, {
            y: measureTravel,
            ease: "none",
            scrollTrigger: {
              trigger: orgs,
              start: "top 75%",
              end: "bottom 25%",
              scrub: 1.2,
              invalidateOnRefresh: true,
            },
          });

          return () => {
            tween.scrollTrigger?.kill();
            tween.kill();
          };
        },
      );

      return () => mm.revert();
    },
    {
      scope: sectionRef,
      dependencies: [organizations.length, showCta, showAboutBtn],
    },
  );

  return (
    <section
      ref={sectionRef}
      className={sectionClassName}
      aria-labelledby={sectionLabelId}
    >
      <div className="info-section__inner">
        {showOrgs ? (
          <div ref={orgsRef} className="info-section__orgs">
            <h2 id={headingId} className="info-section__heading">
              {headingLines.map((line) => (
                <span key={line}>{line}</span>
              ))}
            </h2>

            <div ref={orgsInnerRef} className="info-section__orgs-inner">
              <div
                ref={shieldWrapRef}
                className="info-section__shield"
                aria-hidden="true"
              >
                <ShieldSequence />
              </div>

              <div ref={listWrapRef} className="info-section__list-wrap">
                <ul className="info-section__list">
                  {organizations.map((organization) => {
                    const name =
                      typeof organization === "string"
                        ? organization
                        : organization.name;
                    const href =
                      typeof organization === "string"
                        ? null
                        : organization.href;

                    return (
                      <li key={name} className="info-section__list-item">
                        {href ? (
                          <a
                            href={href}
                            className="info-section__list-link"
                            target="_blank"
                            rel="noreferrer"
                          >
                            {name}
                          </a>
                        ) : (
                          name
                        )}
                      </li>
                    );
                  })}
                </ul>

                {showAboutBtn && copy.aboutBtn ? (
                  <Button
                    href={localizePath(aboutHref)}
                    variant="default"
                    className="info-section__about-btn"
                  >
                    {copy.aboutBtn}
                  </Button>
                ) : null}
              </div>
            </div>
          </div>
        ) : null}

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
              <Button variant="primary" onClick={openJoinQuiz}>
                {ctaCopy.takeTest}
              </Button>
              {/*
                Це посилання буває і зовнішнім (анкета MS Forms, mailto), і
                внутрішнім (/join). Раніше воно завжди відкривалось у новій
                вкладці й без мовного префікса, тому внутрішній варіант
                виносив людину на головну.
              */}
              {isExternalHref ? (
                <a
                  href={formHref}
                  className="info-section__cta-link"
                  target="_blank"
                  rel="noreferrer"
                >
                  {ctaCopy.applyDirectly}
                  <span aria-hidden="true">→</span>
                </a>
              ) : (
                <Link
                  to={localizePath(formHref)}
                  className="info-section__cta-link"
                >
                  {ctaCopy.applyDirectly}
                  <span aria-hidden="true">→</span>
                </Link>
              )}
            </div>
          </article>
        ) : null}
      </div>
    </section>
  );
};
