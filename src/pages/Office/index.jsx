import { useState } from "react";
import { Articles } from "../../components/Articles";
import { Clock } from "../../components/Clock";
import { ExportMap } from "../../components/ExportMap";
import { OfficeDecisions } from "../../components/OfficeDecisions";
import { OfficeGrMeetups } from "../../components/OfficeGrMeetups";
import { OfficeServices } from "../../components/OfficeServices";
import { OfficeWhiteBook } from "../../components/OfficeWhiteBook";
import { OfficeWorkFocus } from "../../components/OfficeWorkFocus";
import { PageLayout } from "../../components/PageLayout";
import { useLanguage } from "../../i18n/LanguageContext";
import { TrackContent } from "../TrackPage";
import "./style.css";
import b11 from "../../assets/b11.png";
import b12 from "../../assets/b12.png";
import b13 from "../../assets/b13.png";
import b14 from "../../assets/b14.png";
import b15 from "../../assets/b15.png";
import b16 from "../../assets/b16.png";

export const OfficePage = () => {
  const { t } = useLanguage();
  const titleLines = t("office.hero.title");
  const tabs = t("office.hero.tabs");
  const [activeTabId, setActiveTabId] = useState("gr");
  const activeTab = tabs.find((tab) => tab.id === activeTabId);
  const isGrTab = activeTabId === "gr";
  const isExportTab = activeTabId === "export";
  const isInternationalTab = activeTabId === "international";

  return (
    <PageLayout>
      <div className="office-page">
        <section className="office-hero" aria-labelledby="office-hero-title">
          <div className="office-hero__visual" aria-hidden="true">
            <img
              src={b11}
              alt=""
              className="office-hero__icon office-hero__icon--one"
            />
            <img
              src={b12}
              alt=""
              className="office-hero__icon office-hero__icon--two"
            />
            <img
              src={b16}
              alt=""
              className="office-hero__shield"
              loading="eager"
              decoding="async"
            />
            <img
              src={b13}
              alt=""
              className="office-hero__icon office-hero__icon--three"
            />
            <img
              src={b14}
              alt=""
              className="office-hero__icon office-hero__icon--four"
            />
            <img
              src={b15}
              alt=""
              className="office-hero__icon office-hero__icon--five"
            />
          </div>

          <h1 id="office-hero-title" className="office-hero__title">
            {titleLines.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </h1>
          <p className="office-hero__text">{t("office.hero.description")}</p>

          <nav
            className="office-hero__tabs"
            aria-label={t("office.hero.tabsLabel")}
          >
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                className={`office-hero__tab${
                  activeTabId === tab.id ? " is-active" : ""
                }`}
                aria-selected={activeTabId === tab.id}
                onClick={() => setActiveTabId(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </section>

        {isGrTab ? (
          <>
            <ExportMap />
            <OfficeWorkFocus />
            <OfficeDecisions />
            <OfficeWhiteBook />
            <OfficeGrMeetups />
          </>
        ) : isExportTab ? (
          <>
            <OfficeServices />
            <Clock />
            <Articles />
          </>
        ) : isInternationalTab ? (
          <TrackContent />
        ) : (
          <section className="office-empty-tab" aria-live="polite">
            <p>
              {t("office.hero.emptyTab")} {activeTab?.label}
            </p>
          </section>
        )}
      </div>
    </PageLayout>
  );
};
