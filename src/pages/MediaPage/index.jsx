import { lazy, Suspense } from "react";
import { PageLayout } from "../../components/PageLayout";
import { MediaBunner } from "../../components/MediaBunner";
import { MediaNews } from "../../components/MediaNews";
import { MEDIA_SECTIONS_ENABLED } from "../../config/features";
import "./style.css";

/*
 * Додаткові секції чекають на матеріали. Прапорець замість закоментованої
 * розмітки, а підгрузка окремим чанком — щоб їхні стилі не лежали в
 * загальному CSS: сам компонент збірник викидає, а `import "./style.css"`
 * усередині нього — ні.
 */
const MediaExtraSections = lazy(
  () => import("../../components/MediaExtraSections"),
);

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

        {MEDIA_SECTIONS_ENABLED ? (
          <Suspense fallback={null}>
            <MediaExtraSections />
          </Suspense>
        ) : null}
      </div>
    </PageLayout>
  );
};
