import { useRef, useState, useCallback, useEffect } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ScrollTrigger } from "../../animation/gsapSetup";
import { Button } from "../UI/Button";
import { buildRoundedPath } from "../../utils/roundedPath";
import { useLanguage } from "../../i18n/LanguageContext";
import "./style.css";

const MAIN_STAT = {
  id: "companies",
  value: "400+",
};

const SATELLITE_STATS = [
  { id: "manufacturers", value: "360+", position: "top-left" },
  { id: "schools", value: "28", position: "bottom-left" },
  { id: "funds", value: "20", position: "bottom-right" },
];

const PIN_SCROLL_VH = 2.6;
const PIN_SCRUB = 1.15;
const PHASE_HOLD = 0.2;
const PHASE_TITLE_FADE = 0.14;
const PHASE_EXPAND = 0.28;
/*
 * Остання фаза — «витримка»: картки вже на місцях, нічого не рухається, але
 * секція ще приколота. Без неї стан «усе розкрито» існував лише в останніх
 * 3 % прокрутки піна: людина доводила анімацію до кінця й на наступному ж
 * кроці колеса блок їхав геть — навести мишку на картку було просто нікуди.
 */
const PHASE_SETTLE = 0.38;
const EXPAND_START = PHASE_HOLD + PHASE_TITLE_FADE;
const EXPAND_COMPLETE = EXPAND_START + PHASE_EXPAND * 0.92;

