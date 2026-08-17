import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Button } from "../UI/Button";
import { useLanguage } from "../../i18n/LanguageContext";
import {
  PROFILES_WITH_PRODUCT,
  PROFILES_WITHOUT_STAGE,
  resolveEmail,
  resolveFormHref,
  resolveResultId,
} from "./mapping";
import "./style.css";

const FOCUSABLE =
  'button:not([disabled]), a[href], input, [tabindex]:not([tabindex="-1"])';

/**
 * Поп-ап «Долучитися».
 *
 * Кроків стільки, скільки потрібно саме цій людині: виробника питаємо ще й про
 * напрям продукції, редакції не питаємо про етап компанії. Тому лічильник і
 * смужка прогресу рахуються від фактичного набору кроків, а не від сталої.
 */
export const JoinQuizModal = ({ isOpen, onClose }) => {
  const { t, language } = useLanguage();
  const copy = t("joinQuiz");

  const [answers, setAnswers] = useState({});
  const dialogRef = useRef(null);
  const restoreFocusRef = useRef(null);

  const { profile, product } = answers;

  // Послідовність кроків залежить від відповідей
  const steps = useMemo(() => {
    const list = ["profile"];
    if (profile && PROFILES_WITH_PRODUCT.includes(profile))
      list.push("product");
    if (profile && !PROFILES_WITHOUT_STAGE.includes(profile))
      list.push("stage");
    return list;
  }, [profile]);

  const answeredCount = steps.filter((step) => answers[step]).length;
  const isResult = answeredCount === steps.length && Boolean(profile);
  const currentStep = steps[isResult ? steps.length - 1 : answeredCount];

  const reset = useCallback(() => setAnswers({}), []);

  const pick = (step, value) =>
    setAnswers((prev) =>
      // Змінили профіль — попередні уточнення втрачають сенс
      step === "profile" ? { profile: value } : { ...prev, [step]: value },
    );

  const goBack = () => {
    const order = ["stage", "product", "profile"];
    const last = order.find((step) => answers[step]);
    if (!last) return onClose();

    setAnswers((prev) => {
      const next = { ...prev };
      delete next[last];
      return next;
    });
  };

  // Запам'ятовуємо, звідки відкрили, блокуємо скрол сторінки під поп-апом
  useEffect(() => {
    if (!isOpen) return undefined;

    restoreFocusRef.current = document.activeElement;

    /*
     * Замок ставимо і на <html>, і на <body>: у різних браузерах скрол живе на
     * різних елементах, і одного body мало — сторінка під поп-апом їхала далі.
     */
    const root = document.documentElement;
    const { overflow: bodyOverflow, paddingRight } = document.body.style;
    const rootOverflow = root.style.overflow;
    const scrollbar = window.innerWidth - root.clientWidth;

    root.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
    if (scrollbar > 0) document.body.style.paddingRight = `${scrollbar}px`;

    const frame = requestAnimationFrame(() => {
      const first = dialogRef.current?.querySelector(FOCUSABLE);
      (first ?? dialogRef.current)?.focus();
    });

    return () => {
      cancelAnimationFrame(frame);
      root.style.overflow = rootOverflow;
      document.body.style.overflow = bodyOverflow;
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

  /*
   * Поки профіль не обраний, ми ще не знаємо, чи буде крок про напрям
   * продукції, тому показуємо найдовший можливий шлях — інакше на першому
   * питанні стояло б «01 / 01», ніби тест уже закінчився.
   */
  const LONGEST_PATH = 3;
  const totalSteps = answeredCount === 0 ? LONGEST_PATH : steps.length;
  const stepNumber = isResult ? totalSteps : answeredCount + 1;
  const progress = (stepNumber / totalSteps) * 100;

  const resultId = isResult ? resolveResultId(profile, product) : null;
  const result = resultId ? copy.results[resultId] : null;
  const formHref = resultId ? resolveFormHref(resultId, language) : null;
  const email = resultId ? resolveEmail(resultId) : null;

  const question = isResult ? null : copy.steps[currentStep];

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
              disabled={answeredCount === 0}
            >
              <span aria-hidden="true">←</span>
              {copy.back}
            </button>

            <div
              className="join-quiz__progress"
              role="progressbar"
              aria-valuemin={1}
              aria-valuemax={totalSteps}
              aria-valuenow={stepNumber}
            >
              <span style={{ width: `${progress}%` }} />
            </div>

            <p className="join-quiz__counter">
              <strong>{String(stepNumber).padStart(2, "0")}</strong> /{" "}
              {String(totalSteps).padStart(2, "0")}
            </p>
          </div>
        )}

        <div
          className="join-quiz__card"
          key={isResult ? `result-${resultId}` : currentStep}
        >
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

              <p className="join-quiz__result-next">
                <span>{copy.nextLabel}</span>
                {copy.nextText}
              </p>

              <div className="join-quiz__result-actions">
                <Button
                  href={formHref}
                  target="_blank"
                  rel="noreferrer"
                  className="join-quiz__submit"
                >
                  {copy.submit}
                </Button>

                <a
                  className="join-quiz__contact"
                  href={`mailto:${email}?subject=${encodeURIComponent(
                    `${copy.mailSubject}: ${result.title}`,
                  )}`}
                >
                  {copy.contact}
                  <span aria-hidden="true">→</span>
                </a>
              </div>
            </div>
          ) : (
            <>
              <h2 id="join-quiz-title" className="join-quiz__title">
                {question.title}
              </h2>
              <p className="join-quiz__subtitle">{question.text}</p>

              <ul className="join-quiz__options">
                {question.options.map((item, index) => (
                  <li key={item.id}>
                    <button
                      type="button"
                      className={`join-quiz__option${
                        answers[currentStep] === item.id ? " is-active" : ""
                      }`}
                      onClick={() => pick(currentStep, item.id)}
                    >
                      <span
                        className="join-quiz__option-index"
                        aria-hidden="true"
                      >
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span className="join-quiz__option-label">
                        {item.label}
                      </span>
                      <span
                        className="join-quiz__option-arrow"
                        aria-hidden="true"
                      >
                        →
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
};
