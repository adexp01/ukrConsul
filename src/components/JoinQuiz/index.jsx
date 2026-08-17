import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Button } from "../UI/Button";
import { useLanguage } from "../../i18n/LanguageContext";
import {
  PROFILES_WITHOUT_STAGE,
  resolveFormHref,
  resolveResultId,
} from "./mapping";
import "./style.css";

const FOCUSABLE =
  'button:not([disabled]), a[href], input, [tabindex]:not([tabindex="-1"])';

/**
 * Поп-ап «Долучитися»: два кроки — хто ви і на якому ви етапі — після чого
 * показуємо, яка спільнота Ради підходить, і ведемо на відповідну анкету.
 *
 * Для медіа другий крок пропускаємо: питання про етап компанії для редакції
 * не має сенсу.
 */
export const JoinQuizModal = ({ isOpen, onClose }) => {
  const { t, language } = useLanguage();
  const copy = t("joinQuiz");

  const [profileId, setProfileId] = useState(null);
  const [stageId, setStageId] = useState(null);
  const dialogRef = useRef(null);
  const restoreFocusRef = useRef(null);

  const skipsStage = profileId && PROFILES_WITHOUT_STAGE.includes(profileId);
  const isResult = Boolean(profileId && (stageId || skipsStage));
  const step = isResult ? 3 : profileId ? 2 : 1;

  const reset = useCallback(() => {
    setProfileId(null);
    setStageId(null);
  }, []);

  const goBack = () => {
    if (stageId) return setStageId(null);
    if (profileId) return setProfileId(null);
    onClose();
  };

  // Запам'ятовуємо, звідки відкрили, блокуємо скрол сторінки під поп-апом
  useEffect(() => {
    if (!isOpen) return undefined;

    restoreFocusRef.current = document.activeElement;
    const { overflow, paddingRight } = document.body.style;
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;

    document.body.style.overflow = "hidden";
    if (scrollbar > 0) document.body.style.paddingRight = `${scrollbar}px`;

    const frame = requestAnimationFrame(() => {
      const first = dialogRef.current?.querySelector(FOCUSABLE);
      (first ?? dialogRef.current)?.focus();
    });

    return () => {
      cancelAnimationFrame(frame);
      document.body.style.overflow = overflow;
      document.body.style.paddingRight = paddingRight;
      restoreFocusRef.current?.focus?.();
    };
  }, [isOpen]);

  // Esc закриває, Tab не виходить за межі поп-апа
  useEffect(() => {
    if (!isOpen) return undefined;

    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key !== "Tab") return;

      const items = Array.from(
        dialogRef.current?.querySelectorAll(FOCUSABLE) ?? [],
      );
      if (items.length === 0) return;

      const first = items[0];
      const last = items[items.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  // Закрили — забуваємо відповіді, щоб наступного разу тест починався з нуля
  useEffect(() => {
    if (!isOpen) reset();
  }, [isOpen, reset]);

  if (!isOpen) return null;

  const totalSteps = skipsStage ? 1 : 2;
  const currentStep = isResult ? totalSteps : step;
  const progress = (currentStep / totalSteps) * 100;

  const resultId = isResult
    ? resolveResultId(profileId, skipsStage ? null : stageId)
    : null;
  const result = resultId ? copy.results[resultId] : null;
  const formHref = resultId ? resolveFormHref(resultId, language) : null;

  const renderOptions = (items, onPick, activeId) => (
    <ul className="join-quiz__options">
      {items.map((item, index) => (
        <li key={item.id}>
          <button
            type="button"
            className={`join-quiz__option${
              activeId === item.id ? " is-active" : ""
            }`}
            onClick={() => onPick(item.id)}
          >
            <span className="join-quiz__option-index" aria-hidden="true">
              {String(index + 1).padStart(2, "0")}
            </span>
            <span className="join-quiz__option-label">{item.label}</span>
            <span className="join-quiz__option-arrow" aria-hidden="true">
              →
            </span>
          </button>
        </li>
      ))}
    </ul>
  );

  return createPortal(
    <div
      className="join-quiz"
      role="presentation"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        className="join-quiz__dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="join-quiz-title"
        ref={dialogRef}
        tabIndex={-1}
      >
        <button
          type="button"
          className="join-quiz__close"
          onClick={onClose}
          aria-label={copy.close}
        >
          ✕
        </button>

        {isResult ? null : (
          <div className="join-quiz__bar">
            <button
              type="button"
              className="join-quiz__back"
              onClick={goBack}
              disabled={step === 1}
            >
              <span aria-hidden="true">←</span>
              {copy.back}
            </button>

            <div
              className="join-quiz__progress"
              role="progressbar"
              aria-valuemin={1}
              aria-valuemax={totalSteps}
              aria-valuenow={currentStep}
            >
              <span style={{ width: `${progress}%` }} />
            </div>

            <p className="join-quiz__counter">
              <strong>{String(currentStep).padStart(2, "0")}</strong> /{" "}
              {String(totalSteps).padStart(2, "0")}
            </p>
          </div>
        )}

        <div className="join-quiz__card" key={isResult ? "result" : step}>
          {isResult ? (
            <div className="join-quiz__result">
              <button
                type="button"
                className="join-quiz__restart"
                onClick={reset}
              >
                <span aria-hidden="true">↻</span>
                {copy.restart}
              </button>

              <p className="join-quiz__result-badge">{copy.resultBadge}</p>
              <h2 id="join-quiz-title" className="join-quiz__result-title">
                {result.title}
              </h2>
              <p className="join-quiz__result-text">{result.description}</p>

              <Button
                href={formHref}
                target="_blank"
                rel="noreferrer"
                className="join-quiz__submit"
              >
                {copy.submit}
              </Button>
            </div>
          ) : (
            <>
              <h2 id="join-quiz-title" className="join-quiz__title">
                {step === 1 ? copy.steps.profile.title : copy.steps.stage.title}
              </h2>
              <p className="join-quiz__subtitle">
                {step === 1 ? copy.steps.profile.text : copy.steps.stage.text}
              </p>

              {step === 1
                ? renderOptions(
                    copy.steps.profile.options,
                    setProfileId,
                    profileId,
                  )
                : renderOptions(copy.steps.stage.options, setStageId, stageId)}
            </>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
};
