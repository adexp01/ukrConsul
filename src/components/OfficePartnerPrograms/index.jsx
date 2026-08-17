import { useState } from "react";
import { Button } from "../UI/Button";
import { useJoinQuiz } from "../JoinQuiz/JoinQuizContext";
import { isJoinTarget } from "../JoinQuiz/joinCta";
import "./style.css";

/**
 * «Партнерські програми» — акордеон. Відкритий лише один пункт;
 * усередині опис, картки етапів і кнопка.
 */
export const OfficePartnerPrograms = ({ copy }) => {
  const { openJoinQuiz } = useJoinQuiz();
  const items = copy?.items ?? [];
  const [openId, setOpenId] = useState(items[0]?.id ?? null);

  if (items.length === 0) return null;

  return (
    <section
      className="partner-programs"
      aria-labelledby="partner-programs-title"
    >
      <div className="partner-programs__inner">
        <h2 id="partner-programs-title" className="partner-programs__title">
          {copy.title}
        </h2>

        <div className="partner-programs__list">
          {items.map((item, index) => {
            const isOpen = openId === item.id;
            const panelId = `partner-program-${item.id}`;

            return (
              <article
                key={item.id}
                className={`partner-programs__item${isOpen ? " is-open" : ""}`}
              >
                <h3 className="partner-programs__heading">
                  <button
                    type="button"
                    className="partner-programs__trigger"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setOpenId(isOpen ? null : item.id)}
                  >
                    <span
                      className="partner-programs__index"
                      aria-hidden="true"
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="partner-programs__name">{item.title}</span>
                    <span
                      className="partner-programs__toggle"
                      aria-hidden="true"
                    >
                      {isOpen ? "−" : "+"}
                    </span>
                  </button>
                </h3>

                {isOpen ? (
                  <div id={panelId} className="partner-programs__panel">
                    {(item.description ?? []).map((text) => (
                      <p key={text} className="partner-programs__text">
                        {text}
                      </p>
                    ))}

                    {item.stagesTitle ? (
                      <h4 className="partner-programs__stages-title">
                        {item.stagesTitle}
                      </h4>
                    ) : null}

                    {item.stages?.length ? (
                      <div className="partner-programs__stages">
                        {item.stages.map((stage) => (
                          <article
                            key={stage.title}
                            className="partner-programs__stage"
                          >
                            <h5 className="partner-programs__stage-title">
                              {stage.title}
                            </h5>
                            <p className="partner-programs__stage-text">
                              {stage.description}
                            </p>
                          </article>
                        ))}
                      </div>
                    ) : null}

                    {copy.cta ? (
                      <div className="partner-programs__cta">
                        <Button
                          {...(isJoinTarget(copy.ctaHref)
                            ? { onClick: openJoinQuiz }
                            : { href: copy.ctaHref })}
                          variant="primary"
                        >
                          {copy.cta}
                        </Button>
                      </div>
                    ) : null}
                  </div>
                ) : null}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};
