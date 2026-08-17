import { PageLayout } from "../../components/PageLayout";
import { TrackBunner } from "../../components/TrackBunner";
import { TrackIntro } from "../../components/TrackIntro";
import { AnimationCards } from "../../components/AnimationCards";
import { Parnters } from "../../components/Parnters";
import "./style.css";
import { Articles } from "../../components/Articles";
import { useSeo } from "../../seo/useSeo";

export const TrackContent = () => (
  <>
    <div className="track-page">
      <TrackIntro />
      <TrackBunner />
      <AnimationCards />
    </div>

    <div className="track-page__bg-blue">
      <Parnters />
    </div>

    <Articles />
  </>
);

export const TrackPage = () => {
  useSeo("track", { path: "track" });

  return (
    <PageLayout>
      <TrackContent />
    </PageLayout>
  );
};
