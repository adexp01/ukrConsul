import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import "./style.css";

gsap.registerPlugin(ScrollTrigger);

/*
 * Один рушій появи тексту на весь сайт.
 *
 * Заголовки виїжджають з-під маски рядок за рядком, абзаци й списки
 * підіймаються з легкого розмиття. Нічого не потрібно додавати в компоненти:
 * після кожного переходу між сторінками рушій сам знаходить нову розмітку.
 *
 * Чому так, а не хук у кожному компоненті: заголовків на сайті під сотню,
 * і тримати їх ритм однаковим простіше з одного місця.
 */

const HEADINGS = "h1, h2, h3";
const TEXT_BLOCKS = "p, li, blockquote, figcaption";
const MIN_TEXT_LENGTH = 24;

/*
 * Блоки, які мають власну хореографію — рушій їх не торкається, інакше дві
 * анімації почнуть перебивати одна одну.
 */
const SKIP_CONTAINERS = [
  ".header",
  ".banner__top-line",
  ".info-section__heading",
  ".info-section__list",
  ".clock",
  ".office-work-focus",
  ".office-decisions__header",
  ".office-gr-meetups__header",
  ".office-white-book__header",
  ".join-process",
  ".join-quiz",
  ".anima",
  ".track-bunner__rail",
  ".about-us__title",
  "[data-reveal='off']",
].join(", ");

const MASK_CLASS = "tr-mask";
const DONE_ATTR = "data-tr";

const isSkipped = (el) => el.closest(SKIP_CONTAINERS) !== null;

const isHidden = (el) => {
  const rect = el.getBoundingClientRect();
  return rect.width === 0 && rect.height === 0;
};

/**
 * Загортає вміст елемента в маску, з-під якої рядок виїжджає.
 * Вузли не видаляються, а переносяться — тому React і далі керує текстом
 * (наприклад, при зміні мови) і нічого не дублюється.
 */
const wrapInMask = (el) => {
  if (el.firstElementChild?.classList?.contains(MASK_CLASS)) {
    return el.firstElementChild;
  }

  const mask = document.createElement("span");
  mask.className = MASK_CLASS;
  while (el.firstChild) mask.appendChild(el.firstChild);
  el.appendChild(mask);

  return mask;
};

const MASKABLE_DISPLAY = new Set(["block", "inline", "list-item"]);

/*
 * Рядки заголовка. Якщо всередині є свої елементи — спускаємось до них, а не
 * загортаємо все одним шаром: у частини заголовків рядки лежать у flex-колонці
 * зі власним вирівнюванням, і маска поверх неї склеїла б їх в один рядок.
 *
 * Що замаскувати не вдається (інлайновий текст, нестандартний display) —
 * повертаємо як «проявити», щоб такий заголовок не лишився без анімації.
 */
const collectLines = (el, depth, out) => {
  if (isHidden(el)) return out;

  const children = Array.from(el.children).filter(
    (child) => child.textContent.trim().length > 0 && !isHidden(child),
  );

  /*
   * Спускаємось лише тоді, коли внутрішні елементи справді несуть увесь текст.
   * Інакше буває так: <h2>E<span>X</span>PORT MAP</h2> — тут дитина це одна
   * літера, і якби ми маскували її, «X» перетворилась би на окремий рядок.
   */
  const total = el.textContent.trim().length;
  const inChildren = children.reduce(
    (sum, child) => sum + child.textContent.trim().length,
    0,
  );

  if (children.length > 0 && depth < 3 && inChildren >= total * 0.9) {
    children.forEach((child) => collectLines(child, depth + 1, out));
    return out;
  }

  if (MASKABLE_DISPLAY.has(getComputedStyle(el).display)) {
    out.lines.push(wrapInMask(el));
  } else {
    out.fades.push(el);
  }

  return out;
};

const collectHeadingLines = (heading) =>
  collectLines(heading, 0, { lines: [], fades: [] });

