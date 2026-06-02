import { Articles } from "../../components/Articles";
import { Clock } from "../../components/Clock";
import { ExportMap } from "../../components/ExportMap";
import { PageLayout } from "../../components/PageLayout";
import { useLanguage } from "../../i18n/LanguageContext";
import "./style.css";

export const OfficePage = () => {
  const { t } = useLanguage();
  const titleLines = t("office.hero.title");

  return (
    <PageLayout>
      <div className="office-page">
        <section className="office-hero" aria-labelledby="office-hero-title">
          <h1 id="office-hero-title" className="office-hero__title">
            {titleLines.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </h1>
          <p className="office-hero__text">{t("office.hero.description")}</p>
        </section>

        <ExportMap />
        <Clock />
        <Articles />
      </div>
    </PageLayout>
  );
};
