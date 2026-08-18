/**
 * Пререндер мета-тегів після `vite build`.
 *
 * Сайт — SPA без SSR, а Telegram, Facebook, LinkedIn і X не виконують JS:
 * вони читають лише той HTML, який віддав сервер. Тому для кожного маршруту
 * і кожної локалі тут кладеться окремий статичний index.html з готовими
 * <title>, description, Open Graph, canonical і hreflang.
 *
 * Vercel перевіряє файлову систему до правил `rewrites`, тому
 * dist/ua/media/index.html віддається на /ua/media, а SPA-фолбек із
 * vercel.json лишається тільки для того, чого тут немає.
 *
 * Запускається з `npm run build`.
 */

import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import {
  LANGUAGES,
  LANGUAGE_TO_LOCALE,
  SITE_URL,
  STATIC_ROUTES,
} from "../src/seo/config.js";
import { buildPageMeta, renderMetaTags } from "../src/seo/buildMeta.js";
import { assignUniqueSlugs } from "../src/api/slug.js";
import { getNewsApiUrl, resolveAssetUrl } from "../src/api/config.js";
import { LOCAL_NEWS } from "../src/data/localNews.js";
import { en } from "../src/i18n/locales/en.js";
import { uk } from "../src/i18n/locales/uk.js";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const DIST = join(ROOT, "dist");

const DICTS = { en, uk };
const CRM_TIMEOUT_MS = 15000;

const log = (message) => console.log(`[seo] ${message}`);

/* ------------------------------------------------------------------ */
/* HTML                                                                */
/* ------------------------------------------------------------------ */

/**
 * Кладе теги в шаблон, зібраний Vite. Спочатку прибирає те, що вже було
 * в index.html (<title> і будь-які og/twitter/canonical), щоб не з'явилися
 * дублікати, коли шаблон колись доповнять вручну.
 */
const injectMeta = (template, meta) => {
  let html = template
    .replace(/\s*<title>[\s\S]*?<\/title>/i, "")
    .replace(
      /\s*<meta\s+(?:name|property)="(?:description|robots|og:[^"]+|twitter:[^"]+|article:[^"]+)"[^>]*>/gi,
      "",
    )
    .replace(/\s*<link\s+rel="canonical"[^>]*>/gi, "")
    .replace(/\s*<link\s+rel="alternate"\s+hreflang[^>]*>/gi, "");

  html = html.replace(/<html([^>]*)\slang="[^"]*"/i, "<html$1").replace(
    /<html([^>]*)>/i,
    `<html$1 lang="${meta.lang === "uk" ? "uk" : "en"}">`,
  );

  return html.replace("</head>", `${renderMetaTags(meta)}\n  </head>`);
};

const writePage = async (routePath, html) => {
  const clean = routePath.replace(/^\/+|\/+$/g, "");
  const target = clean
    ? join(DIST, clean, "index.html")
    : join(DIST, "index.html");

  await mkdir(dirname(target), { recursive: true });
  await writeFile(target, html, "utf8");
};

/* ------------------------------------------------------------------ */
/* Новини з CRM                                                        */
/* ------------------------------------------------------------------ */

const stripInlineMarkup = (value) =>
  String(value ?? "")
    .replace(/\[([^\]]+)\]\(https?:\/\/[^\s)]*\)/g, "$1")
    .replace(/\*{1,3}/g, "")
    .replace(/\s+/g, " ")
    .trim();

const excerptOf = (item) => {
  const block = item.blocks?.find(
    (b) => b.type === "text" && stripInlineMarkup(b.content),
  );
  return stripInlineMarkup(block?.content);
};

