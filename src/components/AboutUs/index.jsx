import { useRef, useState, useCallback, useEffect } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Button } from "../UI/Button";
import "./style.css";

const MAIN_STAT = {
  id: "companies",
  value: "350+",
  mobileLabel: "Participants",
  description: "Companies united in one defence ecosystem",
};

const SATELLITE_STATS = [
  {
    id: "manufacturers",
    value: "300+",
    mobileLabel: "Manufacturers",
    description: "Private defence manufacturers in the ecosystem",
    position: "top-left",
  },
  {
    id: "schools",
    value: "28",
    mobileLabel: "UAV schools",
    description: "UAV schools training the next generation",
    position: "bottom-left",
  },
  {
    id: "funds",
    value: "20",
    mobileLabel: "Venture funds",
    description: "Private defence venture funds investing in defence innovation",
    position: "bottom-right",
  },
];

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
  const sectionRef = useRef(null);
  const stageRef = useRef(null);
  const mainCardRef = useRef(null);
  const satelliteRefs = useRef({});
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeId, setActiveId] = useState(null);
  const [line, setLine] = useState(null);

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
    if (!isExpanded) return;
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

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(min-width: 1025px)", () => {
        const section = sectionRef.current;
        if (!section) return;

        const satellites = section.querySelectorAll(".about-us__card--satellite");
        const mainCard = section.querySelector(".about-us__card--main");

        gsap.set(satellites, { autoAlpha: 0, y: 28, scale: 0.96 });
        gsap.set(mainCard, { autoAlpha: 1, scale: 1 });

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top 55%",
            end: "+=520",
            scrub: 0.85,
            onEnter: () => setIsExpanded(false),
            onLeave: () => {},
            onUpdate: (self) => {
              setIsExpanded(self.progress > 0.35);
            },
          },
        });

        tl.to(mainCard, {
          scale: 1.02,
          duration: 0.4,
        }).to(
          satellites,
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            stagger: 0.12,
            duration: 0.5,
          },
          0.15,
        );
      });

      mm.add(
        "(max-width: 1024px) and (prefers-reduced-motion: no-preference)",
        () => {
          const section = sectionRef.current;
          if (!section) return;

          const cards = section.querySelectorAll(".about-us__card");
          cards.forEach((card, index) => {
            if (card.classList.contains("about-us__card--main")) {
              gsap.set(card, { xPercent: -50, force3D: true });
            }

            gsap.to(card, {
              y: index % 2 === 0 ? -7 : 7,
              duration: 2.4 + index * 0.15,
              ease: "sine.inOut",
              yoyo: true,
              repeat: -1,
            });
          });
        },
      );

      mm.add("(max-width: 1024px)", () => {
        const section = sectionRef.current;
        if (!section) return;

        gsap.set(section.querySelectorAll(".about-us__card"), {
          autoAlpha: 1,
          y: 0,
          scale: 1,
        });
        setIsExpanded(true);
      });

      return () => mm.revert();
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      className={`about-us${isExpanded ? " about-us--expanded" : ""}`}
      aria-labelledby="about-us-title"
    >
      <div className="about-us__glow" aria-hidden="true" />

      <div className="about-us__inner">
        <h2 id="about-us-title" className="about-us__title">
          <span>THE LARGEST</span>
          <span>ASSOCIATION OF PRIVATE</span>
          <span>ARMS</span>
          <span>MANUFACTURERS</span>
        </h2>

        <div ref={stageRef} className="about-us__stage">
          <svg
            className="about-us__connector"
            aria-hidden="true"
            width="100%"
            height="100%"
          >
            {line ? (
              <path d={line} className="about-us__connector-line" fill="none" />
            ) : null}
          </svg>

          <article
            ref={mainCardRef}
            className="about-us__card about-us__card--main"
          >
            <p className="about-us__card-label about-us__mobile-only">
              {MAIN_STAT.mobileLabel}
            </p>
            <p className="about-us__card-desc about-us__desktop-only">
              {MAIN_STAT.description}
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
              tabIndex={isExpanded ? 0 : -1}
            >
              <p className="about-us__card-label about-us__mobile-only">
                {stat.mobileLabel}
              </p>
              <p className="about-us__card-desc about-us__desktop-only">
                {stat.description}
              </p>
              <p className="about-us__card-value">{stat.value}</p>
            </article>
          ))}
        </div>

        <Button href="#" className="about-us__cta">
          About us
        </Button>
      </div>
    </section>
  );
};
