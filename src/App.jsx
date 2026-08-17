import { lazy, Suspense } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ButtonGradients } from "./components/UI/Button";
import { JoinQuizProvider } from "./components/JoinQuiz/JoinQuizContext";
import { ScrollToTop } from "./components/ScrollToTop";
import { TextRevealEngine } from "./components/TextReveal";
import { EVENTS_ENABLED } from "./config/features";
import { LanguageProvider } from "./i18n/LanguageContext";
import { LocaleOutlet } from "./i18n/LocaleOutlet";
import { HomePage } from "./pages/HomePage";
import { MediaPage } from "./pages/MediaPage";
import { ArticlePage } from "./pages/ArticlePage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { PrivacyPolicyPage } from "./pages/PrivacyPolicyPage";
import { TrackPage } from "./pages/TrackPage";
import { OfficePage } from "./pages/Office";
import { AboutUsPage } from "./pages/AboutUsPage";
import { JoinPage } from "./pages/JoinPage";

/*
 * Сторінки заходів вимкнені прапорцем: маршрути під них не реєструються.
 * Через `lazy` — щоб їхні стилі й розмітка не лежали в загальному бандлі.
 */
const EventsPage = lazy(() =>
  import("./pages/EventsPage").then((m) => ({ default: m.EventsPage })),
);
const EventDetailPage = lazy(() =>
  import("./pages/EventDetailPage").then((m) => ({
    default: m.EventDetailPage,
  })),
);

function App() {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <JoinQuizProvider>
          <ButtonGradients />
          <ScrollToTop />
          <TextRevealEngine />
          <Routes>
            <Route path="/" element={<Navigate to="/en" replace />} />
            <Route path="/:locale" element={<LocaleOutlet />}>
              <Route index element={<HomePage />} />
              <Route path="media" element={<MediaPage />} />
              <Route path="article/:id" element={<ArticlePage />} />
              {EVENTS_ENABLED ? (
                <Route
                  path="events"
                  element={
                    <Suspense fallback={null}>
                      <EventsPage />
                    </Suspense>
                  }
                />
              ) : null}
              {EVENTS_ENABLED ? (
                <Route
                  path="events/details/:id"
                  element={
                    <Suspense fallback={null}>
                      <EventDetailPage />
                    </Suspense>
                  }
                />
              ) : null}
              <Route path="track" element={<TrackPage />} />
              <Route path="office" element={<OfficePage />} />
              <Route path="about-us" element={<AboutUsPage />} />
              <Route path="join" element={<JoinPage />} />
              <Route path="privacy-policy" element={<PrivacyPolicyPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>
            {/*
              Окремий маршрут для шляхів без мовного префікса тут не потрібен:
              будь-який шлях з одним і більше сегментів першим матчить
              `/:locale`, і LocaleOutlet сам дописує `/en`, зберігаючи решту.
            */}
          </Routes>
        </JoinQuizProvider>
      </LanguageProvider>
    </BrowserRouter>
  );
}

export default App;
