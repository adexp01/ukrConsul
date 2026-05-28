import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "../UI/Button";
import { SEARCH_EVENT_GROUPS } from "../../data/searchEventsCatalog";
import "./style.css";

const CATEGORIES = [
  "Закриті заходи",
  "Партнерські заходи",
  "Відкриті заходи",
  "Міжнародні заходи",
  "Виставки",
  "Релевантні події",
];

export const SearchEvents = () => {
  const [activeEventId, setActiveEventId] = useState(
    SEARCH_EVENT_GROUPS[0].id,
  );

  const toggleEvent = (id) => {
    setActiveEventId((current) => (current === id ? "" : id));
  };

  return (
    <div className="search-events">
      <h1 className="search-events__title">Заходи</h1>

      <div className="search-events__layout">
        <aside className="search-events__sidebar">
          <div className="search-events__chips">
            {CATEGORIES.map((item, index) => (
              <button
                key={item}
                type="button"
                className={`search-events__chip${index === 0 ? " search-events__chip--active" : ""}`}
              >
                {item}
              </button>
            ))}
          </div>

          <div className="search-events__cta">
            <p>
              Якщо є тема, яку варто розкрити у форматі <b>«Поміж зброярів»</b>,
              запропонуйте її, і ми розглянемо ваш запит.
            </p>
            <Button href="#" variant="primary" className="search-events__cta-btn">
              Запропонувати тему
            </Button>
          </div>
        </aside>

        <section className="search-events__content">
          <label className="search-events__search">
            <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <circle cx="8.5" cy="8.5" r="4.75" stroke="currentColor" strokeWidth="1.5" />
              <path d="M12 12L16 16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <input type="text" placeholder="Пошук події..." />
          </label>

          <div className="search-events__group-head">
            <h2>
              Закриті заходи <span>21</span>
            </h2>
            <p>
              Закриті події для спільноти Ради зброярів: компаній-учасниць,
              партнерів і запрошених експертів.
            </p>
          </div>

          <div className="search-events__list">
            {SEARCH_EVENT_GROUPS.map((item) => {
              const isOpen = activeEventId === item.id;

              return (
                <article
                  key={item.id}
                  className={`search-events__item${isOpen ? " search-events__item--open" : ""}`}
                >
                  <button
                    type="button"
                    className="search-events__item-head"
                    onClick={() => toggleEvent(item.id)}
                    aria-expanded={isOpen}
                  >
                    <span className="search-events__item-name">{item.title}</span>
                    <span className="search-events__item-add" aria-hidden="true">
                      {isOpen ? "−" : "+"}
                    </span>
                  </button>

                  {isOpen && item.summary ? (
                    <div className="search-events__item-panel">
                      <p className="search-events__item-summary">{item.summary}</p>

                      <div className="search-events__event-cards">
                        {item.cards?.map((card) => (
                          <article
                            key={card.detailId}
                            className="search-events__event-card"
                          >
                            <p className="search-events__event-date">{card.date}</p>
                            <h3 className="search-events__event-title">{card.title}</h3>
                            <p className="search-events__event-text">{card.text}</p>
                            <Link
                              to={`/events/details/${card.detailId}`}
                              className="search-events__event-link"
                            >
                              Більше про подію
                              <span aria-hidden="true">→</span>
                            </Link>
                          </article>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </article>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
};
