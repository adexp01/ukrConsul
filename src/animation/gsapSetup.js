import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

/*
 * Одне місце, де реєструються плагіни GSAP.
 *
 * Раніше `gsap.registerPlugin(ScrollTrigger, useGSAP)` стояло в шістнадцяти
 * файлах — з тією ж помилкою в кожному: useGSAP це хук, а не плагін, і
 * реєструвати його не потрібно. Тепер компоненти просто імпортують `gsap`
 * і `ScrollTrigger` звідси, а реєстрація трапляється один раз при першому
 * імпорті цього модуля.
 */
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

export { gsap, ScrollTrigger, ScrollToPlugin };

/*
 * Перемір позицій, коли сторінка нарешті стала видимою.
 *
 * Реальний випадок, знятий на живому сайті: сторінку відкрито у фоновій
 * вкладці (або відновлено разом із сесією браузера). Тоді розмітка існує,
 * а вікна ще немає — заміряно `innerWidth: 0`, `innerHeight: 0`,
 * `document.documentElement.scrollHeight: 0` при `visibilityState: "hidden"`.
 * ScrollTrigger рахує свої межі саме в цей момент, і всі вони виходять
 * нульовими. Далі людина перемикається на вкладку — розміри зʼявляються, але
 * події `resize` немає, бо вікно не змінювалось. Тригери лишаються з
 * нульовими межами й ніколи не зриваються: блоки, які мали проявитись,
 * стоять з `opacity: 0`, і на екрані чорнота з ледь помітним текстом.
 *
 * Саме на це схожа скарга «час від часу по скролу ламаються анімації»: воно
 * залежить не від сторінки, а від того, як її відкрили.
 *
 * Тому: як тільки сторінка стає видимою — перемірюємо. І, якщо вікна ще немає,
 * чекаємо на перший кадр із непорожніми розмірами. `requestAnimationFrame` у
 * схованій вкладці не викликається, тож це очікування нічого не коштує — воно
 * саме продовжиться тоді, коли вкладку відкриють.
 */
if (typeof window !== "undefined") {
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") ScrollTrigger.refresh();
  });

  if (window.innerHeight === 0 || window.innerWidth === 0) {
    /** Запас кадрів, щоб не крутити перевірку вічно, якщо вікна так і не буде */
    let attempts = 600;

    const waitForViewport = () => {
      if (window.innerHeight > 0 && window.innerWidth > 0) {
        ScrollTrigger.refresh();
        return;
      }

      attempts -= 1;
      if (attempts > 0) requestAnimationFrame(waitForViewport);
    };

    requestAnimationFrame(waitForViewport);
  }
}
