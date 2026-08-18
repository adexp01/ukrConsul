import { Button } from "../UI/Button";
import { CtaBackdrop } from "../CtaBackdrop";
import { useLanguage } from "../../i18n/LanguageContext";
import { useJoinQuiz } from "../JoinQuiz/JoinQuizContext";
import { COUNCIL_STATS, splitStatValue } from "../../data/councilStats";
import "./style.css";

/*
 * Перший екран «Про нас».
 *
 * Було: два рядки капсу однакової ваги по центру, кнопки, і абзац опису на
 * 120 px нижче — між ними зяяла порожня смуга, а решту екрана займав чорний
 * фон (декоративний `__glow` рендерився, але жодного стилю під нього в CSS
 * не існувало). Кегль і інтерліньяж стояли в пікселях (`52px/82px`,
 * `letter-spacing: -4.8px`), тому довга англійська назва розтягувалась на
 * всю ширину вікна.
 *
 * Стало: назва Ради великим кеглем ліворуч (міра в `ch`, кегль плинний),
 * друга частина назви — підзаголовок під нею меншою вагою, опис і кнопки
 * праворуч на тій самій базовій лінії, а низ екрана тримає смужка цифр.
 * Фон — те саме кільце, що в CTA, але зсунуте в праву половину й розмите
 * (ширша оболонка `width`, сильніший `warp`, менша `exposure`): тут воно
 * атмосфера, а не об'єкт, і не має конкурувати із заголовком. Дуги
 * вимкнені — вони перетинали текст.
 */

/** Довша за це назва отримує менший кегль: інакше EN-версія рве екран */
const LONG_TITLE_LENGTH = 28;

const renderLineWithBreaks = (line) =>
  line
    .split(/<br\s*\/?>/i)
    .flatMap((part, partIndex, parts) =>
      partIndex < parts.length - 1
        ? [part, <br key={`${line}-break-${partIndex}`} />]
        : [part],
    );

export const AboutUsBanner = () => {
  const { t, localizePath } = useLanguage();
  const { openJoinQuiz } = useJoinQuiz();
  const copy = t("aboutUsPage.banner");
  const statsCopy = t("aboutUs");

  const [name, ...restLines] = copy.title;
  const isLongName = (name ?? "").length > LONG_TITLE_LENGTH;

  const statLabel = (id) =>
    id === "companies"
      ? statsCopy.main?.description
      : statsCopy.satellites?.[id]?.description;

  return (
    <section className="about-us-banner" aria-labelledby="about-us-banner-title">
      <CtaBackdrop
        arcs={false}
        centerX={0.68}
        centerY={0.46}
        scale={1.3}
        width={0.17}
        warp={0.3}
        glow={1.05}
        exposure={0.34}
        feather={0.26}
        mouseStrength={0.4}
      />

      <div className="about-us-banner__inner">
        <div className="about-us-banner__lead-row">
          <h1
            id="about-us-banner-title"
            className={`about-us-banner__title${
              isLongName ? " about-us-banner__title--long" : ""
            }`}
          >
            <span className="about-us-banner__title-name">{name}</span>

            {restLines.map((line) => (
              <span key={line} className="about-us-banner__title-sub">
                {renderLineWithBreaks(line)}
              </span>
            ))}
          </h1>

          <div className="about-us-banner__aside">
            <p className="about-us-banner__description">{copy.description}</p>

            <div className="about-us-banner__actions">
              <Button
                onClick={openJoinQuiz}
                variant="primary"
                className="about-us-banner__cta"
              >
                {copy.joinCta}
              </Button>

              <a
                href={localizePath(copy.contactHref)}
                className="about-us-banner__contact-link"
              >
                <span>{copy.contactCta}</span>
                <span
                  className="about-us-banner__contact-arrow"
                  aria-hidden="true"
                >
                  →
                </span>
              </a>
            </div>
          </div>
        </div>

        <dl className="about-us-banner__stats">
          {COUNCIL_STATS.map((stat) => {
            const { number, suffix } = splitStatValue(stat.value);

            return (
              <div className="about-us-banner__stat" key={stat.id}>
                <dt className="about-us-banner__stat-value">
                  {number}
                  {suffix ? (
                    <span className="about-us-banner__stat-suffix">
                      {suffix}
                    </span>
                  ) : null}
                </dt>
                <dd className="about-us-banner__stat-label">
                  {statLabel(stat.id)}
                </dd>
              </div>
            );
          })}
        </dl>
      </div>
    </section>
  );
};
