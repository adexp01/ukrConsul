import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLanguage } from "../../i18n/LanguageContext";
import bookImage from "../../assets/g12.png";
import "./style.css";

gsap.registerPlugin(ScrollTrigger, useGSAP);

const DownloadIcon = () => (
  <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" focusable="false">
    <path
      d="M8 2v7m0 0 3-3m-3 3L5 6m-2 7h10"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const OfficeWhiteBook = ({ copyKey = "office.whiteBook" }) => {
  const { t } = useLanguage();
  const copy = t(copyKey);
  const sectionRef = useRef(null);

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section) return undefined;

      const header = section.querySelector(".office-white-book__header");
      const card = section.querySelector(".office-white-book__card");
      const visual = section.querySelector(".office-white-book__visual");

      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        gsap.set([header, card, visual].filter(Boolean), {
          autoAlpha: 0,
          y: 26,
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
            card,
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.55,
              ease: "power2.out",
            },
            "-=0.16",
          )
          .to(
            visual,
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
        gsap.set([header, card, visual].filter(Boolean), {
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
      className="office-white-book"
      aria-labelledby="office-white-book-title"
    >
      <div className="office-white-book__inner">
        <header className="office-white-book__header">
          <h2 id="office-white-book-title" className="office-white-book__title">
            {copy.title}
          </h2>
          <p className="office-white-book__description">{copy.description}</p>
        </header>

        <article className="office-white-book__card">
          <div className="office-white-book__content">
            <p className="office-white-book__note">{copy.note}</p>

            <p className="office-white-book__label">
              <span aria-hidden="true" />
              {copy.label}
            </p>

            <ul className="office-white-book__list">
              {copy.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>

            <div className="office-white-book__actions">
              <a className="office-white-book__button" href={copy.downloadHref}>
                {copy.downloadLabel}
              </a>
              <a
                className="office-white-book__icon-button"
                href={copy.downloadHref}
                aria-label={copy.downloadLabel}
              >
                <DownloadIcon />
              </a>
            </div>
          </div>

          <img
            className="office-white-book__visual"
            src={bookImage}
            alt=""
            loading="lazy"
            decoding="async"
          />
        </article>
      </div>
    </section>
  );
};
