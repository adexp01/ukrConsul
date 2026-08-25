import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { gsap, ScrollTrigger } from "../../animation/gsapSetup";
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
import { useSeo } from "../../seo/useSeo";

const DEFAULT_TAB_ID = "export";
const TAB_PARAM = "tab";

/*
 * Вкладка живе в адресі: `/ua/office?tab=gr`. Без цього на GR-адвокацію й
 * міжнародну діяльність не було як послатися — ні з меню, ні зі сторонніх
 * матеріалів, ні закладкою.
 */
export const OfficePage = () => {
  useSeo("office", { path: "office" });

  const { t } = useLanguage();
  const heroCopy = t("office.hero");
  const tabs = heroCopy.tabs;
  const [searchParams, setSearchParams] = useSearchParams();

  const requestedTabId = searchParams.get(TAB_PARAM);
  const initialTabId = tabs.some((tab) => tab.id === requestedTabId)
    ? requestedTabId
    : DEFAULT_TAB_ID;

  const [activeTabId, setActiveTabId] = useState(initialTabId);
  // Підсвітка в смужці перемикається одразу, контент — після скролу
  const [selectedTabId, setSelectedTabId] = useState(initialTabId);
  const tabsRef = useRef(null);
  const scrollTweenRef = useRef(null);
  const needsFinalNudgeRef = useRef(false);

  /*
   * Зміну адреси відстежуємо й після монтування: у меню «Діяльність» пункти
   * ведуть на цю саму сторінку з іншим `?tab=`, і без цього клік по них
   * нічого б не змінив.
   *
   * Робимо це під час рендеру, а не ефектом: React радить саме так підганяти
   * стан під зміну вхідних даних — тоді результат видно вже в цьому проході,
   * без зайвого кадру зі старою вкладкою.
   */
  const [syncedTabId, setSyncedTabId] = useState(requestedTabId);

  if (requestedTabId !== syncedTabId) {
    setSyncedTabId(requestedTabId);

    // Могли самі щойно записати цей же параметр — тоді міняти нічого
    if (initialTabId !== activeTabId) {
      setActiveTabId(initialTabId);
      setSelectedTabId(initialTabId);
    }
  }

  /*
   * Ривок був не в анімації скролу, а в самій підміні контенту: секції
   * попередньої вкладки мають пін (циферблат) і власну висоту, і коли вони
   * зникають, ScrollTrigger сам переставляє позицію скролу на еквівалентну
   * в новій розкладці — миттєво, і жодна наша анімація цього не переб'є.
   *
   * Тому порядок зворотний: спершу плавно піднімаємось до смужки табів, і
   * тільки після цього міняємо контент. Якщо смужку вже видно — міняємо
   * одразу, нічого не рухаючи.
   */
  const handleTabClick = (id) => {
    if (id === selectedTabId) return;

    setSelectedTabId(id);

    const strip = tabsRef.current;
    const rect = strip?.getBoundingClientRect();
    const isStripVisible =
      rect && rect.top >= 0 && rect.bottom <= window.innerHeight;
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (!rect || isStripVisible) {
      setActiveTabId(id);
      return;
    }

    const target = Math.max(0, rect.top + window.scrollY - 24);

    if (prefersReducedMotion) {
      window.scrollTo(0, target);
      setActiveTabId(id);
      return;
    }

    scrollTweenRef.current?.kill();
    scrollTweenRef.current = gsap.to(window, {
      scrollTo: { y: target, autoKill: false },
      duration: 0.6,
      ease: "power2.inOut",
      overwrite: true,
      onComplete: () => {
        needsFinalNudgeRef.current = true;
        setActiveTabId(id);
      },
    });
  };

  useEffect(() => () => scrollTweenRef.current?.kill(), []);

  /*
   * Адресу оновлюємо тоді, коли змінився саме контент, а не підсвітка: поки
   * ми плавно їдемо до смужки табів, у полі зору ще стара вкладка.
   * `replace` — щоб перемикання табів не засмічувало кнопку «назад».
   */
  useEffect(() => {
    const current = searchParams.get(TAB_PARAM);
    if (current === activeTabId) return;
    if (!current && activeTabId === DEFAULT_TAB_ID) return;

    const next = new URLSearchParams(searchParams);
    next.set(TAB_PARAM, activeTabId);
    setSearchParams(next, { replace: true });
  }, [activeTabId, searchParams, setSearchParams]);

  /*
   * Вкладки підмінюють цілі секції, а разом з ними — висоту сторінки.
   * ScrollTrigger рахує свої позиції один раз при монтуванні, тож без
   * перерахунку анімації нижніх блоків (циферблат, фокус роботи) лишались
   * у стартовому стані: заголовки з autoAlpha 0 так і не проявлялись.
   *
   * Тут же добираємо залишок скролу: поки ми їхали вгору, пін циферблата
   * відпустився й розкладка трохи змістилась, тож смужка табів може стати
   * на кілька сотень пікселів вище, ніж була на початку руху.
   */
  useLayoutEffect(() => {
    let nudge = 0;

    const frame = requestAnimationFrame(() => {
      ScrollTrigger.refresh();

      if (!needsFinalNudgeRef.current) return;
      needsFinalNudgeRef.current = false;

      nudge = requestAnimationFrame(() => {
        const strip = tabsRef.current;
        if (!strip) return;

        const rect = strip.getBoundingClientRect();
        if (rect.top >= 0 && rect.bottom <= window.innerHeight) return;

        scrollTweenRef.current?.kill();
        scrollTweenRef.current = gsap.to(window, {
          scrollTo: {
            y: Math.max(0, rect.top + window.scrollY - 24),
            autoKill: false,
          },
          duration: 0.3,
          ease: "power2.out",
          overwrite: true,
        });
      });
    });

    return () => {
      cancelAnimationFrame(frame);
      if (nudge) cancelAnimationFrame(nudge);
    };
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

          {/*
            aria-selected має сенс лише на елементі з role="tab" всередині
            role="tablist" — раніше атрибут стояв на звичайній кнопці в <nav>,
            тобто був невалідним і скринрідер його ігнорував.
          */}
          <div
            ref={tabsRef}
            className="office-hero__tabs"
            role="tablist"
            aria-label={heroCopy.tabsLabel}
          >
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                role="tab"
                id={`office-tab-${tab.id}`}
                aria-controls="office-tab-panel"
                aria-selected={selectedTabId === tab.id}
                tabIndex={selectedTabId === tab.id ? 0 : -1}
                className={`office-hero__tab${
                  selectedTabId === tab.id ? " is-active" : ""
                }`}
                onClick={() => handleTabClick(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </section>

        {/* key на контейнері перезапускає плавну появу при зміні вкладки */}
        <div
          className="office-page__panel"
          key={activeTabId}
          id="office-tab-panel"
          role="tabpanel"
          aria-labelledby={`office-tab-${activeTabId}`}
        >
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
                  <h2
                    id="office-export-intro-title"
                    className="office-tab-intro__title"
                  >
                    {exportIntro.title.map((line) => (
                      <span key={line}>{line}</span>
                    ))}
                  </h2>
                  <p className="office-tab-intro__text">
                    {exportIntro.description}
                  </p>
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
              {/* Останні новини є на всіх інших вкладках — тут блок просто забули */}
              <Articles />
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
      </div>
    </PageLayout>
  );
};
