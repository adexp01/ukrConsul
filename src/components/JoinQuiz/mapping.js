/*
 * Маршрутизація тесту «Долучитися».
 *
 * Ідея тесту — розвести людей по асоціаціях, тому на саму Раду не веде жоден
 * результат: якщо профіль неочевидний, це «Оборонний альянс України».
 *
 * Крок «на якому ви етапі» на маршрут не впливає — він потрібен команді для
 * розуміння контексту. Асоціацію визначають профіль і, для виробників,
 * напрям продукції.
 */

export const FORMS = {
  // Анкета для виробників і партнерів — дві мовні версії однієї форми
  manufacturers: {
    uk: "https://forms.cloud.microsoft/e/1VAMSnPTx6",
    en: "https://forms.cloud.microsoft/Pages/ResponsePage.aspx?id=2Nut6FpvHUy8VXfKXJzrZSw3IsbUBcFNjK9tBkyFmvFUQTM0QVJUVkwwN0Q0M1JIU08zT1k0UzJERi4u",
  },
  investor: "https://forms.cloud.microsoft/e/xejc8pjtgy",
  international: "https://forms.cloud.microsoft/e/kQmZ1epT6V",
  media: "https://forms.cloud.microsoft/e/2vXp8Fi1rU",
};

export const CONTACT_EMAIL = "official@ucdi.org.ua";

/** Профілі першого кроку */
export const PROFILE_IDS = [
  "manufacturer",
  "investor",
  "uavSchool",
  "techTeam",
  "association",
  "media",
];

/** Другий крок — тільки для виробників */
export const PRODUCT_IDS = [
  "uav",
  "naval",
  "ground",
  "ew",
  "armour",
  "weapons",
  "optics",
  "software",
  "components",
  "demining",
  "other",
];

export const STAGE_IDS = ["startup", "operating", "scaling", "international"];

/** Кому показуємо крок про напрям продукції */
export const PROFILES_WITH_PRODUCT = ["manufacturer"];

/** Кому питання про етап не пасує */
export const PROFILES_WITHOUT_STAGE = ["media"];

/*
 * Асоціація за відповідями. Ключ для виробників — `manufacturer:<напрям>`,
 * для решти профілів — сам профіль. Розписано клітинка за клітинкою, щоб
 * будь-який напрям можна було перекинути в іншу асоціацію одним рядком.
 */
export const RESULT_BY_ANSWER = {
  "manufacturer:uav": "defenceAlliance",
  "manufacturer:naval": "navalDrones",
  "manufacturer:ground": "roboticForces",
  "manufacturer:ew": "radioelectronic",
  "manufacturer:armour": "league",
  "manufacturer:weapons": "defenceAlliance",
  "manufacturer:optics": "radioelectronic",
  "manufacturer:software": "defenceAlliance",
  "manufacturer:components": "league",
  "manufacturer:demining": "defenceAlliance",
  "manufacturer:other": "defenceAlliance",

  investor: "investorClub",
  uavSchool: "uavSchools",
  techTeam: "defenceAlliance",
  association: "defenceAlliance",
  media: "media",
};

/** Форма й адреса для кожної асоціації */
export const RESULT_TARGETS = {
  defenceAlliance: { form: "manufacturers", email: CONTACT_EMAIL },
  navalDrones: { form: "manufacturers", email: CONTACT_EMAIL },
  roboticForces: { form: "manufacturers", email: CONTACT_EMAIL },
  radioelectronic: { form: "manufacturers", email: CONTACT_EMAIL },
  league: { form: "manufacturers", email: CONTACT_EMAIL },
  uavSchools: { form: "manufacturers", email: CONTACT_EMAIL },
  investorClub: { form: "investor", email: CONTACT_EMAIL },
  media: { form: "media", email: CONTACT_EMAIL },
};

const FALLBACK_RESULT = "defenceAlliance";

export const resolveResultId = (profileId, productId) => {
  if (!profileId) return FALLBACK_RESULT;

  if (PROFILES_WITH_PRODUCT.includes(profileId)) {
    return RESULT_BY_ANSWER[`${profileId}:${productId}`] ?? FALLBACK_RESULT;
  }

  return RESULT_BY_ANSWER[profileId] ?? FALLBACK_RESULT;
};

export const resolveFormHref = (resultId, language) => {
  const target = RESULT_TARGETS[resultId] ?? RESULT_TARGETS[FALLBACK_RESULT];
  const form = FORMS[target.form];
  if (typeof form === "string") return form;
  return form[language] ?? form.uk;
};

export const resolveEmail = (resultId) =>
  (RESULT_TARGETS[resultId] ?? RESULT_TARGETS[FALLBACK_RESULT]).email;

/**
 * Пряме посилання на форму за її ключем — для блоків, де тест не потрібен
 * і людина вже сама сказала, хто вона (наприклад «Формати участі»).
 */
export const resolveFormByKey = (formKey, language) => {
  const form = FORMS[formKey] ?? FORMS.manufacturers;
  if (typeof form === "string") return form;
  return form[language] ?? form.uk;
};
