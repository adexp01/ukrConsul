import { Button, NavArrows } from "../UI/Button";
import { useCarousel, usePerView } from "../../hooks/useCarousel";
import { useLanguage } from "../../i18n/LanguageContext";
import { useJoinQuiz } from "../JoinQuiz/JoinQuizContext";
import "./style.css";

/*
 * Скільки карток у вікні. Ці межі мають збігатися з --card-w у style.css:
 * ширину картки рахує CSS, а до якого індексу можна крутити — JS.
 */
const PER_VIEW = [
  { upTo: 640, count: 1 },
  { upTo: 1024, count: 2 },
  { count: 3 },
];

export const JoinEcosystem = () => {
  const { openJoinQuiz } = useJoinQuiz();
  const { t } = useLanguage();
  const copy = t("joinPage.ecosystem");
  const joinCopy = t("joinPage");
  const perView = usePerView(PER_VIEW);
  const {
    items: cards,
    startIndex,
    goPrev,
    goNext,
    isFirst,
    isLast,
  } = useCarousel(copy.items, perView);

  if (cards.length === 0) return null;

  return (
    <section className="join-ecosystem" aria-labelledby="join-ecosystem-title">
      <div className="join-ecosystem__inner">
        <h2 id="join-ecosystem-title" className="join-ecosystem__title">
          {copy.title.map((line) => (
            <span key={line}>{line}</span>
          ))}
        </h2>

        {/*
          У DOM усі картки, а не лише видимі три — тільки так перемикання може
          бути плавним. Раніше компонент рендерив зріз списку, тобто на клік
          старі картки зникали, а нові з'являлися на їхньому місці: рухатись
          було нічому. Тепер стрічка просто зсувається на одну картку через
          transform, а вікно її обрізає.
        */}
        <div className="join-ecosystem__viewport">
          <div
            className="join-ecosystem__track"
            style={{ "--shift": startIndex }}
          >
            {cards.map((item, index) => {
              const inWindow =
                index >= startIndex && index < startIndex + perView;

              return (
                <article
                  key={item.title}
                  className="join-ecosystem-card"
                  /*
                   * Картки за межами вікна не мають ловити фокус: інакше Tab
                   * заводить на невидиме посилання, і браузер підкручує вікно
                   * убік, ламаючи розкладку стрічки.
                   */
                  aria-hidden={inWindow ? undefined : "true"}
                >
                  <h3 className="join-ecosystem-card__title">{item.title}</h3>
                  <p className="join-ecosystem-card__text">{item.text}</p>

                  {item.href ? (
                    <a
                      href={item.href}
                      className="join-ecosystem-card__link"
                      target="_blank"
                      rel="noreferrer"
                      tabIndex={inWindow ? undefined : -1}
                    >
                      {copy.cardCta}
                      <span aria-hidden="true">↗</span>
                    </a>
                  ) : null}
                </article>
              );
            })}
          </div>
        </div>

        <div className="join-ecosystem__footer">
          {/*
            Тут лише одна кнопка. Раніше поруч стояло посилання «Дізнатися,
            який формат участі вам підходить» — воно відкривало той самий тест,
            що й «Подати заявку», тобто дві кнопки вели в одне місце. Плюс про
            формати участі йдеться в наступній секції, тому в блоці «хто вже
            входить до екосистеми» такий заклик не на місці.
          */}
          <div className="join-ecosystem__actions">
            <Button onClick={openJoinQuiz} variant="primary">
              {joinCopy.primaryCta}
            </Button>
          </div>

          <NavArrows
            className="join-ecosystem__nav"
            variant="outline"
            onPrev={goPrev}
            onNext={goNext}
            prevLabel={copy.prevLabel}
            nextLabel={copy.nextLabel}
            prevDisabled={isFirst}
            nextDisabled={isLast}
          />
        </div>
      </div>
    </section>
  );
};
