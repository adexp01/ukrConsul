import { useEffect, useRef } from "react";
import { gsap } from "../../animation/gsapSetup";

/*
 * Дуги фону CTA — той самий `bgElements.svg`, але інлайном, щоб до кожної
 * лінії можна було дотягнутись анімацією. Геометрія і градієнти скопійовані
 * з файлу байт-у-байт, id перейменовані з `paint0_linear_1968_10302` на
 * `ctaArcN`: інлайновий SVG кладе id у глобальний простір документа, і
 * експортні імена з Figma там виглядають як сміття.
 *
 * Рух складається з двох частин:
 *
 *   «дихання» — кожна дуга ледь помітно змінює прогин (scaleY близько 1)
 *   і зсувається по вертикалі на пару пікселів. Фази різні, тому поле
 *   ліній не пульсує в такт, а повільно перекочується.
 *
 *   «зблиск» — по кожній лінії їде короткий світлий пунктир. Замість
 *   `getTotalLength()` на кожній дузі стоїть `pathLength={1000}`: тоді
 *   dasharray і dashoffset задаються в тисячних долях довжини, однаково
 *   для всіх ліній і без вимірювань у DOM.
 *
 * Точку відліку scaleY GSAP рахує сам від bbox кожної лінії
 * (`transformOrigin: "50% 50%"`) і пише готову матрицю в атрибут
 * `transform`, тому CSS `transform-box` тут не потрібен.
 *
 * Кадри крутяться лише коли секцію видно (IntersectionObserver), а при
 * `prefers-reduced-motion: reduce` анімація не створюється зовсім —
 * лишаються статичні дуги, як було до цього.
 */

const ARCS = [
  /* нижня половина */
  { d: "M1267.03 654.764C856.736 556.687 446.446 556.687 36.168 654.764", paint: "ctaArc0", dir: -1 },
  { d: "M1290.75 523.669C864.731 464.83 438.698 464.83 12.6758 523.669", paint: "ctaArc2", dir: 1 },
  { d: "M1302.61 393.544C868.717 373.926 434.817 373.926 0.929688 393.544", paint: "ctaArc1", dir: -1 },
  /* верхня половина */
  { d: "M1302.61 262.774C868.717 282.393 434.817 282.393 0.929688 262.774", paint: "ctaArc5", dir: 1 },
  { d: "M1290.75 131.375C864.731 190.214 438.698 190.214 12.6758 131.375", paint: "ctaArc6", dir: -1 },
  { d: "M1290.75 131.375C864.731 190.214 438.698 190.214 12.6758 131.375", paint: "ctaArc7", dir: -1 },
  { d: "M1267.03 0.932617C856.736 99.0083 446.446 99.0083 36.168 0.932617", paint: "ctaArc3", dir: 1 },
  { d: "M1267.03 0.932617C856.736 99.0083 446.446 99.0083 36.168 0.932617", paint: "ctaArc4", dir: 1 },
];

/** Лінії, по яких їде зблиск: дублі-підсвітки (3, 6) пропускаємо */
const GLINTS = [0, 1, 2, 3, 5, 6];

