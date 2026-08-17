import { Button } from "../Button";
import { CtaBackdrop } from "../../CtaBackdrop";
import { useJoinQuiz } from "../../JoinQuiz/JoinQuizContext";
import { useLanguage } from "../../../i18n/LanguageContext";
import "./style.css";

export const SendRequest = () => {
  const { t } = useLanguage();
  const { openJoinQuiz } = useJoinQuiz();
  const titleLines = t("sendRequest.title");

  return (
    <section className="send-request" aria-labelledby="send-request-title">
      <div className="send-request__backdrop" aria-hidden="true" />

      <div className="send-request__inner">
        <article className="send-request__card">
          <CtaBackdrop />

          <div className="send-request__content">
            <h2 id="send-request-title" className="send-request__title">
              {titleLines.map((line) => (
                <span key={line}>{line}</span>
              ))}
            </h2>

            <p className="send-request__text">{t("sendRequest.description")}</p>

            <Button
              onClick={openJoinQuiz}
              variant="primary"
              className="send-request__cta"
            >
              {t("sendRequest.cta")}
            </Button>
          </div>
        </article>
      </div>
    </section>
  );
};
