import { PageLayout } from "../../components/PageLayout";
import { MediaBunner } from "../../components/MediaBunner";
import { MediaNews } from "../../components/MediaNews";
// Тимчасово приховані секції /media — розкоментувати, коли будуть готові матеріали
// import { MainMedia } from "../../components/MainMedia";
// import { MediaInfo } from "../../components/MediaInfo";
// import { MediaItems } from "../../components/MediaItems";
// import { DownloadMedia } from "../../components/DownloadMedia";
// import { SendRequest } from "../../components/UI/SendRequest";
// import { ForJournalist } from "../../components/ForJournalist";
import "./style.css";
import { useSeo } from "../../seo/useSeo";

export const MediaPage = () => {
  useSeo("media", { path: "media" });

  return (
    <PageLayout>
      <div className="media-page">
        <div className="news-wrap">
          <MediaBunner />
        </div>

        <div className="media-news-wrap">
          <MediaNews />
        </div>

        {/* <MediaInfo /> */}
        {/* <MediaItems /> */}
        {/* <MainMedia /> */}
        {/* <ForJournalist /> */}
        {/* <DownloadMedia /> */}
        {/* <SendRequest /> */}
      </div>
    </PageLayout>
  );
};
