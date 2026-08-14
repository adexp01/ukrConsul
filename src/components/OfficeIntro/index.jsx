import { Button } from "../UI/Button";
import "./style.css";

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
}) => (
  <section className="office-intro" aria-labelledby={titleId}>
    <div className="office-intro__inner">
      <h2 id={titleId} className="office-intro__title">
        {title}
      </h2>

      <div className="office-intro__stage">
        <article className="office-intro__card office-intro__card--accent">
          <p>{accentText}</p>
        </article>

        <article className="office-intro__card office-intro__card--light">
          {cardTitle ? (
            <h3 className="office-intro__card-title">{cardTitle}</h3>
          ) : null}
          <p>{cardText}</p>
        </article>
      </div>

      {ctaLabel ? (
        <div className="office-intro__cta">
          <Button href={ctaHref} variant="primary">
            {ctaLabel}
          </Button>
        </div>
      ) : null}
    </div>
  </section>
);