export const TextRevealEngine = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    if (typeof window === "undefined") return undefined;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return undefined;
    }

    const triggers = [];
    let cancelled = false;

    const build = () => {
      if (cancelled) return;

      // Групуємо по секціях: усередині секції заголовок веде, текст іде за ним
      const groups = new Map();

      const register = (el, kind) => {
        if (el.hasAttribute(DONE_ATTR) || isSkipped(el) || isHidden(el)) return;
        el.setAttribute(DONE_ATTR, kind);

        const group = el.closest("section, article, footer, header") ?? el;
        if (!groups.has(group)) groups.set(group, { heads: [], texts: [] });
        groups.get(group)[kind === "head" ? "heads" : "texts"].push(el);
      };

      document.querySelectorAll(HEADINGS).forEach((el) => register(el, "head"));
      document.querySelectorAll(TEXT_BLOCKS).forEach((el) => {
        if (el.textContent.trim().length < MIN_TEXT_LENGTH) return;
        if (el.querySelector(HEADINGS)) return;
        register(el, "text");
      });

      groups.forEach(({ heads, texts }, group) => {
        const lines = [];
        const headFades = [];

        heads.forEach((head) => {
          const collected = collectHeadingLines(head);
          lines.push(...collected.lines);
          headFades.push(...collected.fades);
        });

        // Довгі перерахування не тримаємо глядача: далі просто проявляємо
        const fades = [...headFades, ...texts].slice(0, 16);

        if (lines.length === 0 && fades.length === 0) return;

        const timeline = gsap.timeline({
          scrollTrigger: {
            trigger: group,
            start: "top 88%",
            once: true,
          },
        });

        if (lines.length) {
          gsap.set(lines, { yPercent: 110 });
          timeline.to(lines, {
            yPercent: 0,
            /*
             * power3.out, а не expo.out: у expo майже весь рух відбувається у
             * перші 50 мс, і рядок не виїжджає, а «клацає» на місце.
             */
            duration: 1.05,
            ease: "power3.out",
            stagger: 0.09,
            onComplete: () => {
              // Маска більше не потрібна — знімаємо, щоб не різала виносні
              lines.forEach((line) => {
                line.style.transform = "";
                line.style.willChange = "";
                line.parentElement?.classList.add("tr-revealed");
              });
            },
          });
        }

        if (fades.length) {
          gsap.set(fades, { opacity: 0, y: 18, filter: "blur(6px)" });
          timeline.to(
            fades,
            {
              opacity: 1,
              y: 0,
              filter: "blur(0px)",
              duration: 0.85,
              ease: "power2.out",
              stagger: 0.055,
              clearProps: "filter,transform,willChange",
            },
            lines.length ? 0.18 : 0,
          );
        }

        if (timeline.scrollTrigger) triggers.push(timeline.scrollTrigger);
      });

      ScrollTrigger.refresh();
    };

    /*
     * Спостерігач за новою розміткою: вкладки «Діяльності», підгружені новини
     * тощо. Обробленого не чіпаємо вдруге — на елементах лишається data-tr.
     * Під час самої обробки спостерігач вимкнений, бо маски, які ми додаємо,
     * інакше збудили б його знову.
     */
    let observer = null;
    let rescan = 0;

    const runBuild = () => {
      observer?.disconnect();
      build();
      if (!cancelled)
        observer?.observe(document.body, {
          childList: true,
          subtree: true,
        });
    };

    /*
     * Чекаємо на шрифти: рядки заголовків міряються по фактичній ширині літер,
     * а системний шрифт-замінник дає інші переноси.
     */
    let frame = 0;
    const startWhenReady = () => {
      frame = requestAnimationFrame(() => {
        frame = requestAnimationFrame(() => {
          if (cancelled) return;

          observer = new MutationObserver(() => {
            clearTimeout(rescan);
            rescan = window.setTimeout(runBuild, 220);
          });

          runBuild();
        });
      });
    };

    if (document.fonts?.ready) {
      document.fonts.ready.then(startWhenReady).catch(startWhenReady);
    } else {
      startWhenReady();
    }

    return () => {
      cancelled = true;
      if (frame) cancelAnimationFrame(frame);
      clearTimeout(rescan);
      observer?.disconnect();
      triggers.forEach((trigger) => trigger.kill());
    };
  }, [pathname]);

  return null;
};
