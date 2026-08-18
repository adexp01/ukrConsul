import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import "./style.css";

/*
 * Службова сторінка порівняння «до / після».
 *
 * Ліворуч — знімок сайту на комміті ec9408c (12.07.2026, останній перед
 * серією правок), зібраний окремо й покладений у `public/legacy/`.
 * Праворуч — поточний сайт. Обидва відкриваються в iframe з одного домену,
 * тому скрол можна синхронізувати напряму, без postMessage.
 *
 * Сторінки немає ні в меню, ні в мапі сайту; robots.txt закриває і
 * `/internal/`, і `/legacy/`.
 */

const LEGACY_BASE = "/legacy";

const BASE_COMMIT = {
  sha: "ec9408c",
  date: "12.07.2026",
  url: "https://github.com/adexp01/ukrConsul/commit/ec9408cc5d1f71ddad4f9c862f47080eba062d52",
};

const PAGES = [
  { path: "", label: "Головна" },
  { path: "about-us", label: "Про нас" },
  { path: "office", label: "Діяльність" },
  { path: "track", label: "Міжнародний трек" },
  { path: "media", label: "Медіа" },
  { path: "join", label: "Долучитися" },
  { path: "privacy-policy", label: "Політика" },
];

const DEVICES = [
  { key: "desktop", label: "Десктоп", width: 1440, height: 900 },
  { key: "laptop", label: "Ноутбук", width: 1280, height: 800 },
  { key: "tablet", label: "Планшет", width: 834, height: 1112 },
  { key: "mobile", label: "Мобільний", width: 390, height: 844 },
];

const MODES = [
  { key: "split", label: "Пліч-о-пліч" },
  { key: "curtain", label: "Шторка" },
  { key: "old", label: "Тільки стара" },
  { key: "new", label: "Тільки нова" },
];

/** Факти, зняті з репозиторію, а не з ока. */
const FACTS = [
  { label: "Кадри анімації щита", before: "541 PNG · 104 МБ", after: "180 webp · 8,3 МБ" },
  { label: "Шрифт у першому малюванні", before: "216 КБ, 4 ваги повністю", after: "87 КБ, підмножина + preload" },
  { label: "Мета-теги й OG", before: "немає", after: "пререндер на кожен маршрут × локаль" },
  { label: "Логотип UA в шапці", before: "растр 141×39, розтягнутий", after: "вектор 507×96" },
  { label: "CTA заявок", before: "mailto:", after: "поп-ап із тестом на два кроки" },
];

const buildUrl = (base, locale, path) => {
  const suffix = path ? `/${path}` : "";
  return `${base}/${locale}${suffix}`;
};

