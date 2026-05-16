import { useMemo, useState } from "react";
import { Button } from "../UI/Button";
import "./style.css";

const WEEKDAYS = ["M", "T", "W", "T", "F", "S", "S"];

const EVENTS = {
  "2025-04-10": {
    time: "10 april • 09:00-12:00",
    title: "PRESENTATION OF THE ASD-CONNECT PLATFORM",
    description:
      "We ensure the systematic presence of Ukrainian defense industry manufacturers at key international exhibitions under the ZBROYA brand. We coordinate the participation of companies, organize stands, and support exhibitions at all stages.",
  },
  "2025-04-20": {
    time: "20 april • 14:00-17:00",
    title: "DEFENCE INDUSTRY ROUNDTABLE",
    description:
      "We ensure the systematic presence of Ukrainian defense industry manufacturers at key international exhibitions under the ZBROYA brand. We coordinate the participation of companies, organize stands, and support exhibitions at all stages.",
  },
  "2025-04-22": {
    time: "22 april • 10:00-13:00",
    title: "UAV ECOSYSTEM MEETUP",
    description:
      "We ensure the systematic presence of Ukrainian defense industry manufacturers at key international exhibitions under the ZBROYA brand. We coordinate the participation of companies, organize stands, and support exhibitions at all stages.",
  },
};

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

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const UpEvents = () => {
  const [viewDate, setViewDate] = useState(() => new Date(2025, 3, 1));
  const [selectedDay, setSelectedDay] = useState(10);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const monthLabel = MONTH_NAMES[month];

  const cells = useMemo(() => getMonthGrid(year, month), [year, month]);

  const selectedKey = toKey(year, month, selectedDay);
  const selectedEvent = EVENTS[selectedKey];

  const changeMonth = (delta) => {
    setViewDate(new Date(year, month + delta, 1));
    setSelectedDay(1);
  };

  return (
    <section className="up-events" aria-labelledby="up-events-title">
      <div className="up-events__inner">
        <header className="up-events__header">
          <span className="up-events__icon" aria-hidden="true">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="56"
              height="56"
              viewBox="0 0 56 56"
              fill="none"
            >
              <rect width="56" height="56" fill="#5362A2" />
              <circle cx="28" cy="28" r="28" fill="#060C25" />
              <circle cx="27.999" cy="28.0004" r="3.73333" fill="white" />
            </svg>
          </span>
          <h2 id="up-events-title" className="up-events__title">
            UPCOMING EVENTS
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
                  aria-label="Previous month"
                >
                  ←
                </button>
                <button
                  type="button"
                  className="up-events__month-btn"
                  onClick={() => changeMonth(1)}
                  aria-label="Next month"
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
                const hasEvent = Boolean(EVENTS[dateKey]);
                const isSelected = day === selectedDay;

                return (
                  <button
                    key={dateKey}
                    type="button"
                    role="gridcell"
                    className={`up-events__day${isSelected ? " up-events__day--selected" : ""}${hasEvent ? " up-events__day--has-event" : ""}`}
                    onClick={() => setSelectedDay(day)}
                    aria-selected={isSelected}
                    aria-label={`${day} ${monthLabel}${hasEvent ? ", has event" : ""}`}
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
                <h3 className="up-events__event-title">
                  {selectedEvent.title}
                </h3>
                <p className="up-events__event-desc">
                  {selectedEvent.description}
                </p>
              </>
            ) : (
              <p className="up-events__empty">No events on this date.</p>
            )}

            <a href="#" className="up-events__link">
              Discover the events
              <span aria-hidden="true">→</span>
            </a>

            <Button href="#" variant="default" className="up-events__all-btn">
              All events
            </Button>
          </article>
        </div>

        <div className="up-events__divider" aria-hidden="true" />
      </div>
    </section>
  );
};