const fetchNews = async () => {
  const local = LOCAL_NEWS.filter((item) => item.published !== false);

  let remote = [];
  try {
    const response = await fetch(getNewsApiUrl(), {
      signal: AbortSignal.timeout(CRM_TIMEOUT_MS),
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const payload = await response.json();
    const list = Array.isArray(payload)
      ? payload
      : (payload?.data ?? payload?.news ?? []);

    remote = list.filter((item) => item.published !== false);
    log(`CRM: ${remote.length} статей`);
  } catch (error) {
    // Свідомо не валимо білд: без CRM статті просто отримають мета-теги
    // локалі за замовчуванням, а клієнтський useSeo підправить їх у браузері.
    log(`CRM недоступна (${error.message}) — статті без власних OG`);
  }

  const localIds = new Set(local.map((item) => String(item.id)));
  const merged = [
    ...local,
    ...remote.filter((item) => !localIds.has(String(item.id))),
  ];

  return assignUniqueSlugs(
    merged.sort(
      (a, b) => new Date(b.createdAt ?? 0) - new Date(a.createdAt ?? 0),
    ),
  );
};

/** Накладає переклад так само, як `localizeNewsItem` у застосунку. */
const localize = (item, language) => ({ ...item, ...(item.i18n?.[language] ?? {}) });

/* ------------------------------------------------------------------ */
/* Sitemap / robots                                                    */
/* ------------------------------------------------------------------ */

const buildSitemap = (entries) => {
  const urls = entries
    .map(({ loc, lastmod, alternates }) => {
      const links = alternates
        .map(
          ({ hreflang, href }) =>
            `    <xhtml:link rel="alternate" hreflang="${hreflang}" href="${href}" />`,
        )
        .join("\n");

      return [
        "  <url>",
        `    <loc>${loc}</loc>`,
        lastmod ? `    <lastmod>${lastmod}</lastmod>` : null,
        links,
        "  </url>",
      ]
        .filter(Boolean)
        .join("\n");
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls}
</urlset>
`;
};

/*
 * `/internal/` — службові сторінки (порівняння «до / після»),
 * `/legacy/` — знімок старої збірки, який там живе в iframe.
 * Обидва не є частиною сайту й не мають потрапляти в пошук.
 */
const ROBOTS = `User-agent: *
Allow: /
Disallow: /internal/
Disallow: /legacy/

Sitemap: ${SITE_URL}/sitemap.xml
`;

/* ------------------------------------------------------------------ */

const main = async () => {
  const template = await readFile(join(DIST, "index.html"), "utf8");

  const sitemap = [];
  let pages = 0;

  const emit = async (routeKey, path, language, overrides = {}) => {
    const meta = buildPageMeta({ routeKey, language, path, overrides });
    const locale = LANGUAGE_TO_LOCALE[language];
    const routePath = path ? `${locale}/${path}` : locale;

    await writePage(routePath, injectMeta(template, meta));
    pages += 1;

    if (!meta.noindex && language === "en") {
      sitemap.push({
        loc: meta.canonical,
        lastmod: overrides.publishedTime?.slice(0, 10),
        alternates: meta.alternates,
      });
    }
  };

  /* Статичні сторінки */
  for (const language of LANGUAGES) {
    for (const route of STATIC_ROUTES) {
      await emit(route.key, route.path, language);
    }
  }

  /* Сторінки подій — беруться зі словників локалей */
  const eventIds = new Set(
    LANGUAGES.flatMap((language) =>
      Object.keys(DICTS[language]?.eventDetails ?? {}),
    ),
  );

  for (const language of LANGUAGES) {
    const events = DICTS[language]?.eventDetails ?? {};

    for (const id of eventIds) {
      const event = events[id];

      await emit("eventDetail", `events/details/${id}`, language, {
        title: event
          ? `${event.breadcrumbGroup} | ${event.breadcrumbTitle}`
          : undefined,
        description: event
          ? [event.time, Array.isArray(event.body) ? event.body[0] : event.body]
              .filter(Boolean)
              .join(". ")
          : undefined,
        type: "article",
      });
    }
  }

  /* Статті */
  const news = await fetchNews();

  for (const language of LANGUAGES) {
    for (const raw of news) {
      const item = localize(raw, language);

      // Стаття, позначена іншою мовою, все одно має відкриватись за прямим
      // посиланням — сторінка створюється в обох локалях.
      await emit("article", `article/${raw.slug}`, language, {
        title: item.title,
        description: excerptOf(item) || undefined,
        image: item.mainImage ? resolveAssetUrl(item.mainImage) : undefined,
        imageAlt: item.title,
        type: "article",
        publishedTime: item.createdAt,
      });
    }
  }

  /* Корінь: / редіректить на /en, але боти читають саме цей файл */
  await writeFile(
    join(DIST, "index.html"),
    injectMeta(template, buildPageMeta({ routeKey: "home", language: "en" })),
    "utf8",
  );

  await writeFile(join(DIST, "sitemap.xml"), buildSitemap(sitemap), "utf8");
  await writeFile(join(DIST, "robots.txt"), ROBOTS, "utf8");

  log(`готово: ${pages} сторінок, sitemap на ${sitemap.length} URL`);
};

main().catch((error) => {
  console.error("[seo] пререндер впав:", error);
  process.exit(1);
});
