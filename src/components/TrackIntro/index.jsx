import { useLanguage } from "../../i18n/LanguageContext";
import "./style.css";

export const TrackIntro = () => {
  const { t } = useLanguage();
  const titleLines = t("track.intro.title");
  const columns = t("track.intro.columns");

  return (
    <section className="track-intro" aria-labelledby="track-intro-title">
      <div className="track-intro__glow" aria-hidden="true" />

      <div className="track-intro__inner">
        <h2 id="track-intro-title" className="track-intro__title">
          {titleLines.map((line) => (
            <span key={line}>{line}</span>
          ))}
        </h2>

        <div className="track-intro__columns">
          {columns.map((text) => (
            <p key={text} className="track-intro__text">
              {text}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
};
