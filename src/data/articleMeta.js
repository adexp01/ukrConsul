/**
 * Ручні уточнення до статей, яких CRM не вміє.
 *
 * Тут три речі, і всі три — з правок клієнта по розділу «Медіа»:
 *
 * 1. **Кілька тегів на одну статтю.** У CRM у записа є єдине поле `category`,
 *    а клієнт розставляє по два-три теги («#GR #Analytics #Ecosystem»). Тому
 *    теги для таких релізів лежать тут, а `category` із CRM лишається як
 *    запас на випадок, коли статті тут немає.
 *
 * 2. **Звʼязок між мовами.** Українська й англійська версії одного релізу — це
 *    два окремі записи CRM із різними слагами. Через це перемикач мови на
 *    статті лишав ту саму адресу, і людина бачила англійський текст під
 *    `/ua/…`. Саме на це скаржився клієнт: «реліз українською не
 *    підтягується». Пари слагів нижче дають перемикачу куди переходити.
 *
 * 3. Теги проставляються на **обидві** версії релізу — картка однієї статті в
 *    різних мовах не може бути в різних категоріях.
 *
 * Як додати новий реліз: один рядок у RELEASES. Слаги видно в адресі статті.
 */

/**
 * Один рядок — один реліз, обидві його мовні версії.
 *
 * `uk` / `en` — слаги; якщо якоїсь версії ще немає, поле просто відсутнє.
 *
 * Порядок рядків — як у переліку клієнта («Коментарі до сайту Медіа»), тобто
 * від найновішого релізу до найстарішого. Англійські слаги проставлені там,
 * де пару вже знайдено; решта чекає на англомовний перелік.
 */
const RELEASES = [
  {
    // Локальна стаття з src/data/localNews.js — один запис на дві мови
    uk: "rada-zbroiariv-bezperervnist-oboronnykh-zakupivel",
    en: "rada-zbroiariv-bezperervnist-oboronnykh-zakupivel",
    tags: ["gr", "ecosystem"],
  },
  {
    // Англійської версії не буде: реліз прибрано з англомовного сайту
    // (див. `lang: "uk"` у localNews.js)
    uk: "korporatyvna-bezpeka-2026",
    tags: ["events"],
  },
  {
    uk: "rada-zbroiariv-zapuskaie-viiskovyi-tr",
    tags: ["ecosystem"],
  },
  {
    uk: "2-associations-joined-ucdi",
    tags: ["ecosystem"],
  },
  {
    uk: "white-paper-gr-ukr",
    tags: ["gr", "analytics"],
  },
  {
    uk: "1-year-results-ukr",
    tags: ["gr", "analytics", "export", "ecosystem", "events"],
  },
  {
    uk: "bwu-24-2-2026",
    tags: ["international"],
  },
  {
    uk: "three-bwu-signings-ukr",
    tags: ["international"],
  },
  {
    uk: "export-difference",
    en: "three-different-models-of-cooperation-with-ukraines-defence-industry",
    tags: ["international", "buildwithukraine"],
  },
  {
    uk: "defence-city-launched",
    en: "defence-city-officially-launched",
    tags: ["gr", "export"],
  },
  {
    uk: "ucdi-investor-club-ukr",
    en: "investments-in-ukrainian-defence-tech-exceeded-100-million-in-2025-ucdi",
    tags: ["investments"],
  },
  {
    uk: "export-map-ukr",
    en: "ukrainian-council-of-defence-industry-unveils-the-first-export-map",
    tags: ["gr", "export", "buildwithukraine"],
  },
  {
    uk: "pomizh-zbroiariv-suchasni-vyklyky-dlia-ob",
    tags: ["gr"],
  },
  {
    uk: "practica",
    tags: ["international", "buildwithukraine"],
  },
  {
    uk: "dfnc-investor-day-poshuk-shliakhiv-masshtabuvannia-ukra",
    tags: ["international", "events"],
  },
  {
    uk: "u-mezhakh-tretoho-mizhnarodnoho-forumu",
    tags: ["international", "events"],
  },
  {
    uk: "94-ukrainskykh-vyrobnykiv-hotovi-do-eks",
    tags: ["export", "events"],
  },
  {
    uk: "ucdi-at-mspo-2025",
    tags: ["zbroyaexpo", "events", "international"],
  },
  {
    uk: "zbroya-na-dalo-industry-days-daniia-pohlybliuie-oboronne-part",
    tags: ["zbroyaexpo", "events", "international"],
  },
  {
    uk: "ukrainska-rada-zbroiariv-razom-z-ukra",
    tags: ["analytics"],
  },
  {
    uk: "defence-city-explainer",
    tags: ["gr"],
  },
  {
    uk: "armada-ukr",
    tags: ["ecosystem"],
  },
  {
    uk: "providna-amerykanska-tekhnolohichna",
    en: "axon-the-leading-u-s-based-technology-company-met-with-ukrainian-innovators-and",
    tags: ["international"],
  },
  {
    uk: "frantsuzka-oboronna-promyslovist-p",
    tags: ["international", "ecosystem"],
  },
  {
    uk: "regions-lviv",
    tags: ["gr", "events"],
  },
  {
    uk: "ukrainska-rada-oboronnoi-promyslov",
    tags: ["international", "events", "zbroyaexpo", "ecosystem"],
  },
  {
    uk: "nimechchyna-stratehichnyi-partner-ukr",
    tags: ["international", "ecosystem"],
  },
  {
    uk: "rada-zbroiariv-na-kiel-munition-clearance-week-2025",
    tags: ["international", "events"],
  },
  {
    uk: "biznes-shkola-mim-ta-ukrainska-rada-zb",
    tags: ["ecosystem"],
  },
  {
    uk: "v-ukraini-vidkryto-ukrainian-training-and-testing-complex-uttc",
    tags: ["events"],
  },
  {
    uk: "brytanska-oboronna-promyslovist-p",
    tags: ["events", "ecosystem"],
  },
  {
    uk: "rehiony-oborony-rada-zbroiariv-zustri",
    tags: ["events", "ecosystem"],
  },
  {
    uk: "ukrainska-rada-zbroiariv-stala-efekt",
    en: "ucdi-effective-platform-for-direct-dialogue",
    tags: ["gr"],
  },
  {
    uk: "why-relocate",
    tags: ["international"],
  },
  {
    uk: "codified-but-not-procured",
    en: "codified-but-not-procured-ugv",
    tags: ["gr"],
  },
  {
    uk: "ukrainska-rada-zbroiariv-oholosyla-rozminuvannia-odnym-iz-priorytetnykh",
    en: "ukrainian-council-of-defence-industry-has-declared-demining-as-one-of-its",
    tags: ["gr", "analytics", "ecosystem"],
  },
  {
    uk: "ucdi-in-nv",
    en: "ucdi-in-nv-en",
    tags: ["ecosystem"],
  },
  {
    uk: "ucdi-in-forbes",
    en: "ucdi-in-forbes-en",
    tags: ["ecosystem"],
  },
  {
    uk: "v-ukraini-zapustyly-radu-zbroiariv",
    en: "ukrainian-defence-manufacturers-council-launched-in-ukraine",
    tags: ["ecosystem"],
  },

  /*
   * Нижче — те, чого в переліку клієнта немає: тег лишається той, що вже був.
   */
  {
    uk: "ukrainski-banky-prezentuvaly-pilhovi-umovy-kredytuvannia-dlia-vyrobnykiv",
    en: "ukrainian-banks-presented-preferential-lending-terms-for-arms-manufacturers",
    tags: ["investments"],
  },
  {
    // Української версії на сайті немає — клієнт перевіряє, чи вона загубилась
    en: "ucdi-launches-a-series-of-working-meetings-between-defense-industry-producers",
    tags: ["gr", "ecosystem"],
  },
  {
    // Української версії на сайті немає — клієнт перевіряє, чи вона загубилась
    en: "report-on-the-results-of-the-defence-industry-in-2024",
    tags: ["analytics"],
  },
];

