import { lazy, Suspense } from "react";
import { Header } from "../../components/Header";
import { Bunner } from "../../components/Bunner";
import { AboutUs } from "../../components/AboutUs";
import { Info } from "../../components/Info";
import { Gallery } from "../../components/Gallery";
import { Articles } from "../../components/Articles";
import { Anima } from "../../components/Anima";
import { Footer } from "../../components/Footer";
import { PageGradients } from "../../components/PageGradients";
import { EVENTS_ENABLED } from "../../config/features";

/*
 * Блок подій вимкнений прапорцем. Підгрузка окремим чанком, а не звичайний
 * імпорт: сам компонент збірник викидає, а `import "./style.css"` усередині
 * нього — побічний ефект, який лишався б у загальному CSS.
 */
const UpEvents = lazy(() =>
  import("../../components/UpEvents").then((m) => ({ default: m.UpEvents })),
);

export const HomePage = () => {
  return (
    <div className="page-shell">
      {/*
        Фон сторінки: чорний плюс градієнти з макета. Стоїть першим і лежить
        під усім контентом (z-index: -1), тому нічого не перекриває.
      */}
      <PageGradients
        blocks={[1, 2, 3, 4]}
        circleTwoAnchor=".articles-wrap"
      />

      <div className="header-container">
        <Header />
      </div>
      <main className="home-page">
        <Bunner />
      </main>
      <div className="about-us-wrap">
        <AboutUs />
      </div>
      <div className="info">
        <Info />
      </div>
      <div className="gallery">
        <Gallery />
      </div>
      {EVENTS_ENABLED ? (
        <div className="up-events-wrap">
          <Suspense fallback={null}>
            <UpEvents />
          </Suspense>
        </div>
      ) : null}
      <div className="articles-wrap">
        <Articles />
      </div>
      <div className="anima-wrap">
        <Anima />
      </div>
      <Footer />
    </div>
  );
};
