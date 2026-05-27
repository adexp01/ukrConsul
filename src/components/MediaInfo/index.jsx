import { useLanguage } from "../../i18n/LanguageContext";
import "./style.css";

export const MediaInfo = () => {
  const { t } = useLanguage();
  const titleLines = t("media.info.title");
  const columns = t("media.info.columns");

  return (
    <section className="media-info" aria-labelledby="media-info-title">
      <div className="media-info__glow" aria-hidden="true" />

      <div className="media-info__inner">
        <h2 id="media-info-title" className="media-info__title">
          {titleLines.map((line) => (
            <span key={line}>{line}</span>
          ))}
        </h2>

        <div className="media-info__columns">
          {columns.map((text) => (
            <p key={text} className="media-info__text">
              {text}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
};
