import { Button } from "../UI/Button";
import { useLanguage } from "../../i18n/LanguageContext";
import bannerTextImage from "../../assets/text.png";
import "./style.css";

export const AboutUsBanner = () => {
  const { t } = useLanguage();
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
              {line}
            </span>
          ))}
        </h1>

        <div className="about-us-banner__actions">
          <Button
            href={copy.joinHref}
            variant="primary"
            className="about-us-banner__cta"
          >
            {copy.joinCta}
          </Button>

          <a href={copy.contactHref} className="about-us-banner__contact-link">
            <span>{copy.contactCta}</span>
            <span className="about-us-banner__contact-arrow" aria-hidden="true">
              →
            </span>
          </a>
          <div className="about-us-banner__description">
            Ми представляємо спільну позицію галузі, допомагаємо виробникам
            взаємодіяти з державою, військовими та міжнародними партнерами,
            підтримуємо масштабування українських оборонних рішень в Україні та
            за кордоном.
          </div>
        </div>
      </div>
      {/* <figure className="about-us-banner__text-visual">
        <img
          className="about-us-banner__text-image"
          src={bannerTextImage}
          alt={copy.description}
          loading="eager"
          decoding="async"
        />
      </figure> */}
    </section>
  );
};
