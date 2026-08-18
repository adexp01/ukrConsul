import { lazy, Suspense } from "react";
import { PageLayout } from "../../components/PageLayout";
import { AboutUsBanner } from "../../components/AboutUsBanner";
import { EcoSystem } from "../../components/EcoSystem";
import { WhatWeDo } from "../../components/WhatWeDo";
import { TEAM_ENABLED } from "../../config/features";
import { Info } from "../../components/Info";
import { useLanguage } from "../../i18n/LanguageContext";
import "./style.css";
import { useSeo } from "../../seo/useSeo";

// Блок вимкнений прапорцем — окремий чанк, щоб його стилі не лежали в загальному CSS
const Team = lazy(() =>
  import("../../components/Team").then((m) => ({ default: m.Team })),
);

export const AboutUsPage = () => {
  useSeo("aboutUs", { path: "about-us" });

  const { t } = useLanguage();

  return (
    <PageLayout>
      <section className="about-us-page">
        <div className="about-us-page__inner">
          <AboutUsBanner />
          <EcoSystem />
          <div className="info">
            <Info
              contentKey="aboutUsPage.communities"
              showAboutBtn={false}
              headingId="about-us-communities-heading"
              ctaTitleId="about-us-communities-cta-title"
              applyHref={t("aboutUsPage.banner.contactHref")}
            />
          </div>
          <WhatWeDo />
          {TEAM_ENABLED ? (
            <Suspense fallback={null}>
              <Team />
            </Suspense>
          ) : null}
        </div>
      </section>
    </PageLayout>
  );
};
