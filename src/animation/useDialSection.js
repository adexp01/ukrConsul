import { useGSAP } from "@gsap/react";
import { gsap } from "./gsapSetup";

/*
 * Піновий циферблат: список пунктів їде вертикально, стрілка повертається,
 * активний пункт світлішає.
 *
 * Цей сценарій використовують два блоки — «Офіс підтримки експорту» (Clock) і
 * «Над чим працюємо» (OfficeWorkFocus). До цього вони були двома копіями
 * майже однакових 200 рядків: ті самі константи, ті самі measureOffsets і
 * buildScrollTimeline, той самий пін — різнились лише назви класів, один колір
 * і те, чи під заголовком одна колонка тексту або кілька.
 *
 * Розмітка лишається в компонентах: вона в них справді різна. Спільним є рух.
 */

/** Кути стрілки для першого, другого й третього пункту (viewBox 315×590) */
const DIAL_ITEM_ANGLES = [-90, 0, 90];
const ITEM_ACTIVE = "#ffffff";
const SCROLL_STEP_VH = 1.85;
const SCRUB_SMOOTHING = 3.8;
const STEP_MOVE = 0.52;
const STEP_HOLD = 0.48;
const SMOOTH_EASE = "sine.inOut";

/** Стрілка крутиться навколо власної вісі, а не центру картинки */
const MARKER_ORIGIN = "7.38% 49.93%";

/**
 * @param {object} options
 * @param {string} options.prefix префікс класів блоку, напр. "clock"
 * @param {string} options.itemDim колір неактивного пункту
 * @param {string} options.introTextSelector текст під заголовком
 * @param {number} options.introTextStagger затримка між абзацами тексту
 * @param {object} options.refs section, pin, stage, viewport, track
 * @param {unknown[]} options.dependencies коли перебудовувати анімацію
 */
