/*
 * Маршрутизація тесту «Долучитися».
 *
 * Форм п'ять: чотири різні анкети плюс окрема англомовна версія анкети для
 * виробників і партнерів — її підбираємо за мовою сайту.
 *
 * Таблиця RESULT_BY_ANSWER свідомо розписана повністю, клітинка за клітинкою:
 * так будь-яку пару «профіль + етап» можна перекинути на іншу форму, не
 * розбираючись у логіці. Ключ — `${profileId}:${stageId}`.
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

export const PROFILE_IDS = [
  "manufacturer",
  "investor",
  "uavSchool",
  "partner",
  "association",
  "media",
];

export const STAGE_IDS = ["startup", "operating", "scaling", "international"];

// Профілі, для яких питання про етап не має сенсу — одразу показуємо результат
export const PROFILES_WITHOUT_STAGE = ["media"];

/** Яка форма стоїть за кожним результатом */
export const RESULT_FORMS = {
  manufacturers: "manufacturers",
  investorClub: "investor",
  uavSchools: "manufacturers",
  partnership: "manufacturers",
  association: "manufacturers",
  internationalTrack: "international",
  media: "media",
};

export const RESULT_BY_ANSWER = {
  "manufacturer:startup": "manufacturers",
  "manufacturer:operating": "manufacturers",
  "manufacturer:scaling": "manufacturers",
  "manufacturer:international": "internationalTrack",

  "investor:startup": "investorClub",
  "investor:operating": "investorClub",
  "investor:scaling": "investorClub",
  "investor:international": "investorClub",

  "uavSchool:startup": "uavSchools",
  "uavSchool:operating": "uavSchools",
  "uavSchool:scaling": "uavSchools",
  "uavSchool:international": "internationalTrack",

  "partner:startup": "partnership",
  "partner:operating": "partnership",
  "partner:scaling": "partnership",
  "partner:international": "internationalTrack",

  "association:startup": "association",
  "association:operating": "association",
  "association:scaling": "association",
  "association:international": "internationalTrack",

  "media:none": "media",
};

export const resolveResultId = (profileId, stageId) =>
  RESULT_BY_ANSWER[`${profileId}:${stageId ?? "none"}`] ?? "manufacturers";

export const resolveFormHref = (resultId, language) => {
  const form = FORMS[RESULT_FORMS[resultId] ?? "manufacturers"];
  if (typeof form === "string") return form;
  return form[language] ?? form.uk;
};
