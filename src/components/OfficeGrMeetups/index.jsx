import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "../../animation/gsapSetup";
import { useLanguage } from "../../i18n/LanguageContext";
import { hasDestination } from "../../utils/links";
import eventImage from "../../assets/g15.png";
import "./style.css";

const ArrowIcon = () => (
  <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" focusable="false">
    <path
      d="M3 8h9m0 0-3.5-3.5M12 8l-3.5 3.5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const OfficeGrMeetups = ({ copyKey = "office.grMeetups" }) => {
  const { t } = useLanguage();
  const copy = t(copyKey);
  const sectionRef = useRef(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return undefined;

      const header = section.querySelector(".office-gr-meetups__header");
      const panel = section.querySelector(".office-gr-meetups__panel");
      const image = section.querySelector(".office-gr-meetups__image");

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.set([header, panel, image].filter(Boolean), {
          autoAlpha: 0,
          y: 28,
        });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top 78%",
            once: true,
          },
        });

        tl.to(header, {
          autoAlpha: 1,
          y: 0,
          duration: 0.5,
          ease: "power2.out",
        })
          .to(
            panel,
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.55,
              ease: "power2.out",
            },
            "-=0.14",
          )
          .to(
            image,
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.55,
              ease: "power2.out",
            },
            "-=0.34",
          );

        return () => {
          tl.scrollTrigger?.kill();
          tl.kill();
        };
      });

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set([header, panel, image].filter(Boolean), {
          autoAlpha: 1,
          y: 0,
        });
      });

      return () => mm.revert();
    },
    { scope: sectionRef, dependencies: [copyKey] },
  );

  return (
    <section
      ref={sectionRef}
      className="office-gr-meetups"
      aria-labelledby="office-gr-meetups-title"
    >
      <div className="office-gr-meetups__inner">
        <header className="office-gr-meetups__header">
          <h2 id="office-gr-meetups-title" className="office-gr-meetups__title">
            {copy.title}
          </h2>
          <p className="office-gr-meetups__description">{copy.description}</p>
        </header>

        <div className="office-gr-meetups__layout">
          <div className="office-gr-meetups__panel">
            <div className="office-gr-meetups__events">
              {copy.events.map((event) => (
                <article key={event.id} className="office-gr-meetups__event">
                  <p className="office-gr-meetups__meta">{event.meta}</p>
                  <h3 className="office-gr-meetups__event-title">
                    {event.title}
                  </h3>
                  <p className="office-gr-meetups__event-text">{event.text}</p>
                  {hasDestination(event.href) ? (
                    <a
                      className="office-gr-meetups__event-link"
                      href={event.href}
                    >
                      {copy.joinLabel}
                      <span aria-hidden="true">→</span>
                    </a>
                  ) : null}
                </article>
              ))}

              {/* Сторінки з усіма подіями поки немає */}
              {hasDestination(copy.allHref) ? (
                <div className="office-gr-meetups__actions">
                  <a className="office-gr-meetups__button" href={copy.allHref}>
                    {copy.allLabel}
                  </a>
                  <a
                    className="office-gr-meetups__icon-button"
                    href={copy.allHref}
                    aria-label={copy.allLabel}
                  >
                    <ArrowIcon />
                  </a>
                </div>
              ) : null}
            </div>
          </div>

          <img
            className="office-gr-meetups__image"
            src={eventImage}
            alt=""
            loading="lazy"
            decoding="async"
          />
        </div>
      </div>
    </section>
  );
};