export const useDialSection = ({
  prefix,
  itemDim,
  introTextSelector,
  introTextStagger = 0,
  refs,
  dependencies,
}) => {
  useGSAP(
    () => {
      const section = refs.section.current;
      if (!section) return undefined;

      const title = section.querySelector(`.${prefix}__title`);
      const texts = gsap.utils.toArray(introTextSelector, section);
      const dial = section.querySelector(`.${prefix}__dial`);
      const dialLabel = section.querySelector(`.${prefix}__dial-label`);
      const dialMarker = section.querySelector(`.${prefix}__dial-marker`);
      const pinWrap = refs.pin.current;
      const stage = refs.stage.current;
      const viewport = refs.viewport.current;
      const track = refs.track.current;

      const itemSelector = `.${prefix}__item`;
      const mm = gsap.matchMedia();

      /**
       * Поява заголовка, тексту під ним і самого циферблата.
       *
       * Циферблат тут не випадково. Раніше він і його підпис лежали з
       * `autoAlpha: 0` і проявлялись лише в `onEnter` піна — тобто рівно один
       * раз, і тільки якщо людина перетнула початок піна скролом уперед. Варто
       * було потрапити в середину секції інакше — перезавантажити прокручену
       * сторінку, перемкнути вкладку, доїхати після перерахунку позицій — і
       * циферблат лишався невидимим назавжди: на екрані чорнота, у якій світиться
       * один рядок списку.
       *
       * `once: true` на початку секції такої дірки не має: цей тригер зривається
       * і на перерахунку позицій, а не лише на перетині.
       */
      const revealIntro = () => {
        gsap.set(title, { autoAlpha: 0, y: 28 });
        gsap.set(texts, { autoAlpha: 0, y: 22 });

        const introTl = gsap.timeline({
          scrollTrigger: { trigger: section, start: "top 82%", once: true },
        });

        introTl
          .to(title, { autoAlpha: 1, y: 0, duration: 0.75, ease: "power2.out" })
          .to(
            texts,
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.6,
              stagger: introTextStagger,
              ease: "power2.out",
            },
            "-=0.35",
          );

        return introTl;
      };

      mm.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set([title, ...texts, dial, dialLabel, track].filter(Boolean), {
          autoAlpha: 1,
          clearProps: "transform",
        });
        gsap.utils.toArray(itemSelector, section).forEach((item) => {
          gsap.set(item, { color: ITEM_ACTIVE, clearProps: "opacity" });
        });
      });

      mm.add("(max-width: 1024px)", () => {
        // На вузькому екрані циферблат не піниться: пункти просто видно всі
        gsap.set([dial, dialLabel, track], { autoAlpha: 1, y: 0 });

        const introTl = revealIntro();

        gsap.utils.toArray(itemSelector, section).forEach((item) => {
          gsap.set(item, { color: ITEM_ACTIVE });
        });

        return () => {
          introTl.scrollTrigger?.kill();
          introTl.kill();
        };
      });

      mm.add(
        "(min-width: 1025px) and (prefers-reduced-motion: no-preference)",
        () => {
          if (!pinWrap || !stage || !viewport || !track || !dialMarker) {
            return undefined;
          }

          const itemEls = gsap.utils.toArray(itemSelector, track);
          const itemCount = itemEls.length;

          if (itemCount < 2) return undefined;

          itemEls.forEach((item, index) => {
            gsap.set(item, { color: index === 0 ? ITEM_ACTIVE : itemDim });
          });
          gsap.set(dialMarker, {
            rotation: DIAL_ITEM_ANGLES[0],
            transformOrigin: MARKER_ORIGIN,
          });

          gsap.set([dial, dialLabel], { autoAlpha: 0, y: 18 });

          const introTl = revealIntro();
          introTl.to(
            [dial, dialLabel].filter(Boolean),
            { autoAlpha: 1, y: 0, duration: 0.65, ease: SMOOTH_EASE },
            "-=0.3",
          );

          /*
           * Зсув треку рахуємо так, щоб центр потрібного пункту став у центр
           * вікна перегляду. Міряємо при кожній перебудові: висота пунктів
           * залежить від шрифту й довжини тексту.
           */
          const measureOffsets = () =>
            itemEls.map((item) => {
              const viewportHeight = viewport.clientHeight;
              const itemCenter = item.offsetTop + item.offsetHeight / 2;
              return viewportHeight / 2 - itemCenter;
            });

          /*
           * Кінцеві зсуви — функціями, а не числами.
           *
           * Числа міряються один раз, при побудові. Але висота пунктів
           * залежить від шрифту: поки веб-шрифт не приїхав, рядки нижчі, і
           * заміряні зсуви лишаються від чужої розкладки. Разом із
           * `invalidateOnRefresh` функція перемірює зсуви на кожному
           * перерахунку — і список стоїть по центру вікна, а не поруч із ним.
           */
          const buildScrollTimeline = () => {
            gsap.set(track, { y: measureOffsets()[0] });

            const scrollTl = gsap.timeline({
              defaults: { ease: SMOOTH_EASE },
              scrollTrigger: {
                trigger: pinWrap,
                start: "top top",
                end: () =>
                  `+=${window.innerHeight * (itemCount - 1) * SCROLL_STEP_VH}`,
                pin: stage,
                scrub: SCRUB_SMOOTHING,
                anticipatePin: 1,
                invalidateOnRefresh: true,
                /*
                 * Перед кожним перерахунком повертаємо трек на позицію першого
                 * пункту, щоб `invalidateOnRefresh` перезаписав початкові
                 * значення з актуальної розкладки, а не зі старої.
                 */
                onRefreshInit: () => {
                  gsap.set(track, { y: measureOffsets()[0] });
                },
              },
            });

            for (let index = 1; index < itemCount; index += 1) {
              // Стрілка й підсвітка починаються трохи раніше, ніж доїде трек
              const overlap = "<0.08";

              scrollTl.to(track, {
                y: () => measureOffsets()[index],
                duration: STEP_MOVE,
                ease: SMOOTH_EASE,
              });

              scrollTl.to(
                dialMarker,
                {
                  rotation: DIAL_ITEM_ANGLES[index],
                  duration: STEP_MOVE,
                  ease: SMOOTH_EASE,
                },
                overlap,
              );

              itemEls.forEach((item, itemIndex) => {
                scrollTl.to(
                  item,
                  {
                    color: itemIndex === index ? ITEM_ACTIVE : itemDim,
                    duration: STEP_MOVE,
                    ease: SMOOTH_EASE,
                  },
                  overlap,
                );
              });

              // Пауза на пункті, щоб його встигли прочитати
              scrollTl.to({}, { duration: STEP_HOLD });
            }

            return scrollTl;
          };

          const scrollTl = buildScrollTimeline();

          return () => {
            introTl.scrollTrigger?.kill();
            introTl.kill();
            scrollTl.scrollTrigger?.kill();
            scrollTl.kill();
          };
        },
      );

      return () => mm.revert();
    },
    { scope: refs.section, dependencies },
  );
};
