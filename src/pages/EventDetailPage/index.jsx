import { PageLayout } from "../../components/PageLayout";
import { EventDetailContent } from "../../components/EventDetailContent";
import "./style.css";

export const EventDetailPage = () => {
  return (
    <PageLayout>
      <article className="event-detail-page">
        <EventDetailContent />
      </article>
    </PageLayout>
  );
};
