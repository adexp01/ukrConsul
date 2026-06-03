import { PageLayout } from "../../components/PageLayout";
import { MediaBunner } from "../../components/MediaBunner";
import { MainMedia } from "../../components/MainMedia";
import { MediaInfo } from "../../components/MediaInfo";
import { MediaItems } from "../../components/MediaItems";
import { MediaNews } from "../../components/MediaNews";
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

        <div className="media-news-wrap">
          <MediaNews />
        </div>

        <MediaInfo />
        <MediaItems />
        <MainMedia />
        <ForJournalist />
        <DownloadMedia />
        {/* <SendRequest /> */}
      </div>
    </PageLayout>
  );
};
