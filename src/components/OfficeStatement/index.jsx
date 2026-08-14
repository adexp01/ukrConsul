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
              <p key={text} className="office-statement__text">
                {text}
              </p>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
};
