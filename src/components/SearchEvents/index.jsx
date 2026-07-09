import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "../UI/Button";
import { SEARCH_EVENT_GROUPS } from "../../data/searchEventsCatalog";
import { useLanguage } from "../../i18n/LanguageContext";
import "./style.css";
import plus from "../../assets/plus.svg";

const CATEGORIES = [
  "Закриті заходи",
  "Партнерські заходи",
  "Відкриті заходи",
  "Міжнародні заходи",
  "Виставки",
  "Релевантні події",
];

const matchesSearchQuery = (item, query) => {
  if (!query) {
    return true;
  }

  const haystack = [
    item.title,
    item.summary,
    ...(item.cards?.flatMap((card) => [card.title, card.text, card.date]) ?? []),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return haystack.includes(query);
};

const SearchField = ({ className, value, onChange }) => (
  <label className={`search-events__search ${className}`.trim()}>
    <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <circle cx="8.5" cy="8.5" r="4.75" stroke="#ffffff" strokeWidth="1.5" />
      <path d="M12 12L16 16" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
    <input
      type="search"
      placeholder="Пошук події..."
      value={value}
      onChange={onChange}
      aria-label="Пошук події"
    />
  </label>
);

export const SearchEvents = () => {
  const { localizePath } = useLanguage();
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0]);
  const [activeEventId, setActiveEventId] = useState();
  const [searchQuery, setSearchQuery] = useState("");

  const normalizedQuery = searchQuery.trim().toLowerCase();
  const filteredGroups = SEARCH_EVENT_GROUPS.filter((item) =>
    matchesSearchQuery(item, normalizedQuery),
  );

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const toggleEvent = (id) => {
    setActiveEventId((current) => (current === id ? "" : id));
  };

  return (
    <div className="search-events">
      <h1 className="search-events__title">Заходи</h1>

      <div className="search-events__layout">
        <aside className="search-events__sidebar">
          <div className="search-events__sidebar-inner">
            <div className="search-events__filters">
              <div className="search-events__chips">
                {CATEGORIES.map((item) => (
                  <button
                    key={item}
                    type="button"
                    className={`search-events__chip${activeCategory === item ? " search-events__chip--active" : ""}`}
                    onClick={() => setActiveCategory(item)}
                  >
                    {item}
                  </button>
                ))}
              </div>

              <SearchField
                className="search-events__search--toolbar"
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </div>

            <div className="search-events__cta search-events__desktop-cta">
              <p>
                Якщо є тема, яку варто розкрити у форматі <b>«Поміж зброярів»</b>,
                запропонуйте її, і ми розглянемо ваш запит.
              </p>
              <Button href="#" variant="primary" className="search-events__cta-btn">
                Запропонувати тему
              </Button>
            </div>
          </div>
        </aside>

        <section className="search-events__content">
          <SearchField
            className="search-events__search--content"
            value={searchQuery}
            onChange={handleSearchChange}
          />

          <div className="search-events__group-head">
            <h2>
              Закриті заходи <span>{filteredGroups.length}</span>
            </h2>
            <p>
              Закриті події для спільноти Ради зброярів: компаній-учасниць,
              партнерів і запрошених експертів.
            </p>
          </div>

          <div className="search-events__list">
            {filteredGroups.length === 0 ? (
              <p className="search-events__empty">Нічого не знайдено. Спробуйте інший запит.</p>
            ) : null}

            {filteredGroups.map((item) => {
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
                    <span
                      className={`search-events__item-add${isOpen ? " search-events__item-add--open" : ""}`}
                      aria-hidden="true"
                    >
                      {isOpen ? (
                        <svg
                          className="search-events__item-add-icon"
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                          aria-hidden="true"
                        >
                          <path
                            d="M16 10L4 10"
                            stroke="white"
                            strokeWidth="1.2"
                            strokeLinecap="round"
                          />
                        </svg>
                      ) : (
                        <img
                          src={plus}
                          width={20}
                          height={20}
                          alt=""
                          className="search-events__item-add-icon"
                        />
                      )}
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
                              to={localizePath(`/events/details/${card.detailId}`)}
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

          <div className="search-events__mobile-footer search-events__mobile-only">
            <div className="search-events__cta">
              <p>
                Якщо є тема, яку варто розкрити у форматі <b>«Поміж зброярів»</b>,
                запропонуйте її, і ми розглянемо ваш запит.
              </p>
              <Button href="#" variant="primary" className="search-events__cta-btn">
                Запропонувати тему
              </Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
