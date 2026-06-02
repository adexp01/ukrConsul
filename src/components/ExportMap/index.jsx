import { useRef, useState, useLayoutEffect, useCallback } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Button } from "../UI/Button";
import { useLanguage } from "../../i18n/LanguageContext";
import bgOffice from "../../assets/bgOffice.png";
import "./style.css";

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

const prepareStrokePath = (pathEl) => {
  if (!pathEl) return 0;

  const length = pathEl.getTotalLength();
  gsap.set(pathEl, {
    strokeDasharray: length,
    strokeDashoffset: length,
  });
  return length;
};

const buildConnectorGeometry = (inner, xAnchor, upperCard, lowerCard, cta) => {
  const innerRect = inner.getBoundingClientRect();
  const toLocal = (el) => {
    const r = el.getBoundingClientRect();
    return {
      top: r.top - innerRect.top,
      bottom: r.bottom - innerRect.top,
      right: r.right - innerRect.left,
      cx: r.left + r.width / 2 - innerRect.left,
      cy: r.top + r.height / 2 - innerRect.top,
    };
  };

  const x = toLocal(xAnchor);
  const upper = toLocal(upperCard);
  const lower = toLocal(lowerCard);
  const button = toLocal(cta);

  const startX = x.cx;
  const startY = x.bottom + 6;
  const endX = upper.cx;
  const endY = upper.top;
  const minEntryLength = 44;
  const railY = Math.max(x.bottom + 32, upper.top - minEntryLength);

  const path = buildRoundedPath(
    [
      { x: startX, y: startY },
      { x: startX, y: railY },
      { x: endX, y: railY },
      { x: endX, y: endY },
    ],
    14,
  );

  const pathSecondary = buildRoundedPath(
    [
      { x: upper.cx, y: upper.bottom },
      { x: upper.cx, y: lower.cy },
      { x: lower.right, y: lower.cy },
    ],
    14,
  );

  const ctaRailY = (lower.bottom + button.top) / 2;
  const pathTertiary = buildRoundedPath(
    [
      { x: lower.cx, y: lower.bottom },
      { x: lower.cx, y: ctaRailY },
      { x: button.cx, y: ctaRailY },
      { x: button.cx, y: button.top },
    ],
    14,
  );

  const dashMid = (startX + endX) / 2;
  const dashHalf = 36;

  return {
    width: innerRect.width,
    height: innerRect.height,
    path,
    pathSecondary,
    pathTertiary,
    dash: {
      x1: dashMid - dashHalf,
      y1: railY,
      x2: dashMid + dashHalf,
      y2: railY,
    },
  };
};

