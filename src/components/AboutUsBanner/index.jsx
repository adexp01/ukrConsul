import { Button } from "../UI/Button";
import { useLanguage } from "../../i18n/LanguageContext";
import { useJoinQuiz } from "../JoinQuiz/JoinQuizContext";
import "./style.css";

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

  return (
    <section
      className="about-us-banner"
      aria-labelledby="about-us-banner-title"
    >
      <div className="about-us-banner__glow" aria-hidden="true" />

      <div className="about-us-banner__inner">
        <h1 id="about-us-banner-title" className="about-us-banner__title">
          {copy.title.map((line, index) => (
            <span key={line} className={`about-us-banner__title-${index + 1}`}>
              {renderLineWithBreaks(line)}
            </span>
          ))}
        </h1>

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
            <span className="about-us-banner__contact-arrow" aria-hidden="true">
              →
            </span>
          </a>
        </div>

        <p className="about-us-banner__description">{copy.description}</p>
      </div>
    </section>
  );
};
