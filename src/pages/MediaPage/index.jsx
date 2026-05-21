import { PageLayout } from "../../components/PageLayout";
import { MediaBunner } from "../../components/MediaBunner";
import { MainMedia } from "../../components/MainMedia";
import { MediaInfo } from "../../components/MediaInfo";
import { MediaItems } from "../../components/MediaItems";
import { OurNews } from "../../components/OurNews";
import { DownloadMedia } from "../../components/DownloadMedia";
import { SendRequest } from "../../components/UI/SendRequest";
import { ForJournalist } from "../../components/ForJournalist";
import "./style.css";

export const MediaPage = () => {
  return (
    <PageLayout>
      <div className="media-page">
        <div className="news-wrap">
          <MediaBunner />
        </div>

        <div className="our-news-wrap">
          <OurNews />
        </div>

        <MediaInfo />
        <MediaItems />
        <MainMedia />
        <ForJournalist />
        <DownloadMedia />
        <SendRequest />
      </div>
    </PageLayout>
  );
};