export const ExportMap = () => {
  const { t } = useLanguage();
  const copy = t("office.exportMap");
  const sectionRef = useRef(null);
  const innerRef = useRef(null);
  const xAnchorRef = useRef(null);
  const upperCardRef = useRef(null);
  const lowerCardRef = useRef(null);
  const ctaRef = useRef(null);
  const pathPrimaryRef = useRef(null);
  const pathSecondaryRef = useRef(null);
  const pathTertiaryRef = useRef(null);
  const dashRef = useRef(null);
  const [connector, setConnector] = useState(null);

  const updateConnector = useCallback(() => {
    const inner = innerRef.current;
    const xAnchor = xAnchorRef.current;
    const upperCard = upperCardRef.current;
    const lowerCard = lowerCardRef.current;
    const cta = ctaRef.current;

    if (!inner || !xAnchor || !upperCard || !lowerCard || !cta) {
      setConnector(null);
      return;
    }

    if (window.matchMedia("(max-width: 1024px)").matches) {
      setConnector(null);
      return;
    }

    setConnector(
      buildConnectorGeometry(inner, xAnchor, upperCard, lowerCard, cta),
    );
  }, []);

  useLayoutEffect(() => {
    updateConnector();

    const inner = innerRef.current;
    if (!inner) return undefined;

    const observer = new ResizeObserver(updateConnector);
    observer.observe(inner);
    if (xAnchorRef.current) observer.observe(xAnchorRef.current);
    if (upperCardRef.current) observer.observe(upperCardRef.current);
    if (lowerCardRef.current) observer.observe(lowerCardRef.current);
    if (ctaRef.current) observer.observe(ctaRef.current);

    window.addEventListener("resize", updateConnector);
    document.fonts?.ready.then(updateConnector).catch(() => {});

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateConnector);
    };
  }, [updateConnector, copy.title]);

  useLayoutEffect(() => {
    if (!connector) return;

    prepareStrokePath(pathPrimaryRef.current);
    prepareStrokePath(pathSecondaryRef.current);
    prepareStrokePath(pathTertiaryRef.current);
    if (dashRef.current) gsap.set(dashRef.current, { autoAlpha: 0 });
  }, [connector]);

  useGSAP(
    () => {
      const section = sectionRef.current;
      const upperCard = upperCardRef.current;
      const lowerCard = lowerCardRef.current;
      const cta = ctaRef.current;

      if (!section || !upperCard || !lowerCard || !cta) return undefined;

      const mm = gsap.matchMedia();

      mm.add(
        "(min-width: 1025px) and (prefers-reduced-motion: no-preference)",
        () => {
          const pathPrimary = pathPrimaryRef.current;
          const pathSecondary = pathSecondaryRef.current;
          const pathTertiary = pathTertiaryRef.current;
          const dash = dashRef.current;

          const lenPrimary = prepareStrokePath(pathPrimary);
          const lenSecondary = prepareStrokePath(pathSecondary);
          const lenTertiary = prepareStrokePath(pathTertiary);

          gsap.set([upperCard, lowerCard], { autoAlpha: 0.14 });
          gsap.set(cta, { autoAlpha: 0, y: 14 });
          if (dash) gsap.set(dash, { autoAlpha: 0 });

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: section,
              start: "top 78%",
              once: true,
            },
          });

          if (pathPrimary && lenPrimary) {
            tl.to(pathPrimary, {
              strokeDashoffset: 0,
              duration: 0.9,
              ease: "power2.inOut",
            });
          }

          if (dash) {
            tl.to(
              dash,
              { autoAlpha: 1, duration: 0.28, ease: "power2.out" },
              "-=0.42",
            );
          }

          tl.to(
            upperCard,
            { autoAlpha: 1, duration: 0.55, ease: "power2.out" },
            "-=0.08",
          );

          if (pathSecondary && lenSecondary) {
            tl.to(pathSecondary, {
              strokeDashoffset: 0,
              duration: 0.8,
              ease: "power2.inOut",
            });
          }

          tl.to(lowerCard, { autoAlpha: 1, duration: 0.55, ease: "power2.out" });

          if (pathTertiary && lenTertiary) {
            tl.to(pathTertiary, {
              strokeDashoffset: 0,
              duration: 0.75,
              ease: "power2.inOut",
            });
          }

          tl.to(
            cta,
            { autoAlpha: 1, y: 0, duration: 0.5, ease: "power2.out" },
            "-=0.12",
          );

          return () => {
            tl.scrollTrigger?.kill();
            tl.kill();
          };
        },
      );

      mm.add(
        "(max-width: 1024px) and (prefers-reduced-motion: no-preference)",
        () => {
          gsap.set([upperCard, lowerCard, cta], { autoAlpha: 0, y: 18 });

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: section,
              start: "top 82%",
              once: true,
            },
          });

          tl.to(upperCard, {
            autoAlpha: 1,
            y: 0,
            duration: 0.5,
            ease: "power2.out",
          })
            .to(
              lowerCard,
              { autoAlpha: 1, y: 0, duration: 0.5, ease: "power2.out" },
              "-=0.28",
            )
            .to(
              cta,
              { autoAlpha: 1, y: 0, duration: 0.45, ease: "power2.out" },
              "-=0.22",
            );

          return () => {
            tl.scrollTrigger?.kill();
            tl.kill();
          };
        },
      );

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set([upperCard, lowerCard, cta], { autoAlpha: 1, y: 0 });

        [pathPrimaryRef, pathSecondaryRef, pathTertiaryRef].forEach((ref) => {
          if (ref.current) {
            gsap.set(ref.current, { strokeDashoffset: 0, clearProps: "strokeDasharray" });
          }
        });

        if (dashRef.current) gsap.set(dashRef.current, { autoAlpha: 1 });
      });

      return () => mm.revert();
    },
    { scope: sectionRef, dependencies: [connector, copy.title] },
  );

  return (
    <section
      ref={sectionRef}
      className="export-map"
      aria-labelledby="export-map-title"
    >
      <div className="export-map__backdrop" aria-hidden="true" />
      <div className="export-map__glow" aria-hidden="true" />

      <img
        className="export-map__visual"
        src={bgOffice}
        alt=""
        loading="lazy"
        decoding="async"
      />

      <div ref={innerRef} className="export-map__inner">
        {connector ? (
          <svg
            className="export-map__connector"
            viewBox={`0 0 ${connector.width} ${connector.height}`}
            width={connector.width}
            height={connector.height}
            aria-hidden="true"
          >
            <path
              ref={pathPrimaryRef}
              className="export-map__connector-path export-map__connector-path--primary"
              d={connector.path}
              fill="none"
            />
            <path
              ref={pathSecondaryRef}
              className="export-map__connector-path export-map__connector-path--secondary"
              d={connector.pathSecondary}
              fill="none"
            />
            <path
              ref={pathTertiaryRef}
              className="export-map__connector-path export-map__connector-path--tertiary"
              d={connector.pathTertiary}
              fill="none"
            />
            <line
              ref={dashRef}
              className="export-map__connector-dash"
              x1={connector.dash.x1}
              y1={connector.dash.y1}
              x2={connector.dash.x2}
              y2={connector.dash.y2}
            />
          </svg>
        ) : null}

        <header className="export-map__head">
          <h2 id="export-map-title" className="export-map__title">
            E<span ref={xAnchorRef} className="export-map__title-anchor">
              X
            </span>
            PORT MAP
          </h2>
        </header>

        <div className="export-map__stage">
          <article
            ref={lowerCardRef}
            className="export-map__card export-map__card--left"
          >
            <p>{copy.cardLeft}</p>
          </article>

          <article
            ref={upperCardRef}
            className="export-map__card export-map__card--right"
          >
            <p>{copy.cardRight}</p>
          </article>
        </div>

        <div ref={ctaRef} className="export-map__cta-wrap">
          <Button href={copy.ctaHref} variant="primary" className="export-map__cta">
            {copy.cta}
          </Button>
        </div>
      </div>
    </section>
  );
};
