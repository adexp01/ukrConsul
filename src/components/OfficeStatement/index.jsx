import "./style.css";

/**
 * Велика центрована теза у кілька рядків зі сходинкою праворуч
 * і двома колонками пояснення під нею.
 */
export const OfficeStatement = ({ lines = [], columns = [], titleId }) => {
  if (lines.length === 0) return null;

  return (
    <section className="office-statement" aria-labelledby={titleId}>
      <div className="office-statement__inner">
        <h2 id={titleId} className="office-statement__title">
          {lines.map((line) => (
            <span key={line}>{line}</span>
          ))}
        </h2>

        {columns.length > 0 ? (
          <div className="office-statement__columns">
            {columns.map((text) => (
              /*
               * Ширина колонки пропорційна довжині її тексту.
               *
               * Колонки були однакові по ширині, а тексти — ні: у блоці ZBROYA
               * ліва колонка займала чотири рядки, права дві, і пара виглядала
               * недоробленою. Кількість рядків ≈ довжина / ширина, тож коли
               * ширина пропорційна довжині, рядків у колонках виходить порівну
               * — і це працює само для будь-якої мови, без підбору чисел.
               */
              <p
                key={text}
                className="office-statement__text"
                style={{ "--weight": text.length }}
              >
                {text}
              </p>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
};
