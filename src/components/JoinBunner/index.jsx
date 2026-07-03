import "./style.css";
import { useLanguage } from "../../i18n/LanguageContext";

export const JoinBunner = () => {
  const { t } = useLanguage();
  const copy = t("joinPage");

  return (
    <section className="join-bunner" aria-labelledby="join-bunner-title">
      <div className="join-bunner__inner">
        <h1 id="join-bunner-title" className="join-bunner__title">
          {copy.title.map((line) => (
            <span key={line}>{line}</span>
          ))}
        </h1>

        <p className="join-bunner__text">{copy.text}</p>
      </div>
    </section>
  );
};