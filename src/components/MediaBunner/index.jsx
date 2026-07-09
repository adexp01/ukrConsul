import { useLanguage } from "../../i18n/LanguageContext";
import "./style.css";

export const MediaBunner = () => {
  const { t } = useLanguage();

  return (
    <section className="media-bunner" aria-labelledby="media-bunner-title">
      <div className="media-bunner__inner">
        <h1 id="media-bunner-title" className="media-bunner__title">
          {t("media.banner.title")}
        </h1>
        <p className="media-bunner__desc">{t("media.banner.description")}</p>
      </div>
    </section>
  );
};