/**
 * Заголовки, які в CRM лишились старими.
 *
 * Клієнт просив замінити назву на сайті, а не чекати правки в базі. Ключ —
 * слаг статті, тому підміна діє лише на тій мовній версії, у якої цей слаг.
 * Коли заголовок виправлять у CRM, рядок звідси можна прибрати — сайт знову
 * показуватиме те, що віддає база.
 */
const TITLE_OVERRIDES = new Map([
  [
    "ukrainska-rada-oboronnoi-promyslov",
    "Українська рада зброярів на URC 2025: основні результати та подальші кроки",
  ],
]);

const buildTagIndex = () => {
  const index = new Map();

  RELEASES.forEach((release) => {
    ["uk", "en"].forEach((lang) => {
      if (release[lang]) index.set(release[lang], release.tags);
    });
  });

  return index;
};

const buildPairIndex = () => {
  const index = new Map();

  RELEASES.forEach((release) => {
    ["uk", "en"].forEach((lang) => {
      if (release[lang]) index.set(release[lang], release);
    });
  });

  return index;
};

const TAGS_BY_SLUG = buildTagIndex();
const PAIR_BY_SLUG = buildPairIndex();

/**
 * Теги статті: спершу з таблиці вище, інакше — єдина категорія з CRM.
 *
 * Завжди масив, навіть коли тег один: так фільтр у стрічці не мусить
 * розрізняти два випадки.
 */
export const resolveArticleTags = (item) => {
  const bySlug = item?.slug ? TAGS_BY_SLUG.get(item.slug) : null;
  if (bySlug?.length) return bySlug;

  // Локальні статті можуть задавати теги прямо в записі
  if (Array.isArray(item?.tags) && item.tags.length) return item.tags;

  return item?.category ? [item.category] : [];
};

/**
 * Слаг тієї самої статті в іншій мові. Немає пари — повертається null, і
 * перемикач мови просто лишає адресу як є.
 */
export const resolveArticleSlugForLanguage = (slug, language) => {
  const release = PAIR_BY_SLUG.get(slug);
  if (!release) return null;

  const target = release[language];
  return target && target !== slug ? target : null;
};

/**
 * Заголовок статті з урахуванням підміни. Немає підміни — той, що прийшов
 * із CRM.
 */
export const resolveArticleTitle = (item) =>
  (item?.slug ? TITLE_OVERRIDES.get(item.slug) : null) ?? item?.title;
