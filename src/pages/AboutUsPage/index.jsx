import { PageLayout } from "../../components/PageLayout";
import { AboutUsBanner } from "../../components/AboutUsBanner";
import { EcoSystem } from "../../components/EcoSystem";
import { WhatWeDo } from "../../components/WhatWeDo";
import { Team } from "../../components/Team";
import { Info } from "../../components/Info";
import { useLanguage } from "../../i18n/LanguageContext";
import "./style.css";
import { useSeo } from "../../seo/useSeo";

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
              testHref={t("aboutUsPage.banner.joinHref")}
              applyHref={t("aboutUsPage.banner.contactHref")}
            />
          </div>
          <WhatWeDo />
          <Team />
        </div>
      </section>
    </PageLayout>
  );
};
