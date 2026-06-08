import { PageLayout } from "../../components/PageLayout";
import { TrackBunner } from "../../components/TrackBunner";
import { TrackIntro } from "../../components/TrackIntro";
import { AnimationCards } from "../../components/AnimationCards";
import { TrackCooperation } from "../../components/TrackCooperation";
import { Parnters } from "../../components/Parnters";
import "./style.css";
import { Articles } from "../../components/Articles";

export const TrackPage = () => {
  return (
    <PageLayout>
      <div className="track-page">
        <TrackIntro />
        <TrackBunner />
        <AnimationCards />
      </div>

      <div className="track-page__bg-blue">
        <Parnters />
      </div>

      <Articles />
    </PageLayout>
  );
};
