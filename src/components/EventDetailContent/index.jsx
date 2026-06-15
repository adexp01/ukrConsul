import { Link, Navigate, useParams } from "react-router-dom";
import { Button } from "../UI/Button";
import { EVENT_APPLY_FORM_URL } from "../../data/externalLinks";
import { useLanguage } from "../../i18n/LanguageContext";
import "./style.css";

export const EventDetailContent = () => {
  const { id } = useParams();
  const { t, localizePath } = useLanguage();

  const events = t("eventDetails");
  const event = events?.[id];
  const labels = t("eventDetailsPage");

  if (!event) {
    return <Navigate to={localizePath("/events")} replace />;
  }

  const formatLabel =
    event.format === "offline" ? labels.formatOffline : labels.formatOnline;

  const applyFormUrl = event.applyFormUrl || labels.applyFormUrl || EVENT_APPLY_FORM_URL;

  return (
    <div className="event-detail__shell">
      <nav className="event-detail__breadcrumbs" aria-label="Breadcrumb">
        <Link to={localizePath("/events")} className="event-detail__breadcrumb-link">
          {labels.breadcrumbEvents}
        </Link>
        <span className="event-detail__breadcrumb-sep" aria-hidden="true">
          &gt;
        </span>
        <span className="event-detail__breadcrumb-current">
          {event.breadcrumbGroup} | {event.breadcrumbTitle}
        </span>
      </nav>

      <div className="event-detail__frame">
        <div className="event-detail__glow" aria-hidden="true" />

        <div className="event-detail__gutter" aria-hidden="true" />

        <div className="event-detail__main">
          <header className="event-detail__header">
            <p className="event-detail__time">{event.time}</p>

            <div className="event-detail__badges">
              <span className="event-detail__badge event-detail__badge--category">
                <span className="event-detail__badge-dot" aria-hidden="true" />
                <span className="event-detail__badge-text">
                  {event.categoryLabel}{" "}
                  <strong>{event.categoryName}</strong>
                </span>
              </span>
              <span
                className={`event-detail__badge event-detail__badge--format event-detail__badge--format-${event.format}`}
              >
                {formatLabel}
              </span>
            </div>

            <h1 className="event-detail__title">{event.title}</h1>
          </header>

          <div className="event-detail__visual" aria-hidden="true">
            <span className="event-detail__visual-placeholder">
              {labels.imagePlaceholder}
            </span>
          </div>

          <div className="event-detail__body">
            {event.body.map((paragraph, index) => (
              <p key={`${id}-${index}`}>{paragraph}</p>
            ))}
          </div>

          <aside className="event-detail__register">
            <p className="event-detail__register-title">
              {event.registrationTitle}
            </p>
            <p className="event-detail__register-deadline">
              {event.registrationDeadline}
            </p>
            <Button
              href={applyFormUrl || "#"}
              target={applyFormUrl ? "_blank" : undefined}
              rel={applyFormUrl ? "noopener noreferrer" : undefined}
              variant="primary"
              className="event-detail__apply-btn"
            >
              {labels.apply}
            </Button>
          </aside>
        </div>

        <div className="event-detail__gutter" aria-hidden="true" />
      </div>
    </div>
  );
};
