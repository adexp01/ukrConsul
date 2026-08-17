import { useEffect, useRef } from "react";
import "./style.css";

/*
 * Фон сторінки за макетом.
 *
 * Ідея дизайну: сторінка суцільно чорна (#050508), а весь декор — це кілька
 * окремих градієнтних блоків із фіксованою геометрією, покладених поверх неї.
 *
 * Так було не завжди: раніше фон малювали шість SVG (bg1…bg6), натягнутих
 * через background-size: cover у десяти різних місцях. Через cover градієнт
 * розтягувався під висоту сторінки — на довгій сторінці розмазувався, на
 * короткій обрізався, і жодного фіксованого відступу 60 px не існувало.
 *
 * Геометрія взята з макета один в один (фрейм «Головна», 1440×7739):
 *   Градієнт 1 — 1784 px (два шари по 892)
 *   Градієнт 2 — 1554 px (два шари по 777)
 *   Градієнт 3 — 1554 px (два шари по 777)
 *   Градієнт 4 — 1784 px (два шари по 892)
 *   Градієнт 5 — 753 px (один шар), прив'язаний до низу сторінки
 * Між градієнтами 1–4 завжди 60 px, і ця відстань не залежить ні від
 * контенту, ні від висоти екрана.
 */

/** Відступ від нижньої межі блока-якоря до верхньої межі другого кола */
const CIRCLE_TWO_OFFSET = 351;

/**
 * @param {object} props
 * @param {number[]} props.blocks які з градієнтів 1–4 присутні, у порядку зверху вниз
 * @param {boolean} props.final чи є п'ятий градієнт біля футера
 * @param {boolean} props.circleOne декоративне коло на першому градієнті
 * @param {string|null} props.circleTwoAnchor
 *   CSS-селектор блока, до нижньої межі якого прив'язане друге коло.
 *   Саме блока, а не сторінки: якщо контент вище зміниться, коло поїде разом
 *   із ним, зберігаючи 351 px.
 */
export const PageGradients = ({
  blocks = [1, 2, 3, 4],
  final = true,
  circleOne = true,
  circleTwoAnchor = null,
}) => {
  const rootRef = useRef(null);
  const circleTwoRef = useRef(null);

  useEffect(() => {
    if (!circleTwoAnchor) return undefined;

    const root = rootRef.current;
    const circle = circleTwoRef.current;
    if (!root || !circle) return undefined;

    let frame = 0;

    const place = () => {
      const anchor = document.querySelector(circleTwoAnchor);

      // Блока-якоря на цій сторінці немає — тоді й кола бути не повинно
      if (!anchor) {
        circle.style.display = "none";
        return;
      }

      circle.style.display = "";

      const rootTop = root.getBoundingClientRect().top + window.scrollY;
      const anchorBottom = anchor.getBoundingClientRect().bottom + window.scrollY;

      /*
       * 351 px — до верхньої межі самого еліпса, а елемент більший за нього
       * на поле розмиття з кожного боку, тому це поле віднімаємо.
       * Масштаб береться з --gradient-unit: на вузьких екранах він менший за 1.
       */
      const styles = getComputedStyle(root);
      const scale =
        Number.parseFloat(styles.getPropertyValue("--gradient-unit")) || 1;
      const spread =
        Number.parseFloat(styles.getPropertyValue("--circle-spread")) || 0;

      circle.style.top = `${
        anchorBottom - rootTop + (CIRCLE_TWO_OFFSET - spread) * scale
      }px`;
    };

    const schedule = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(place);
    };

    schedule();

    /*
     * Слухаємо і сам якір, і body: висота сторінки змінюється від підгрузки
     * новин, картинок і перемикання вкладок, а коло має їхати за блоком.
     */
    const observer = new ResizeObserver(schedule);
    observer.observe(document.body);

    const anchor = document.querySelector(circleTwoAnchor);
    if (anchor) observer.observe(anchor);

    window.addEventListener("resize", schedule);
    document.fonts?.ready.then(schedule).catch(() => {});

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("resize", schedule);
    };
  }, [circleTwoAnchor]);

  return (
    <div ref={rootRef} className="page-gradients" aria-hidden="true">
      {/* Градієнти 1–4: послідовно, з відступом 60 px між сусідніми */}
      <div className="page-gradients__stack">
        {blocks.map((id) => (
          <div
            key={id}
            className={`page-gradients__block page-gradients__block--${id}`}
          >
            <span className="page-gradients__layer page-gradients__layer--a" />
            <span className="page-gradients__layer page-gradients__layer--b" />
          </div>
        ))}
      </div>

      {circleOne ? (
        <span className="page-gradients__circle page-gradients__circle--one" />
      ) : null}

      {circleTwoAnchor ? (
        <span
          ref={circleTwoRef}
          className="page-gradients__circle page-gradients__circle--two"
        />
      ) : null}

      {/*
        П'ятий градієнт не бере участі в ланцюжку 60 px: він прив'язаний
        до кінця сторінки, тобто до футера.
      */}
      {final ? (
        <div className="page-gradients__block page-gradients__block--5">
          <span className="page-gradients__layer page-gradients__layer--a" />
        </div>
      ) : null}
    </div>
  );
};
