import { CtaBlackHole } from "./CtaBlackHole";
import { CtaArcs } from "./CtaArcs";
import "./style.css";

/*
 * Спільний фон блоків-CTA: акреційне кільце («чорна діра») плюс дуги, які
 * ледь дихають. Один компонент на два шари, щоб у секціях не тримати
 * порядок z-index руками.
 *
 * Вимога до батька: `position: relative` і `overflow: hidden` — фон
 * розтягується по всьому боксу через `inset: 0`.
 *
 * Дуги свідомо йдуть з `preserveAspectRatio="none"`: інакше SVG
 * зберігає пропорцію 1303×656, і на широкій картці лінії або
 * закінчувались посеред неї, або (якщо тягнути по ширині) виїжджали
 * далеко за верх і низ. Криві тут майже прямі, тому неоднорідний
 * масштаб на око не читається, а фон більше не обрізається.
 */

export const CtaBackdrop = ({ className = "", ...ringProps }) => (
  <div className={`cta-backdrop ${className}`.trim()} aria-hidden="true">
    <CtaBlackHole {...ringProps} />
    <CtaArcs />
  </div>
);
