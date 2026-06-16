import { useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Button } from "../UI/Button";
import { useLanguage } from "../../i18n/LanguageContext";
import { stripLocalePrefix } from "../../i18n/localeRoutes";
import "./style.css";

const WEEKDAYS = ["M", "T", "W", "T", "F", "S", "S"];

const EVENT_KEYS = [];

const toKey = (year, month, day) =>
  `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

const getMonthGrid = (year, month) => {
  const firstDay = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startOffset = (firstDay.getDay() + 6) % 7;

  const cells = [];
  for (let i = 0; i < startOffset; i += 1) cells.push(null);
  for (let day = 1; day <= daysInMonth; day += 1) cells.push(day);
  while (cells.length % 7 !== 0) cells.push(null);

  return cells;
};

export const UpEvents = () => {
  const { t, language } = useLanguage();
  const [viewDate, setViewDate] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const [selectedDay, setSelectedDay] = useState(() => new Date().getDate());
  const { pathname } = useLocation();

  const events = useMemo(() => {
    const translated = t("upEvents.events");
    return EVENT_KEYS.reduce((acc, key) => {
      if (translated[key]) acc[key] = translated[key];
      return acc;
    }, {});
  }, [t, language]);

  const monthNames = t("upEvents.months");

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const monthLabel = monthNames[month];

  const cells = useMemo(() => getMonthGrid(year, month), [year, month]);

  const selectedKey = toKey(year, month, selectedDay);
  const selectedEvent = events[selectedKey];

  const changeMonth = (delta) => {
    setViewDate(new Date(year, month + delta, 1));
    setSelectedDay(1);
  };

  const isEventsPage = stripLocalePrefix(pathname) === "/events";

  return (
    <section className="up-events" aria-labelledby="up-events-title">
      <div className="up-events__inner">
        <header className="up-events__header">
          <span className="up-events__icon" aria-hidden="true">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 56 56"
              fill="none"
            >
              <rect width="56" height="56" fill="#5362A2" />
              <circle cx="28" cy="28" r="28" fill="#060C25" />
              <circle cx="27.999" cy="28.0004" r="3.73333" fill="white" />
            </svg>
          </span>
          <h2 id="up-events-title" className="up-events__title">
            {t("upEvents.title")}
          </h2>
        </header>

        <div className="up-events__divider" aria-hidden="true" />

        <div className="up-events__body">
          <div className="up-events__calendar">
            <div className="up-events__calendar-head">
              <span className="up-events__month">{monthLabel}</span>
              <div className="up-events__month-nav">
                <button
                  type="button"
                  className="up-events__month-btn"
                  onClick={() => changeMonth(-1)}
                  aria-label={t("upEvents.prevMonth")}
                >
                  ←
                </button>
                <button
                  type="button"
                  className="up-events__month-btn"
                  onClick={() => changeMonth(1)}
                  aria-label={t("upEvents.nextMonth")}
                >
                  →
                </button>
              </div>
            </div>

            <div className="up-events__weekdays">
              {WEEKDAYS.map((day, index) => (
                <span key={`${day}-${index}`}>{day}</span>
              ))}
            </div>

            <div className="up-events__days" role="grid" aria-label="Calendar">
              {cells.map((day, index) => {
                if (day === null) {
                  return (
                    <span
                      key={`empty-${index}`}
                      className="up-events__day up-events__day--empty"
                    />
                  );
                }

                const dateKey = toKey(year, month, day);
                const hasEvent = Boolean(events[dateKey]);
                const isSelected = day === selectedDay;

                return (
                  <button
                    key={dateKey}
                    type="button"
                    role="gridcell"
                    className={`up-events__day${isSelected ? " up-events__day--selected" : ""}${hasEvent ? " up-events__day--has-event" : ""}`}
                    onClick={() => setSelectedDay(day)}
                    aria-selected={isSelected}
                    aria-label={`${day} ${monthLabel}${hasEvent ? t("upEvents.hasEvent") : ""}`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </div>

          <article className="up-events__details">
            {selectedEvent ? (
              <>
                <p className="up-events__time">{selectedEvent.time}</p>

                <div className="up-events__badges">
                  <span className="up-events__badge up-events__badge--category">
                    <span className="up-events__badge-dot" aria-hidden="true" />
                    <span className="up-events__badge-text">
                      {selectedEvent.categoryLabel}{" "}
                      <strong>{selectedEvent.categoryName}</strong>
                    </span>
                  </span>
                  <span
                    className={`up-events__badge up-events__badge--format up-events__badge--format-${selectedEvent.format}`}
                  >
                    {selectedEvent.format === "offline"
                      ? t("upEvents.formatOffline")
                      : t("upEvents.formatOnline")}
                  </span>
                </div>

                <h3 className="up-events__event-title">
                  {selectedEvent.title}
                </h3>
                <p className="up-events__event-desc">
                  {selectedEvent.description}
                </p>
              </>
            ) : (
              <p className="up-events__empty">{t("upEvents.noEvents")}</p>
            )}

            <a href="#" className="up-events__link">
              {t("upEvents.discover")}
              <span aria-hidden="true">→</span>
            </a>

            {isEventsPage ? (
              <></>
            ) : (
              <Button href="#" variant="default" className="up-events__all-btn">
                {t("upEvents.allEvents")}
              </Button>
            )}
          </article>
        </div>

        <div className="up-events__divider" aria-hidden="true" />
      </div>
    </section>
  );
};
