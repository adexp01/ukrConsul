import { useRef, useState, useCallback, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Button } from "../UI/Button";
import { useLanguage } from "../../i18n/LanguageContext";
import "./style.css";

const MAIN_STAT = {
  id: "companies",
  value: "350+",
};

const SATELLITE_STATS = [
  { id: "manufacturers", value: "300+", position: "top-left" },
  { id: "schools", value: "28", position: "bottom-left" },
  { id: "funds", value: "20", position: "bottom-right" },
];

const PIN_SCROLL_VH = 2.1;
const PIN_SCRUB = 1.15;
const PHASE_HOLD = 0.34;
const PHASE_TITLE_FADE = 0.22;
const PHASE_EXPAND = 0.44;
const EXPAND_START = PHASE_HOLD + PHASE_TITLE_FADE;
const EXPAND_COMPLETE = EXPAND_START + PHASE_EXPAND * 0.92;

gsap.registerPlugin(ScrollTrigger, useGSAP);

const buildRoundedPath = (points, radius = 12) => {
  if (points.length < 2) return "";

  if (points.length === 2) {
    return `M ${points[0].x} ${points[0].y} L ${points[1].x} ${points[1].y}`;
  }

  let path = `M ${points[0].x} ${points[0].y}`;

  for (let i = 1; i < points.length - 1; i += 1) {
    const prev = points[i - 1];
    const curr = points[i];
    const next = points[i + 1];

    const v1x = curr.x - prev.x;
    const v1y = curr.y - prev.y;
    const v2x = next.x - curr.x;
    const v2y = next.y - curr.y;

    const len1 = Math.hypot(v1x, v1y) || 1;
    const len2 = Math.hypot(v2x, v2y) || 1;
    const cornerRadius = Math.min(radius, len1 / 2, len2 / 2);

    const start = {
      x: curr.x - (v1x / len1) * cornerRadius,
      y: curr.y - (v1y / len1) * cornerRadius,
    };
    const end = {
      x: curr.x + (v2x / len2) * cornerRadius,
      y: curr.y + (v2y / len2) * cornerRadius,
    };

    path += ` L ${start.x} ${start.y} Q ${curr.x} ${curr.y} ${end.x} ${end.y}`;
  }

  const last = points[points.length - 1];
  path += ` L ${last.x} ${last.y}`;

  return path;
};

export const AboutUs = () => {
  const { t } = useLanguage();
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
      points = [
        { x: s.cx, y: s.bottom },
        { x: s.cx, y: m.top + 28 },
        { x: m.left + 36, y: m.top + 28 },
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

  useEffect(() => {
    const path = connectorPathRef.current;
    if (!path || !line) return undefined;

    const length = path.getTotalLength();
    gsap.killTweensOf(path);
    gsap.set(path, {
      strokeDasharray: length,
      strokeDashoffset: length,
      opacity: 1,
    });
    gsap.to(path, {
      strokeDashoffset: 0,
      duration: 0.5,
      ease: "power2.out",
    });

    return () => gsap.killTweensOf(path);
  }, [line, activeId]);

  useEffect(() => {
    const refreshScrollTriggers = () => ScrollTrigger.refresh();

    window.addEventListener("load", refreshScrollTriggers);
    document.fonts?.ready.then(refreshScrollTriggers).catch(() => {});

    return () => window.removeEventListener("load", refreshScrollTriggers);
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
                start: "top 14%",
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
              .set(satellites, { clearProps: "transform" });

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
          gsap.set(title, { autoAlpha: 0.55, color: "rgba(255, 255, 255, 0.55)" });
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

      mm.add(
        "(max-width: 1024px) and (prefers-reduced-motion: reduce)",
        () => {
          const section = sectionRef.current;
          if (!section) return;

          gsap.set(section.querySelectorAll(".about-us__card"), {
            autoAlpha: 1,
            y: 0,
            scale: 1,
          });
        },
      );

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
                className="about-us__connector-line"
                fill="none"
              />
            ) : null}
          </svg>

          <article
            ref={mainCardRef}
            className="about-us__card about-us__card--main"
          >
            <p className="about-us__card-label about-us__mobile-only">
              {t("aboutUs.main.mobileLabel")}
            </p>
            <p className="about-us__card-desc about-us__desktop-only">
              {t("aboutUs.main.description")}
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
                {t(`aboutUs.satellites.${stat.id}.description`)}
              </p>
              <p className="about-us__card-value">{stat.value}</p>
            </article>
          ))}
          </div>

          <Button href="#" className="about-us__cta" variant="default">
            {t("aboutUs.aboutBtn")}
          </Button>
        </div>
      </div>
    </section>
  );
};
