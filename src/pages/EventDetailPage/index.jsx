import { useParams } from "react-router-dom";
import { PageLayout } from "../../components/PageLayout";
import { EventDetailContent } from "../../components/EventDetailContent";
import { useLanguage } from "../../i18n/LanguageContext";
import { useSeo } from "../../seo/useSeo";
import "./style.css";

export const EventDetailPage = () => {
  const { id } = useParams();
  const { t } = useLanguage();

  // Події лежать у словниках локалей, не в CRM — беремо копію звідти.
  const event = t("eventDetails")?.[id];

  const title = event
    ? `${event.breadcrumbGroup} | ${event.breadcrumbTitle}`
    : undefined;

  useSeo("eventDetail", {
    path: `events/details/${id}`,
    overrides: {
      title,
      description: event
        ? [event.time, Array.isArray(event.body) ? event.body[0] : event.body]
            .filter(Boolean)
            .join(". ")
        : undefined,
      type: event ? "article" : "website",
      noindex: !event,
    },
  });

  return (
    <PageLayout>
      <article className="event-detail-page">
        <EventDetailContent />
      </article>
    </PageLayout>
  );
};
