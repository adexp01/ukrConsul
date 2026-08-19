import { useCallback, useLayoutEffect, useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { gsap } from "../../animation/gsapSetup";
import { buildRoundedPath } from "../../utils/roundedPath";
import { Button } from "../UI/Button";
import { useJoinQuiz } from "../JoinQuiz/JoinQuizContext";
import { isJoinTarget } from "../JoinQuiz/joinCta";
import "./style.css";

/*
 * Лінії між заголовком, репліками й кнопкою — той самий прийом, що в блоці
 * EXPORT MAP. Без них дві невеликі картки висіли по діагоналі в майже
 * порожній секції (заміряно: 745px висоти на картки 140 і 204), і блок
 * читався як недороблений. Лінії роблять цю пустоту навмисною: видно, що це
 * схема, а не два випадкові прямокутники.
 *
 * Геометрію доводиться міряти в рантаймі: позиції карток залежать від
 * довжини тексту й ширини екрана, тому в CSS її не зашити.
 */
const CORNER = 14;

/** Скільки лінія має пройти по вертикалі, перш ніж заходити в картку */
const MIN_ENTRY = 40;

const hideStroke = (path) => {
  if (!path) return;
  gsap.set(path, { strokeDasharray: 1, strokeDashoffset: 1 });
};

/*
 * Кінцевий стан — суцільна лінія, без пунктиру. Так стан спокою не залежить
 * від обчислень: обірватись такій лінії нема на чому, навіть якщо геометрія
 * перерахується після зміни ширини.
 */
const showStroke = (path) => {
  if (!path) return;
  gsap.set(path, { strokeDashoffset: 0, strokeDasharray: "none" });
};

/**
 * Вступний блок вкладки «Діяльності»: великий заголовок і дві репліки,
 * зсунуті одна відносно одної, як у дизайні. Знизу — необовʼязкова кнопка.
 *
 * Використовують і «Виставкова діяльність», і «Партнерська екосистема»,
 * бо в макеті це один і той самий патерн.
 */
export const OfficeIntro = ({
  title,
  accentText,
  cardTitle,
  cardText,
  ctaLabel,
  ctaHref,
  titleId,
}) => {
  const { openJoinQuiz } = useJoinQuiz();
  const ctaProps = isJoinTarget(ctaHref)
    ? { onClick: openJoinQuiz }
    : { href: ctaHref };

  const sectionRef = useRef(null);
  const innerRef = useRef(null);
  const titleRef = useRef(null);
  const accentRef = useRef(null);
  const lightRef = useRef(null);
  const ctaRef = useRef(null);
  const pathTopRef = useRef(null);
  const pathMidRef = useRef(null);
  const pathBottomRef = useRef(null);
  const revealedRef = useRef(false);
  const geometryKeyRef = useRef("");

  const [geometry, setGeometry] = useState(null);

  const measure = useCallback(() => {
    const inner = innerRef.current;
    const heading = titleRef.current;
    const accent = accentRef.current;
    const light = lightRef.current;

    if (!inner || !heading || !accent || !light) return;

    const box = inner.getBoundingClientRect();
    const local = (el) => {
      const r = el.getBoundingClientRect();
      return {
        left: r.left - box.left,
        right: r.right - box.left,
        top: r.top - box.top,
        bottom: r.bottom - box.top,
        cx: r.left + r.width / 2 - box.left,
        cy: r.top + r.height / 2 - box.top,
      };
    };

    const h = local(heading);
    const a = local(accent);
    const l = local(light);
    const cta = ctaRef.current ? local(ctaRef.current) : null;

    // Від заголовка вниз, потім праворуч і у верхній край акцентної картки
    const railTop = Math.max(h.bottom + 28, a.top - MIN_ENTRY);
    const top = buildRoundedPath(
      [
        { x: h.left + 24, y: h.bottom + 10 },
        { x: h.left + 24, y: railTop },
        { x: a.cx, y: railTop },
        { x: a.cx, y: a.top },
      ],
      CORNER,
    );

    // Від низу акцентної — ліворуч і в правий край світлої
    const mid = buildRoundedPath(
      [
        { x: a.cx, y: a.bottom },
        { x: a.cx, y: l.cy },
        { x: l.right, y: l.cy },
      ],
      CORNER,
    );

    // Від низу світлої — до кнопки, якщо вона є
    const bottom = cta
      ? buildRoundedPath(
          [
            { x: l.left + 32, y: l.bottom },
            { x: l.left + 32, y: (l.bottom + cta.top) / 2 },
            { x: cta.left + 24, y: (l.bottom + cta.top) / 2 },
            { x: cta.left + 24, y: cta.top },
          ],
          CORNER,
        )
      : null;

    const next = {
      width: Math.round(box.width),
      height: Math.round(box.height),
      top,
      mid,
      bottom,
    };

    /*
     * Порівнюємо перед записом у стан. Інакше кожен ресайз на один піксель
     * створює новий обʼєкт, від нього залежить useGSAP — і вся анімація
     * перебудовується на кожен піксель ширини.
     */
    const key = JSON.stringify(next);
    if (key === geometryKeyRef.current) return;
    geometryKeyRef.current = key;
    setGeometry(next);
  }, []);

  useLayoutEffect(() => {
    measure();

    const onResize = () => measure();
    window.addEventListener("resize", onResize);

    let cancelled = false;
    // Шрифт міняє висоту заголовка, тобто й точку, з якої виходить перша лінія
    document.fonts?.ready.then(() => {
      if (!cancelled) measure();
    });

    return () => {
      cancelled = true;
      window.removeEventListener("resize", onResize);
    };
  }, [measure, title, accentText, cardText]);

  const paths = useCallback(
    () => [pathTopRef.current, pathMidRef.current, pathBottomRef.current],
    [],
  );

  useGSAP(
    () => {
      const section = sectionRef.current;
      if (!section || !geometry) return undefined;

      const mm = gsap.matchMedia();

      mm.add(
        "(min-width: 901px) and (prefers-reduced-motion: no-preference)",
        () => {
          /*
           * Показ буває один раз. Далі будь-який перерахунок геометрії лише
           * виставляє кінцевий стан: інакше зміна ширини вікна ховала б лінії
           * заново, а тригер уже відпрацював і вдруге не спрацює.
           */
          if (revealedRef.current) {
            paths().forEach(showStroke);
            return undefined;
          }

          paths().forEach(hideStroke);

          const tl = gsap.timeline({
            scrollTrigger: { trigger: section, start: "top 82%", once: true },
            onComplete: () => {
              revealedRef.current = true;
              paths().forEach(showStroke);
            },
          });

          paths()
            .filter(Boolean)
            .forEach((path, index) => {
              tl.to(
                path,
                { strokeDashoffset: 0, duration: 0.46, ease: "power2.inOut" },
                index === 0 ? 0 : "-=0.16",
              );
            });

          return () => {
            tl.scrollTrigger?.kill();
            tl.kill();
          };
        },
      );

      mm.add("(prefers-reduced-motion: reduce)", () => {
        revealedRef.current = true;
        paths().forEach(showStroke);
      });

      return () => mm.revert();
    },
    { scope: sectionRef, dependencies: [geometry, paths] },
  );

  return (
    <section
      ref={sectionRef}
      className="office-intro"
      aria-labelledby={titleId}
    >
      <div ref={innerRef} className="office-intro__inner">
        {geometry ? (
          <svg
            className="office-intro__connector"
            viewBox={`0 0 ${geometry.width} ${geometry.height}`}
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path
              ref={pathTopRef}
              className="office-intro__connector-path"
              d={geometry.top}
              pathLength="1"
              fill="none"
            />
            <path
              ref={pathMidRef}
              className="office-intro__connector-path"
              d={geometry.mid}
              pathLength="1"
              fill="none"
            />
            {geometry.bottom ? (
              <path
                ref={pathBottomRef}
                className="office-intro__connector-path"
                d={geometry.bottom}
                pathLength="1"
                fill="none"
              />
            ) : null}
          </svg>
        ) : null}

        <h2 ref={titleRef} id={titleId} className="office-intro__title">
          {title}
        </h2>

        <div className="office-intro__stage">
          <article
            ref={accentRef}
            className="office-intro__card office-intro__card--accent"
          >
            <p>{accentText}</p>
          </article>

          <article
            ref={lightRef}
            className="office-intro__card office-intro__card--light"
          >
            {cardTitle ? (
              <h3 className="office-intro__card-title">{cardTitle}</h3>
            ) : null}
            <p>{cardText}</p>
          </article>
        </div>

        {ctaLabel ? (
          <div ref={ctaRef} className="office-intro__cta">
            <Button {...ctaProps} variant="primary">
              {ctaLabel}
            </Button>
          </div>
        ) : null}
      </div>
    </section>
  );
};
