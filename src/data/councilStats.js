/*
 * Цифри Ради в одному місці: блок статистики на головній (`AboutUs`) і
 * перший екран «Про нас» (`AboutUsBanner`) показують ті самі числа, і два
 * списки літералів у різних компонентах розійшлися б при першому ж оновленні.
 *
 * Підписи не тут, а в локалях (`aboutUs.main.description` і
 * `aboutUs.satellites.<id>.description`) — тому в записі лежить лише `id`,
 * з якого збирається ключ перекладу.
 */

export const MAIN_STAT = { id: "companies", value: "400+" };

export const SATELLITE_STATS = [
  { id: "manufacturers", value: "360+", position: "top-left" },
  { id: "schools", value: "28", position: "bottom-left" },
  { id: "funds", value: "20", position: "bottom-right" },
];

/** Усі чотири підряд — для смужки цифр на першому екрані «Про нас» */
export const COUNCIL_STATS = [MAIN_STAT, ...SATELLITE_STATS];

/**
 * «400+» → { number: "400", suffix: "+" }: у смужці плюс іде акцентним
 * кольором, тому його треба відділити від числа.
 */
export const splitStatValue = (value) => {
  const match = /^(\d+)(\D*)$/.exec(value);
  return match ? { number: match[1], suffix: match[2] } : { number: value, suffix: "" };
};
