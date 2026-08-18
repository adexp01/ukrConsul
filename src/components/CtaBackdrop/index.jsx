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
 * `arcs={false}` лишає лише кільце: на першому екрані «Про нас» лінії
 * перетинали заголовок і сперечалися з ним за увагу.
 *
 * Дуги свідомо йдуть з `preserveAspectRatio="none"`: інакше SVG
 * зберігає пропорцію 1303×656, і на широкій картці лінії або
 * закінчувались посеред неї, або (якщо тягнути по ширині) виїжджали
 * далеко за верх і низ. Криві тут майже прямі, тому неоднорідний
 * масштаб на око не читається, а фон більше не обрізається.
 */

export const CtaBackdrop = ({ className = "", arcs = true, ...ringProps }) => (
  <div className={`cta-backdrop ${className}`.trim()} aria-hidden="true">
    <CtaBlackHole {...ringProps} />
    {arcs ? <CtaArcs /> : null}
  </div>
);