export const ComparePage = () => {
  const [pageIndex, setPageIndex] = useState(0);
  const [device, setDevice] = useState("desktop");
  const [locale, setLocale] = useState("ua");
  const [mode, setMode] = useState("split");
  const [sync, setSync] = useState(true);
  const [curtain, setCurtain] = useState(50);
  const [dragging, setDragging] = useState(false);
  const [showFacts, setShowFacts] = useState(false);

  const stageRef = useRef(null);
  const oldRef = useRef(null);
  const newRef = useRef(null);
  const echo = useRef(false);

  const page = PAGES[pageIndex];
  const size = DEVICES.find((item) => item.key === device) ?? DEVICES[0];

  const oldSrc = useMemo(
    () => buildUrl(LEGACY_BASE, locale, page.path),
    [locale, page.path],
  );
  const newSrc = useMemo(() => buildUrl("", locale, page.path), [locale, page.path]);

  /* Сторінку не індексуємо і не даємо їй лишити свої теги в <head>. */
  useEffect(() => {
    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex, nofollow";
    document.head.append(meta);
    const previousTitle = document.title;
    document.title = "До / після — службове порівняння";

    return () => {
      meta.remove();
      document.title = previousTitle;
    };
  }, []);

  /*
   * Масштаб: логічна ширина макета вписується в те, що лишилось на екрані.
   * У режимі «пліч-о-пліч» кожному кадру дістається половина сцени.
   */
  const [stage, setStage] = useState({ width: 0, height: 0 });
  useEffect(() => {
    const node = stageRef.current;
    if (!node) return undefined;

    const measure = (rect) => setStage({ width: rect.width, height: rect.height });
    const observer = new ResizeObserver(([entry]) => measure(entry.contentRect));
    observer.observe(node);
    measure(node.getBoundingClientRect());

    return () => observer.disconnect();
  }, []);

  const columns = mode === "split" ? 2 : 1;
  const gap = mode === "split" ? 16 : 0;
  /*
   * Кадр лишається рівно того розміру, який заявлено пристроєм, — інакше
   * порівнювали б не ту верстку: перший екран у обох версіях прив'язаний до
   * висоти вікна. Тому вписуємо кадр цілком: і по ширині, і по висоті.
   * CAPTION — смужка з підписом над кадром.
   */
  const CAPTION = 26;
  const availableW = Math.max(0, (stage.width - gap * (columns - 1)) / columns);
  const availableH = Math.max(0, stage.height - CAPTION - 2);
  const scale =
    availableW > 0 && availableH > 0
      ? Math.min(1, availableW / size.width, availableH / size.height)
      : 1;
  const frameHeight = size.height;

  /* Синхронний скрол: обидва документи свої, домен один — читаємо напряму. */
  const bindScroll = useCallback(
    (from, to) => {
      const source = from.current?.contentWindow;
      const target = to.current?.contentWindow;
      if (!source || !target) return undefined;

      const onScroll = () => {
        if (!sync || echo.current) return;
        echo.current = true;
        try {
          const sourceMax =
            source.document.documentElement.scrollHeight - source.innerHeight;
          const targetMax =
            target.document.documentElement.scrollHeight - target.innerHeight;
          const ratio = sourceMax > 0 ? source.scrollY / sourceMax : 0;
          target.scrollTo(0, ratio * Math.max(0, targetMax));
        } catch {
          /* Кадр ще не встиг завантажитись — наступна подія все одно прийде. */
        }
        requestAnimationFrame(() => {
          echo.current = false;
        });
      };

      source.addEventListener("scroll", onScroll, { passive: true });
      return () => source.removeEventListener("scroll", onScroll);
    },
    [sync],
  );

  const [ready, setReady] = useState(0);
  useEffect(() => {
    if (!sync) return undefined;
    const offOld = bindScroll(oldRef, newRef);
    const offNew = bindScroll(newRef, oldRef);
    return () => {
      offOld?.();
      offNew?.();
    };
  }, [bindScroll, sync, ready, mode, oldSrc, newSrc]);

  /* Тягнемо шторку. Поки тягнемо — кадри не мають перехоплювати мишу. */
  useEffect(() => {
    if (!dragging) return undefined;

    const onMove = (event) => {
      const node = stageRef.current;
      if (!node) return;
      const rect = node.getBoundingClientRect();
      const x = (event.touches ? event.touches[0].clientX : event.clientX) - rect.left;
      setCurtain(Math.min(100, Math.max(0, (x / rect.width) * 100)));
    };
    const onUp = () => setDragging(false);

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, [dragging]);

  const frameStyle = {
    width: size.width,
    height: frameHeight,
    transform: `scale(${scale})`,
  };
  const boxStyle = {
    width: Math.round(size.width * scale),
    height: Math.round(frameHeight * scale) + CAPTION,
  };

  /*
   * У режимі шторки підписи над кадрами не потрібні: верхній шар обрізаний,
   * і його смужка з'їдала б підпис нижнього. Там підписуємо кути.
   */
  const withCaption = mode !== "curtain";

  const renderFrame = (which) => {
    const isOld = which === "old";
    return (
      <div className={`cmp__box cmp__box--${which}`} style={boxStyle}>
        {withCaption ? (
          <div className={`cmp__caption cmp__caption--${which}`}>
            <span className="cmp__dot" />
            {isOld
              ? `До · ${BASE_COMMIT.sha} · ${BASE_COMMIT.date}`
              : "Після · поточний main"}
          </div>
        ) : null}
        <iframe
          ref={isOld ? oldRef : newRef}
          className="cmp__frame"
          style={frameStyle}
          src={isOld ? oldSrc : newSrc}
          title={isOld ? "Стара версія" : "Поточна версія"}
          onLoad={() => setReady((value) => value + 1)}
        />
      </div>
    );
  };

  return (
    <div className="cmp" data-reveal="off" data-reveal-elements="off">
      <header className="cmp__bar">
        <div className="cmp__brand">
          <span className="cmp__brandTitle">До / після</span>
          <a
            className="cmp__brandMeta"
            href={BASE_COMMIT.url}
            target="_blank"
            rel="noreferrer"
          >
            база: {BASE_COMMIT.sha} · {BASE_COMMIT.date}
          </a>
        </div>

        <div className="cmp__group">
          {MODES.map((item) => (
            <button
              key={item.key}
              type="button"
              className={`cmp__chip${mode === item.key ? " is-active" : ""}`}
              onClick={() => setMode(item.key)}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="cmp__group">
          {DEVICES.map((item) => (
            <button
              key={item.key}
              type="button"
              className={`cmp__chip${device === item.key ? " is-active" : ""}`}
              onClick={() => setDevice(item.key)}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="cmp__group">
          {["ua", "en"].map((item) => (
            <button
              key={item}
              type="button"
              className={`cmp__chip${locale === item ? " is-active" : ""}`}
              onClick={() => setLocale(item)}
            >
              {item.toUpperCase()}
            </button>
          ))}
        </div>

        <label className="cmp__toggle">
          <input
            type="checkbox"
            checked={sync}
            onChange={(event) => setSync(event.target.checked)}
          />
          Спільний скрол
        </label>

        <button
          type="button"
          className={`cmp__chip cmp__chip--wide${showFacts ? " is-active" : ""}`}
          onClick={() => setShowFacts((value) => !value)}
        >
          Цифри
        </button>
      </header>

      <nav className="cmp__pages">
        {PAGES.map((item, index) => (
          <button
            key={item.path || "home"}
            type="button"
            className={`cmp__page${pageIndex === index ? " is-active" : ""}`}
            onClick={() => setPageIndex(index)}
          >
            {item.label}
          </button>
        ))}
        <span className="cmp__scale">
          {size.width}×{size.height} · {Math.round(scale * 100)}%
        </span>
      </nav>

      {showFacts ? (
        <section className="cmp__facts">
          {FACTS.map((fact) => (
            <article key={fact.label} className="cmp__fact">
              <h3>{fact.label}</h3>
              <p className="cmp__factBefore">{fact.before}</p>
              <p className="cmp__factAfter">{fact.after}</p>
            </article>
          ))}
          <p className="cmp__note">
            Знімок стиснуто для ваги репозиторію: зображення до 1600 px, кадри
            щита переведені в webp. Верстка, стилі й поведінка — оригінальні,
            рівно як на {BASE_COMMIT.sha}.
          </p>
        </section>
      ) : null}

      <main
        ref={stageRef}
        className={`cmp__stage cmp__stage--${mode}${dragging ? " is-dragging" : ""}`}
      >
        {mode === "split" ? (
          <>
            {renderFrame("old")}
            {renderFrame("new")}
          </>
        ) : null}

        {mode === "old" ? renderFrame("old") : null}
        {mode === "new" ? renderFrame("new") : null}

        {mode === "curtain" ? (
          <div className="cmp__curtain" style={boxStyle}>
            <div className="cmp__layer">{renderFrame("new")}</div>
            <div
              className="cmp__layer cmp__layer--top"
              style={{ clipPath: `inset(0 ${100 - curtain}% 0 0)` }}
            >
              {renderFrame("old")}
            </div>
            <button
              type="button"
              aria-label="Пересунути шторку"
              className="cmp__handle"
              style={{ left: `${curtain}%` }}
              onPointerDown={() => setDragging(true)}
            >
              <span />
            </button>
            <span className="cmp__corner cmp__corner--old">
              До · {BASE_COMMIT.sha}
            </span>
            <span className="cmp__corner cmp__corner--new">
              Після · поточний main
            </span>
          </div>
        ) : null}

        {dragging ? <div className="cmp__shield" /> : null}
      </main>
    </div>
  );
};

export default ComparePage;
