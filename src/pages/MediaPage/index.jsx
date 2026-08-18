import { lazy, Suspense } from "react";
import { PageLayout } from "../../components/PageLayout";
import { MediaBunner } from "../../components/MediaBunner";
import { MediaNews } from "../../components/MediaNews";
import {
  MEDIA_JOURNALIST_ENABLED,
  MEDIA_SECTIONS_ENABLED,
} from "../../config/features";
import "./style.css";
import { useSeo } from "../../seo/useSeo";

/*
 * Додаткові секції чекають на матеріали. Прапорець замість закоментованої
 * розмітки, а підгрузка окремим чанком — щоб їхні стилі не лежали в
 * загальному CSS: сам компонент збірник викидає, а `import "./style.css"`
 * усередині нього — ні.
 */
const MediaExtraSections = lazy(
  () => import("../../components/MediaExtraSections"),
);

/* Так само окремим чанком: поки прапорець false, цей CSS ніхто не запитує */
const ForJournalist = lazy(() =>
  import("../../components/ForJournalist").then((m) => ({
    default: m.ForJournalist,
  })),
);

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

        {MEDIA_JOURNALIST_ENABLED ? (
          <Suspense fallback={null}>
            <ForJournalist />
          </Suspense>
        ) : null}

        {MEDIA_SECTIONS_ENABLED ? (
          <Suspense fallback={null}>
            <MediaExtraSections />
          </Suspense>
        ) : null}
      </div>
    </PageLayout>
  );
};
