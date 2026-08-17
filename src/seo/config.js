/**
 * Єдине джерело правди для SEO / Open Graph.
 *
 * Цей файл імпортують і застосунок (клієнтський хук `useSeo`), і скрипт
 * пререндеру `scripts/prerender-seo.mjs`, який запускається після `vite build`.
 * Тому тут — тільки чистий JS: без JSX, без імпортів ассетів, без React.
 */

export const SITE_URL = "https://www.ucdi.org.ua";

/** Мова → префікс у URL. Дублює i18n/localeRoutes, щоб файл лишався автономним. */
export const LANGUAGE_TO_LOCALE = { en: "en", uk: "ua" };
export const LOCALE_TO_LANGUAGE = { en: "en", ua: "uk" };
export const LANGUAGES = ["en", "uk"];
export const DEFAULT_LANGUAGE = "en";

/** `og:locale` очікує формат ll_CC. */
export const OG_LOCALE = { en: "en_GB", uk: "uk_UA" };

export const SITE_NAME = {
  en: "Ukrainian Council of Defence Industry",
  uk: "Українська рада зброярів",
};

/** Короткий суфікс у <title> для всіх сторінок, крім головної. */
export const TITLE_SUFFIX = {
  en: "UCDI",
  uk: "Рада зброярів",
};

/** OG-банер 1200×630 для кожної локалі. */
export const OG_IMAGE = {
  en: "/og/og-en.png",
  uk: "/og/og-uk.png",
};

export const OG_IMAGE_ALT = {
  en: "Ukrainian Council of Defence Industry",
  uk: "Українська рада зброярів",
};

export const OG_IMAGE_SIZE = { width: 1200, height: 630 };

/**
 * Маршрути, які пререндеряться як статичні HTML.
 * `path` — без префікса локалі; порожній рядок = головна.
 */
export const STATIC_ROUTES = [
  { key: "home", path: "" },
  { key: "aboutUs", path: "about-us" },
  { key: "office", path: "office" },
  { key: "track", path: "track" },
  { key: "media", path: "media" },
  { key: "events", path: "events" },
  { key: "join", path: "join" },
  { key: "privacyPolicy", path: "privacy-policy" },
];

/**
 * Title і description для кожної сторінки в обох локалях.
 *
 * Орієнтир: title до ~60 символів, description 140–160.
 * Суфікс бренду додається автоматично в `buildPageMeta`.
 */
export const PAGE_META = {
  home: {
    en: {
      title: "Ukrainian Council of Defence Industry",
      description:
        "UCDI unites Ukraine's private defence manufacturers and associations, representing the industry before the state, the military and international partners.",
      appendSuffix: false,
    },
    uk: {
      title: "Українська рада зброярів",
      description:
        "Обʼєднуємо асоціації галузі та приватних виробників озброєння, представляємо спільну позицію ОПК перед державою, військовими й міжнародними партнерами.",
      appendSuffix: false,
    },
  },

  aboutUs: {
    en: {
      title: "About us — Ukraine's largest private defence association",
      description:
        "The Council represents the industry's common position, helps manufacturers work with the state, the military and partners, and supports scaling abroad.",
    },
    uk: {
      title: "Про нас — найбільше обʼєднання приватного ОПК України",
      description:
        "Рада зброярів представляє спільну позицію галузі, допомагає виробникам взаємодіяти з державою, військовими та міжнародними партнерами, підтримує масштабування.",
    },
  },

  office: {
    en: {
      title: "Activities — advocacy, export, international and exhibitions",
      description:
        "GR and advocacy, the Export Support Office, international cooperation, exhibition activities and the partner ecosystem — how UCDI works for defence manufacturers.",
    },
    uk: {
      title: "Діяльність — GR, експорт, міжнародний і виставковий напрями",
      description:
        "GR та адвокація, Офіс підтримки експорту, міжнародна співпраця, виставкова діяльність і партнерська екосистема — напрями роботи Ради зброярів.",
    },
  },

  track: {
    en: {
      title: "International track — UCDI at global defence events",
      description:
        "We represent Council members at key international forums, conferences and industry meetings, and connect companies with relevant events through our partner network.",
    },
    uk: {
      title: "Міжнародний трек — представництво на подіях за кордоном",
      description:
        "Забезпечуємо представництво учасників Ради зброярів на ключових міжнародних форумах, конференціях і галузевих зустрічах та залучаємо компанії до подій партнерів.",
    },
  },

  media: {
    en: {
      title: "Media — news of Ukraine's defence industry",
      description:
        "News about Ukraine's defence industry, the Council's work, key decisions for the sector, international cooperation and projects that help manufacturers scale.",
    },
    uk: {
      title: "Медіа — новини українського ОПК",
      description:
        "Новини про українську оборонну промисловість, діяльність Ради зброярів, ключові рішення для сектору, міжнародну співпрацю та проєкти для виробників.",
    },
  },

  events: {
    en: {
      title: "Events — forums, meetups and industry gatherings",
      description:
        "Upcoming Council events: industry meetups, forums and conferences for Ukraine's defence manufacturers, partners, investors and international guests.",
    },
    uk: {
      title: "Заходи — форуми, мітапи та галузеві зустрічі",
      description:
        "Найближчі події Ради зброярів: галузеві мітапи, форуми й конференції для українських виробників ОПК, партнерів, інвесторів і міжнародних гостей.",
    },
  },

  join: {
    en: {
      title: "Join — Ukraine's largest defence industry community",
      description:
        "UCDI unites associations, manufacturers, investors, educational initiatives and partners. Take a short test and find the association that suits you best.",
    },
    uk: {
      title: "Долучитися — найбільша спільнота українського ОПК",
      description:
        "Рада зброярів обʼєднує асоціації, виробників, інвесторів, освітні ініціативи та партнерів. Пройдіть короткий тест і дізнайтеся, яка спільнота вам підходить.",
    },
  },

  privacyPolicy: {
    en: {
      title: "Privacy policy",
      description:
        "How the Ukrainian Council of Defence Industry collects, uses, stores and protects personal data of ucdi.org.ua visitors.",
    },
    uk: {
      title: "Політика конфіденційності",
      description:
        "Як Українська рада зброярів збирає, використовує, зберігає та захищає персональні дані відвідувачів ucdi.org.ua.",
    },
  },

  /** Фолбек для /article/:id, поки стаття не завантажилась або не знайдена. */
  article: {
    en: {
      title: "News",
      description:
        "News about Ukraine's defence industry, the Council's work, key decisions for the sector and international cooperation.",
    },
    uk: {
      title: "Новини",
      description:
        "Новини про українську оборонну промисловість, діяльність Ради зброярів, ключові рішення для сектору та міжнародну співпрацю.",
    },
  },

  /** Фолбек для /events/details/:id. */
  eventDetail: {
    en: {
      title: "Event",
      description:
        "Details of an event by the Ukrainian Council of Defence Industry: programme, format, date and registration.",
    },
    uk: {
      title: "Захід",
      description:
        "Деталі заходу Української ради зброярів: програма, формат, дата та реєстрація.",
    },
  },

  notFound: {
    en: {
      title: "Page not found",
      description:
        "The requested page does not exist. Return to the Ukrainian Council of Defence Industry homepage.",
      noindex: true,
    },
    uk: {
      title: "Сторінку не знайдено",
      description:
        "Запитаної сторінки не існує. Поверніться на головну сторінку Української ради зброярів.",
      noindex: true,
    },
  },
};
