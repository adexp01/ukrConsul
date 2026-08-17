import { CtaBlackHole } from "./CtaBlackHole";
import { CtaArcs } from "./CtaArcs";
import { useLanguage } from "../../i18n/LanguageContext";
import { Button } from "../UI/Button";
import { useJoinQuiz } from "../JoinQuiz/JoinQuizContext";
import "./style.css";

export const JoinFinalCta = () => {
  const { t } = useLanguage();
  const { openJoinQuiz } = useJoinQuiz();
  const joinCopy = t("joinPage");
  const copy = t("joinPage.finalCta");

  return (
    <section className="join-final-cta" aria-labelledby="join-final-cta-title">
      <div className="join-final-cta__card">
        <CtaBlackHole />

        <CtaArcs className="join-final-cta__bg" />

        <div className="join-final-cta__content">
          <h2 id="join-final-cta-title" className="join-final-cta__title">
            {copy.title.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </h2>

          <p className="join-final-cta__text">{copy.text}</p>

          <div className="join-final-cta__actions">
            <Button onClick={openJoinQuiz}>{joinCopy.primaryCta}</Button>

            <a
              href={`mailto:${joinCopy.email}`}
              className="join-final-cta__link"
            >
              {joinCopy.secondaryCta}
              <span aria-hidden="true">→</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