export const CtaArcs = ({ className = "" }) => {
  const rootRef = useRef(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;

    const group = root.querySelector("[data-arcs-group]");
    const lines = gsap.utils.toArray(root.querySelectorAll("[data-arc]"));
    const glints = gsap.utils.toArray(root.querySelectorAll("[data-glint]"));
    const tweens = [];

    lines.forEach((line, i) => {
      const dir = Number(line.dataset.dir) || 1;

      tweens.push(
        gsap.to(line, {
          scaleY: 1 + 0.055 * dir,
          y: 2.4 * dir,
          transformOrigin: "50% 50%",
          duration: 7.5 + i * 0.9,
          delay: i * 0.45,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
        }),
      );
    });

    glints.forEach((glint, i) => {
      const dir = Number(glint.dataset.dir) || 1;
      const travel = 13 + i * 2.6;
      const fade = 1.6;

      const tl = gsap.timeline({ repeat: -1, repeatDelay: 3.5, delay: i * 2.2 });
      tl.set(glint, { strokeDashoffset: 0, opacity: 0 })
        .to(glint, { opacity: 0.75, duration: 1.4, ease: "sine.out" }, 0)
        .to(glint, { strokeDashoffset: -1000 * dir, duration: travel, ease: "none" }, 0)
        .to(glint, { opacity: 0, duration: fade, ease: "sine.in" }, travel - fade);

      tweens.push(tl);
    });

    /*
     * Ціла група дуг дуже повільно пливе — прибирає відчуття наліпки.
     * Рухаємо саме <g>, а не корінь: у кореня в CSS уже лежить
     * `transform: translate(-50%, -50%)`, і GSAP його б перетер.
     */
    if (group) {
      tweens.push(
        gsap.to(group, {
          xPercent: 0.6,
          duration: 18,
          ease: "sine.inOut",
          repeat: -1,
          yoyo: true,
        }),
      );
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        tweens.forEach((tween) => (entry.isIntersecting ? tween.play() : tween.pause()));
      },
      { threshold: 0 },
    );
    io.observe(root);

    return () => {
      io.disconnect();
      tweens.forEach((tween) => tween.kill());
      gsap.set([...lines, ...glints], { clearProps: "all" });
    };
  }, []);

  return (
    <svg
      ref={rootRef}
      className={`cta-arcs ${className}`.trim()}
      viewBox="0 0 1303 656"
      fill="none"
      aria-hidden="true"
      focusable="false"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g opacity="0.8" data-arcs-group="">
        {ARCS.map((arc, i) => (
          <path
            key={`${arc.paint}-${i}`}
            d={arc.d}
            data-arc=""
            data-dir={arc.dir}
            stroke={`url(#${arc.paint})`}
            strokeWidth="0.7"
            strokeMiterlimit="10"
          />
        ))}

        {GLINTS.map((index) => (
          <path
            key={`glint-${index}`}
            d={ARCS[index].d}
            data-glint=""
            data-dir={ARCS[index].dir}
            pathLength="1000"
            stroke="#FFB070"
            strokeWidth="1"
            strokeLinecap="round"
            strokeDasharray="80 920"
            opacity="0"
          />
        ))}
      </g>

      <defs>
        <linearGradient id="ctaArc0" x1="36.168" y1="617.985" x2="1267.03" y2="617.985" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FF6A00" />
          <stop offset="0.1875" stopColor="#3038C8" />
          <stop offset="0.78125" stopColor="#3038C8" />
          <stop offset="1" stopColor="#FF6A00" />
        </linearGradient>
        <linearGradient id="ctaArc1" x1="0.929682" y1="386.188" x2="1302.61" y2="386.187" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FF6A00" />
          <stop offset="0.166238" stopColor="#3038C8" />
          <stop offset="0.313845" stopColor="#191C34" />
          <stop offset="0.688597" stopColor="#191C34" />
          <stop offset="0.844803" stopColor="#3038C8" />
          <stop offset="1" stopColor="#FF6A00" />
        </linearGradient>
        <linearGradient id="ctaArc2" x1="12.6758" y1="501.605" x2="1290.75" y2="501.605" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FF6A00" />
          <stop offset="0.214852" stopColor="#3038C8" />
          <stop offset="0.494792" stopColor="#191C34" />
          <stop offset="0.795026" stopColor="#3038C8" />
          <stop offset="1" stopColor="#FF6A00" />
        </linearGradient>
        <linearGradient id="ctaArc3" x1="35.9087" y1="0.932617" x2="1267.29" y2="0.932505" gradientUnits="userSpaceOnUse">
          <stop stopColor="#C9C9C9" />
          <stop offset="0.494792" stopColor="#C9C9C9" stopOpacity="0" />
          <stop offset="1" stopColor="#C9C9C9" />
        </linearGradient>
        <linearGradient id="ctaArc4" x1="36.168" y1="37.7113" x2="1267.03" y2="37.7113" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FF6A00" />
          <stop offset="0.201737" stopColor="#3038C8" />
          <stop offset="0.763248" stopColor="#3038C8" />
          <stop offset="1" stopColor="#FF6A00" />
        </linearGradient>
        <linearGradient id="ctaArc5" x1="0.929682" y1="270.132" x2="1302.61" y2="270.131" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FF6A00" />
          <stop offset="0.166238" stopColor="#3038C8" />
          <stop offset="0.313845" stopColor="#191C34" />
          <stop offset="0.688597" stopColor="#191C34" />
          <stop offset="0.844803" stopColor="#3038C8" />
          <stop offset="1" stopColor="#FF6A00" />
        </linearGradient>
        <linearGradient id="ctaArc6" x1="12.4065" y1="131.375" x2="1291.02" y2="131.374" gradientUnits="userSpaceOnUse">
          <stop stopColor="#C9C9C9" />
          <stop offset="0.494792" stopColor="#C9C9C9" stopOpacity="0" />
          <stop offset="1" stopColor="#C9C9C9" />
        </linearGradient>
        <linearGradient id="ctaArc7" x1="12.6758" y1="153.439" x2="1290.75" y2="153.439" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FF6A00" />
          <stop offset="0.258639" stopColor="#3038C8" />
          <stop offset="0.5" stopColor="#191C34" />
          <stop offset="0.750509" stopColor="#3038C8" />
          <stop offset="1" stopColor="#FF6A00" />
        </linearGradient>
      </defs>
    </svg>
  );
};
