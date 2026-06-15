import { Button } from "../Button";
import { useLanguage } from "../../../i18n/LanguageContext";
import "./style.css";

export const SendRequest = () => {
  const { t } = useLanguage();
  const titleLines = t("sendRequest.title");

  return (
    <section className="send-request" aria-labelledby="send-request-title">
      <div className="send-request__backdrop" aria-hidden="true" />

      <div className="send-request__inner">
        <article className="send-request__card">
          <div className="send-request__glow" aria-hidden="true" />

          <div className="send-request__content">
            <h2 id="send-request-title" className="send-request__title">
              {titleLines.map((line) => (
                <span key={line}>{line}</span>
              ))}
            </h2>

            <p className="send-request__text">{t("sendRequest.description")}</p>

            <Button href="#" variant="primary" className="send-request__cta">
              {t("sendRequest.cta")}
            </Button>
          </div>
        </article>
      </div>
    </section>
  );
};
