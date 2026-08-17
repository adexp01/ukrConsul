import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Articles } from "../../components/Articles";
import { Clock } from "../../components/Clock";
import { ExportMap } from "../../components/ExportMap";
import { OfficeDecisions } from "../../components/OfficeDecisions";
import { OfficeExpositions } from "../../components/OfficeExpositions";
import { OfficeGrMeetups } from "../../components/OfficeGrMeetups";
import { OfficeIntro } from "../../components/OfficeIntro";
import { OfficePartnerFormats } from "../../components/OfficePartnerFormats";
import { OfficePartnerPrograms } from "../../components/OfficePartnerPrograms";
import { OfficeStatement } from "../../components/OfficeStatement";
import { Parnters } from "../../components/Parnters";
import { Info } from "../../components/Info";
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
  const heroCopy = t("office.hero");
  const tabs = heroCopy.tabs;
  const [activeTabId, setActiveTabId] = useState("export");
  const tabsRef = useRef(null);
  const isFirstRender = useRef(true);

  /*
   * Вкладки підмінюють цілі секції, а разом з ними — висоту сторінки.
   * ScrollTrigger рахує свої позиції один раз при монтуванні, тож без
   * перерахунку анімації нижніх блоків (циферблат, фокус роботи) лишались
   * у стартовому стані: заголовки з autoAlpha 0 так і не проявлялись.
   */
  useLayoutEffect(() => {
    const frame = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => cancelAnimationFrame(frame);
  }, [activeTabId]);

  // Перемкнули вкладку — повертаємось до її початку, а не лишаємось
  // на висоті скролу попередньої
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const tabs = tabsRef.current;
    if (!tabs) return;

    const top = tabs.getBoundingClientRect().top + window.scrollY - 24;
    window.scrollTo({ top, behavior: "instant" });
  }, [activeTabId]);

  // Картинки вантажаться після монтування й зсувають усе нижче за собою
  useEffect(() => {
    const images = Array.from(document.querySelectorAll(".office-page img"));
    const pending = images.filter((image) => !image.complete);
    if (pending.length === 0) return undefined;

    const refresh = () => ScrollTrigger.refresh();
    pending.forEach((image) => {
      image.addEventListener("load", refresh);
      image.addEventListener("error", refresh);
    });

    return () => {
      pending.forEach((image) => {
        image.removeEventListener("load", refresh);
        image.removeEventListener("error", refresh);
      });
    };
  }, [activeTabId]);
  const activeTab = tabs.find((tab) => tab.id === activeTabId);
  const isGrTab = activeTabId === "gr";
  const isExportTab = activeTabId === "export";
  const isInternationalTab = activeTabId === "international";
  const isExhibitionTab = activeTabId === "exhibition";
  const isPartnershipTab = activeTabId === "partnership";
  const exportIntro = heroCopy.tabContent?.export;
  const exhibition = t("office.exhibition");
  const partnership = t("office.partnership");

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
            {heroCopy.title.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </h1>
          <p className="office-hero__text">{heroCopy.description}</p>

          <nav
            ref={tabsRef}
            className="office-hero__tabs"
            aria-label={heroCopy.tabsLabel}
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
            <OfficeWorkFocus />
            <OfficeDecisions />
            <OfficeWhiteBook />
            <OfficeGrMeetups />
            <Articles />
          </>
        ) : isExportTab ? (
          <>
            {exportIntro ? (
              <section
                className="office-tab-intro"
                aria-labelledby="office-export-intro-title"
              >
                <h2 id="office-export-intro-title" className="office-tab-intro__title">
                  {exportIntro.title.map((line) => (
                    <span key={line}>{line}</span>
                  ))}
                </h2>
                <p className="office-tab-intro__text">{exportIntro.description}</p>
              </section>
            ) : null}
            <ExportMap />
            <OfficeServices />
            <Clock />
            <Articles />
          </>
        ) : isInternationalTab ? (
          <TrackContent />
        ) : isExhibitionTab ? (
          <>
            <OfficeIntro
              titleId="office-exhibition-title"
              title={exhibition.title}
              accentText={exhibition.accentText}
              cardTitle={exhibition.cardTitle}
              cardText={exhibition.cardText}
            />
            <OfficeStatement
              titleId="office-exhibition-statement"
              lines={exhibition.statement}
              columns={exhibition.statementColumns}
            />
            <OfficeExpositions copy={exhibition.expositions} />
            <Info
              contentKey="office.exhibition"
              showOrgs={false}
              ctaTitleId="office-exhibition-cta"
              applyHref={exhibition.applyHref}
            />
          </>
        ) : isPartnershipTab ? (
          <>
            <OfficeIntro
              titleId="office-partnership-title"
              title={partnership.title}
              accentText={partnership.accentText}
              cardText={partnership.cardText}
              ctaLabel={partnership.cta}
              ctaHref={partnership.ctaHref}
            />
            <OfficePartnerPrograms copy={partnership.programs} />
            <OfficePartnerFormats copy={partnership.formats} />
            <Parnters
              titleKey="office.partnership.partners.title"
              description={partnership.partners.description}
            />
            <Articles />
          </>
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