export const AboutUs = () => {
  const { t, localizePath } = useLanguage();
  const titleLines = t("aboutUs.title");
  const sectionRef = useRef(null);
  const pinRef = useRef(null);
  const innerRef = useRef(null);
  const titleRef = useRef(null);
  const stageRef = useRef(null);
  const mainCardRef = useRef(null);
  const satelliteRefs = useRef({});
  const [isExpanded, setIsExpanded] = useState(false);
  const [isInteractive, setIsInteractive] = useState(false);
  const [activeId, setActiveId] = useState(null);
  const [line, setLine] = useState(null);
  const connectorPathRef = useRef(null);

  const setSatelliteRef = (id) => (node) => {
    if (node) satelliteRefs.current[id] = node;
  };

  const buildConnectorPath = useCallback((targetId, stage, main, satellite) => {
    const stageRect = stage.getBoundingClientRect();
    const mainRect = main.getBoundingClientRect();
    const satRect = satellite.getBoundingClientRect();

    const toLocal = (rect) => ({
      left: rect.left - stageRect.left,
      right: rect.right - stageRect.left,
      top: rect.top - stageRect.top,
      bottom: rect.bottom - stageRect.top,
      cx: rect.left + rect.width / 2 - stageRect.left,
      cy: rect.top + rect.height / 2 - stageRect.top,
    });

    const m = toLocal(mainRect);
    const s = toLocal(satRect);
    const stat = SATELLITE_STATS.find((item) => item.id === targetId);

    let points;

    if (stat?.position === "bottom-left") {
      const railY = Math.min(s.top - 28, m.cy - 32);

      points = [
        { x: s.left + 18, y: s.top },
        { x: s.left + 18, y: railY },
        { x: m.left - 10, y: railY },
        { x: m.left - 10, y: m.cy },
        { x: m.left, y: m.cy },
      ];
    } else if (stat?.position === "bottom-right") {
      points = [
        { x: s.left + 14, y: s.top + 10 },
        { x: s.left + 14, y: m.cy },
        { x: m.right, y: m.cy },
      ];
    } else if (stat?.position === "top-left") {
      /*
       * Найдовший шлях, і єдиний, який мусить когось обійти.
       *
       * Раніше лінія йшла з нижнього краю картки прямо вниз і потім праворуч —
       * тобто наскрізь по картці «Школи БПЛА», по її ж цифрі. Видно це було
       * добре: у наведеному стані з'єднувач лежить вище за ненаведені картки
       * (z-index 5 проти 4), тож він малювався просто поверх сусіда.
       *
       * Тепер лінія одразу відходить праворуч у вільний коридор між тією
       * карткою й головною, і вже там спускається. Ширину коридора рахуємо по
       * фактичному краю сусіда, а не константою: на вужчих екранах сцена
       * стискається, і зазор між ними змінюється.
       */
      const blocker = stage.querySelector(".about-us__card--bottom-left");
      const blockerRight = blocker
        ? blocker.getBoundingClientRect().right - stageRect.left
        : 0;
      const railX = Math.min(
        Math.max(blockerRight + 20, m.left - 48),
        m.left - 14,
      );

      points = [
        { x: s.cx, y: s.bottom },
        { x: s.cx, y: s.bottom + 34 },
        { x: railX, y: s.bottom + 34 },
        { x: railX, y: m.top + 28 },
        { x: m.left, y: m.top + 28 },
      ];
    } else {
      points = [
        { x: s.cx, y: s.cy },
        { x: m.cx, y: s.cy },
        { x: m.cx, y: m.cy },
      ];
    }

    return buildRoundedPath(points, 14);
  }, []);

  const updateConnector = useCallback(
    (targetId) => {
      const stage = stageRef.current;
      const main = mainCardRef.current;
      const satellite = targetId ? satelliteRefs.current[targetId] : null;

      if (!stage || !main || !satellite) {
        setLine(null);
        return;
      }

      setLine(buildConnectorPath(targetId, stage, main, satellite));
    },
    [buildConnectorPath],
  );

  const handleSatelliteEnter = (id) => {
    if (!isInteractive) return;
    setActiveId(id);
    updateConnector(id);
  };

  const handleSatelliteLeave = () => {
    setActiveId(null);
    setLine(null);
  };

  useEffect(() => {
    if (!activeId) return undefined;

    const handleResize = () => updateConnector(activeId);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [activeId, updateConnector]);

  /*
   * Промальовування лінії.
   *
   * Тут навмисно немає `getTotalLength()`, хоча це стандартний спосіб.
   * Проблема з ним у тому, що довжина міряється один раз, у момент запуску, і
   * все подальше залежить від того, чи справді ця цифра збіглася з тим, що
   * зараз у DOM. Варто їй виявитись меншою за реальну — і пунктир починає
   * повторюватись: перша частина лінії суцільна, далі прогалина. Ззовні це
   * виглядає рівно як «лінія не домальовується до кінця».
   *
   * Натомість у самого <path> стоїть pathLength="1": браузер сам приводить
   * довжину до одиниці, тому «весь шлях» — це завжди рівно 1, скільки б
   * пікселів він не мав насправді й коли б його не переміряли.
   *
   * І ще одне: щойно анімація добігла, пунктир вимикається зовсім. Стан
   * спокою в такий спосіб не залежить від жодних обчислень — це просто
   * суцільна лінія, і обірватись їй нема на чому.
   */
  useEffect(() => {
    const path = connectorPathRef.current;
    if (!path || !line) return undefined;

    gsap.killTweensOf(path);
    gsap.set(path, {
      strokeDasharray: 1,
      strokeDashoffset: 1,
      opacity: 1,
    });
    gsap.to(path, {
      strokeDashoffset: 0,
      duration: 0.5,
      ease: "power2.out",
      onComplete: () => gsap.set(path, { strokeDasharray: "none" }),
    });

    return () => gsap.killTweensOf(path);
  }, [line, activeId]);

  useEffect(() => {
    /*
     * Флаг скасування потрібен саме через fonts.ready: обіцянку не відписати,
     * і без нього глобальний ScrollTrigger.refresh() прилітав уже тоді, коли
     * людина пішла на іншу сторінку — і переміряв піни, яких тут уже немає.
     */
    let cancelled = false;
    const refreshScrollTriggers = () => {
      if (!cancelled) ScrollTrigger.refresh();
    };

    window.addEventListener("load", refreshScrollTriggers);
    document.fonts?.ready.then(refreshScrollTriggers).catch(() => {});

    return () => {
      cancelled = true;
      window.removeEventListener("load", refreshScrollTriggers);
    };
  }, []);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(
        "(min-width: 1025px) and (prefers-reduced-motion: no-preference)",
        () => {
          const section = sectionRef.current;
          const pinWrap = pinRef.current;
          const inner = innerRef.current;
          const title = titleRef.current;
          if (!section || !pinWrap || !inner) return undefined;

          const satellites = SATELLITE_STATS.map(
            (stat) => satelliteRefs.current[stat.id],
          ).filter(Boolean);
          const mainCard = mainCardRef.current;
          if (!mainCard || satellites.length === 0) return undefined;

          const stackSatellitesOnMain = () => {
            const mainRect = mainCard.getBoundingClientRect();
            const mainAnchor = {
              x: mainRect.left + mainRect.width / 2,
              y: mainRect.top + mainRect.height * 0.58,
            };

            satellites.forEach((satellite) => {
              const satRect = satellite.getBoundingClientRect();
              const satCx = satRect.left + satRect.width / 2;
              const satCy = satRect.top + satRect.height / 2;

              gsap.set(satellite, {
                autoAlpha: 0,
                x: mainAnchor.x - satCx,
                y: mainAnchor.y - satCy,
                scale: 0.9,
              });
            });
          };

          const resetPinnedScene = () => {
            gsap.set(mainCard, { autoAlpha: 1, scale: 1 });
            if (title) {
              gsap.set(title, { autoAlpha: 1, color: "#ffffff" });
            }
            stackSatellitesOnMain();
            setIsExpanded(false);
            setIsInteractive(false);
            setActiveId(null);
            setLine(null);
          };

          resetPinnedScene();

          const buildScrollTimeline = () => {
            stackSatellitesOnMain();

            const scrollTl = gsap.timeline({
              defaults: { ease: "power2.inOut" },
              scrollTrigger: {
                trigger: pinWrap,
                /*
                 * Блок має стояти по центру екрана, а не на фіксованих 14 %
                 * від верху: висота самого блока стала (630 px), а екрани
                 * різні, тому раніше на 1080 px під карточками лишалося
                 * майже 300 px пустоти, а на 760 px вони впритул тиснулися
                 * до низу. Відступ рахуємо від фактичної висоти блока —
                 * функція перечитується на кожному refresh.
                 */
                start: () => {
                  const blockHeight = inner.offsetHeight;
                  // шапка фіксована й лежить поверх сторінки, тому «центр
                  // екрана» для людини — це центр того, що нижче за неї
                  const headerHeight =
                    document.querySelector(".header")?.offsetHeight ?? 0;
                  const free = window.innerHeight - headerHeight - blockHeight;
                  const offset = Math.max(
                    24,
                    Math.round(headerHeight + free / 2),
                  );

                  return `top ${offset}px`;
                },
                end: () => `+=${window.innerHeight * PIN_SCROLL_VH}`,
                pin: inner,
                scrub: PIN_SCRUB,
                anticipatePin: 1,
                invalidateOnRefresh: true,
                onUpdate: (self) => {
                  const progress = self.progress;
                  setIsExpanded(progress >= EXPAND_START);
                  setIsInteractive(progress >= EXPAND_COMPLETE);
                },
                onLeave: () => {
                  setIsExpanded(true);
                  setIsInteractive(true);
                  gsap.set(satellites, { clearProps: "transform" });
                },
                onLeaveBack: resetPinnedScene,
              },
            });

            scrollTl.to({}, { duration: PHASE_HOLD });

            if (title) {
              scrollTl.to(
                title,
                {
                  autoAlpha: 0.22,
                  color: "rgba(255, 255, 255, 0.38)",
                  duration: PHASE_TITLE_FADE,
                  ease: "power1.inOut",
                },
                ">",
              );
            }

            scrollTl
              .to(
                satellites,
                {
                  autoAlpha: 1,
                  x: 0,
                  y: 0,
                  scale: 1,
                  stagger: 0.1,
                  duration: PHASE_EXPAND,
                  ease: "power2.out",
                },
                ">",
              )
              .to(
                mainCard,
                {
                  scale: 1.02,
                  duration: PHASE_EXPAND * 0.85,
                  ease: "power2.out",
                },
                "<0.06",
              )
              .set(satellites, { clearProps: "transform" })
              // витримка: блок стоїть на місці й доступний для мишки
              .to({}, { duration: PHASE_SETTLE });

            return scrollTl;
          };

          const scrollTl = buildScrollTimeline();

          const handleResize = () => {
            if (scrollTl.scrollTrigger?.progress < EXPAND_START) {
              stackSatellitesOnMain();
            }
          };

          window.addEventListener("resize", handleResize);

          return () => {
            window.removeEventListener("resize", handleResize);
            scrollTl.scrollTrigger?.kill();
            scrollTl.kill();
          };
        },
      );

      mm.add("(min-width: 1025px) and (prefers-reduced-motion: reduce)", () => {
        const section = sectionRef.current;
        if (!section) return;

        setIsExpanded(true);
        setIsInteractive(true);
        gsap.set(section.querySelectorAll(".about-us__card"), {
          autoAlpha: 1,
          x: 0,
          y: 0,
          scale: 1,
        });
        const title = titleRef.current;
        if (title) {
          gsap.set(title, {
            autoAlpha: 0.55,
            color: "rgba(255, 255, 255, 0.55)",
          });
        }
      });

      mm.add(
        "(max-width: 1024px) and (prefers-reduced-motion: no-preference)",
        () => {
          const section = sectionRef.current;
          const title = titleRef.current;
          if (!section) return;

          if (title) {
            gsap.fromTo(
              title,
              { color: "#ffffff" },
              {
                color: "rgba(255, 255, 255, 0.52)",
                ease: "none",
                scrollTrigger: {
                  trigger: section,
                  start: "top 78%",
                  end: "top 52%",
                  scrub: 0.75,
                },
              },
            );
          }

          const cards = gsap.utils.toArray(".about-us__card", section);
          if (!cards.length) return;

          cards.forEach((card) => {
            if (card.classList.contains("about-us__card--main")) {
              gsap.set(card, { xPercent: -50, force3D: true });
            }
          });

          gsap.fromTo(
            cards,
            { autoAlpha: 0, y: 28 },
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.7,
              ease: "power2.out",
              stagger: 0.12,
              scrollTrigger: {
                trigger: section,
                start: "top 55%",
                toggleActions: "play reverse play reverse",
              },
            },
          );
        },
      );

      mm.add("(max-width: 1024px) and (prefers-reduced-motion: reduce)", () => {
        const section = sectionRef.current;
        if (!section) return;

        gsap.set(section.querySelectorAll(".about-us__card"), {
          autoAlpha: 1,
          y: 0,
          scale: 1,
        });
      });

      mm.add("(prefers-reduced-motion: reduce)", () => {
        const title = titleRef.current;
        if (title) {
          gsap.set(title, { color: "rgba(255, 255, 255, 0.55)" });
        }
      });

      mm.add("(max-width: 1024px)", () => {
        setIsExpanded(true);
        setIsInteractive(true);
      });

      return () => mm.revert();
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      className={`about-us${isExpanded ? " about-us--expanded" : ""}${isInteractive ? " about-us--interactive" : ""}${activeId ? " about-us--linked" : ""}`}
      aria-labelledby="about-us-title"
    >
      <div className="about-us__glow" aria-hidden="true" />

      <div ref={pinRef} className="about-us__pin">
        <div ref={innerRef} className="about-us__inner">
          <h2 id="about-us-title" ref={titleRef} className="about-us__title">
            {titleLines.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </h2>

          <div ref={stageRef} className="about-us__stage">
            <svg
              className="about-us__connector"
              aria-hidden="true"
              width="100%"
              height="100%"
            >
              {line ? (
                <path
                  ref={connectorPathRef}
                  d={line}
                  /* Уся довжина шляху = 1, див. пояснення біля анімації */
                  pathLength="1"
                  className="about-us__connector-line"
                  fill="none"
                />
              ) : null}
            </svg>

            <article
              ref={mainCardRef}
              className="about-us__card about-us__card--main"
            >
              {/*
                Кільце, яке світиться і рухається. Окремий елемент, а не
                псевдоелемент, саме щоб рух можна було зробити через
                transform: тоді браузер зсуває готовий шар, а не перемальовує
                градієнт на кожен кадр. Деталі — у style.css.
              */}
              <span className="about-us__card-flow" aria-hidden="true">
                <span className="about-us__card-flow-layer" />
              </span>

              <p className="about-us__card-label about-us__mobile-only">
                {t("aboutUs.main.mobileLabel")}
              </p>
              <p className="about-us__card-desc about-us__desktop-only">
                {t("aboutUs.main.mobileLabel")}
              </p>
              <p className="about-us__card-value">{MAIN_STAT.value}</p>
            </article>

            {SATELLITE_STATS.map((stat) => (
              <article
                key={stat.id}
                ref={setSatelliteRef(stat.id)}
                className={`about-us__card about-us__card--satellite about-us__card--${stat.position}${activeId === stat.id ? " about-us__card--active" : ""}`}
                onMouseEnter={() => handleSatelliteEnter(stat.id)}
                onMouseLeave={handleSatelliteLeave}
                onFocus={() => handleSatelliteEnter(stat.id)}
                onBlur={handleSatelliteLeave}
                tabIndex={isInteractive ? 0 : -1}
                aria-disabled={!isInteractive}
              >
                <p className="about-us__card-label about-us__mobile-only">
                  {t(`aboutUs.satellites.${stat.id}.mobileLabel`)}
                </p>
                <p className="about-us__card-desc about-us__desktop-only">
                  {t(`aboutUs.satellites.${stat.id}.mobileLabel`)}
                </p>
                <p className="about-us__card-value">{stat.value}</p>
              </article>
            ))}
          </div>

          <Button
            href={localizePath("/about-us")}
            className="about-us__cta"
            variant="default"
          >
            {t("aboutUs.aboutBtn")}
          </Button>
        </div>
      </div>
    </section>
  );
};
