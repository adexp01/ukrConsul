import { PageLayout } from "../../components/PageLayout";
import { SearchEvents } from "../../components/SearchEvents";
import { UpEvents } from "../../components/UpEvents";
import "./style.css";
import { useSeo } from "../../seo/useSeo";

export const EventsPage = () => {
  useSeo("events", { path: "events" });

  return (
    <PageLayout>
      <div className="events-page">
        <SearchEvents />
        <UpEvents />
      </div>
    </PageLayout>
  );
};
