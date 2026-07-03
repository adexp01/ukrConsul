import { useLanguage } from "../../i18n/LanguageContext";
import "./style.css";

export const JoinFormat = () => {
  const { t } = useLanguage();
  const copy = t("joinPage.format");

  return (
    <section className="join-format" aria-labelledby="join-format-title">
      <div className="join-format__inner">
        <h2 id="join-format-title" className="join-format__title">
          {copy.title}
        </h2>
        <p className="join-format__text">{copy.text}</p>
      </div>
    </section>
  );
};
