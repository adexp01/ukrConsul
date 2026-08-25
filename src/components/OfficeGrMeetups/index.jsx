import { useMemo, useRef } from "react";
import { Link } from "react-router-dom";
import { useGSAP } from "@gsap/react";
import { gsap } from "../../animation/gsapSetup";
import { useLanguage } from "../../i18n/LanguageContext";
import { useNews } from "../../hooks/useNews";
import { formatNewsDate, getNewsExcerpt } from "../../api/news";
import { resolveArticleSlugForLanguage } from "../../data/articleMeta";
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

/*
 * Раніше в цих віконцях був календар анонсів. Клієнт попросив прибрати
 * анонси й показувати замість них прев'ю до пресрелізів про заходи «Поміж
 * зброярів GR» — ось ці три.
 *
 * Слаги, а не скопійовані заголовки: дата, назва й перший абзац приходять
 * із CRM, тому блок не розходиться зі статтею після її редагування.
 */
const RELEASE_SLUGS = [
  "defence-city-launched",
  "ukrainska-rada-zbroiariv-stala-efekt",
  "codified-but-not-procured",
];

const EXCERPT_LENGTH = 150;

export const OfficeGrMeetups = ({ copyKey = "office.grMeetups" }) => {
  const { t, language, localizePath } = useLanguage();
  const copy = t(copyKey);
  const { news } = useNews();
  const sectionRef = useRef(null);

  /*
   * Беремо стрічку поточної мови. Якщо релізу цією мовою немає — картки
   * просто не буде, а коли немає жодної, лишається сам опис формату. Це і є
   * запасний варіант, про який просив клієнт.
   */
  const releases = useMemo(() => {
    return RELEASE_SLUGS.map((slug) => {
      const localized = resolveArticleSlugForLanguage(slug, language) ?? slug;
      const article = news.find((item) => item.slug === localized);
      if (!article) return null;

      return {
        id: article.id,
        slug: article.slug,
        meta: formatNewsDate(article.createdAt, language),
        title: article.title,
        text: getNewsExcerpt(article, EXCERPT_LENGTH),
      };
    }).filter(Boolean);
  }, [news, language]);

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
    { scope: sectionRef, dependencies: [copyKey, releases.length] },
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

        {releases.length > 0 ? (
          <div className="office-gr-meetups__layout">
            <div className="office-gr-meetups__panel">
              <div className="office-gr-meetups__events">
                {releases.map((release) => (
                  <article
                    key={release.id}
                    className="office-gr-meetups__event"
                  >
                    <p className="office-gr-meetups__meta">{release.meta}</p>
                    <h3 className="office-gr-meetups__event-title">
                      {release.title}
                    </h3>
                    <p className="office-gr-meetups__event-text">
                      {release.text}
                    </p>
                    <Link
                      className="office-gr-meetups__event-link"
                      to={localizePath(`/article/${release.slug}`)}
                    >
                      {copy.readLabel}
                      <span aria-hidden="true">→</span>
                    </Link>
                  </article>
                ))}

                {/* Сторінки з усіма подіями поки немає */}
                {hasDestination(copy.allHref) ? (
                  <div className="office-gr-meetups__actions">
                    <a
                      className="office-gr-meetups__button"
                      href={copy.allHref}
                    >
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
        ) : null}
      </div>
    </section>
  );
};
