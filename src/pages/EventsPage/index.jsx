import { PageLayout } from "../../components/PageLayout";
import { SearchEvents } from "../../components/SearchEvents";
import { UpEvents } from "../../components/UpEvents";
import "./style.css";

export const EventsPage = () => {
  return (
    <PageLayout>
      <div className="events-page">
        <SearchEvents />
        <UpEvents />
      </div>
    </PageLayout>
  );
};
