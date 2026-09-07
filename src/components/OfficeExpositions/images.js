/*
 * Знімки експозицій. У локалі лежить лише текст, а картинки — тут, як і в
 * інших блоках із фото (див. EcoSystem/memberImages.js): збірник хешує файли
 * й підставляє готові адреси, тому в локалі не буває шляхів, які тихо
 * ламаються після перейменування ассета.
 *
 * `main` — великий знімок у рамці, `thumb` — маленьке «вушко» ліворуч угорі.
 * Немає ключа для експозиції — блок просто лишається без фото.
 */
import dalo2025 from "../../assets/dalo-2025.webp";
import dalo2025Thumb from "../../assets/dalo-2025-thumb.webp";

export const EXPOSITION_IMAGES = {
  "dalo-2025": { main: dalo2025, thumb: dalo2025Thumb },
};

export const getExpositionImages = (item) =>
  EXPOSITION_IMAGES[item?.id] ?? { main: item?.image, thumb: undefined };
