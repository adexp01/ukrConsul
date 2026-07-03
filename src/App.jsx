import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ButtonGradients } from "./components/UI/Button";
import { ScrollToTop } from "./components/ScrollToTop";
import { LanguageProvider } from "./i18n/LanguageContext";
import { LegacyRedirect } from "./i18n/LegacyRedirect";
import { LocaleOutlet } from "./i18n/LocaleOutlet";
import { HomePage } from "./pages/HomePage";
import { MediaPage } from "./pages/MediaPage";
import { ArticlePage } from "./pages/ArticlePage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { PrivacyPolicyPage } from "./pages/PrivacyPolicyPage";
import { EventsPage } from "./pages/EventsPage";
import { EventDetailPage } from "./pages/EventDetailPage";
import { TrackPage } from "./pages/TrackPage";
import { OfficePage } from "./pages/Office";
import { AboutUsPage } from "./pages/AboutUsPage";
import { JoinPage } from "./pages/JoinPage";

function App() {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <ButtonGradients />
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Navigate to="/en" replace />} />
          <Route path="/:locale" element={<LocaleOutlet />}>
            <Route index element={<HomePage />} />
            <Route path="media" element={<MediaPage />} />
            <Route path="article/:id" element={<ArticlePage />} />
            <Route path="events" element={<EventsPage />} />
            <Route path="events/details/:id" element={<EventDetailPage />} />
            <Route path="track" element={<TrackPage />} />
            <Route path="office" element={<OfficePage />} />
            <Route path="about-us" element={<AboutUsPage />} />
            <Route path="join" element={<JoinPage />} />
            <Route path="privacy-policy" element={<PrivacyPolicyPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
          <Route path="*" element={<LegacyRedirect />} />
        </Routes>
      </LanguageProvider>
    </BrowserRouter>
  );
}

export default App;
