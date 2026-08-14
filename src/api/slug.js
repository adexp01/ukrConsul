/**
 * Генерація людських URL для статей.
 *
 * CRM віддає лише UUID (наприклад 3bec57d0-0cbf-46cc-a01d-e0de928497e6),
 * тому слаг збирається із заголовка за офіційною українською транслітерацією
 * (постанова КМУ №55). Якщо в записі є власне поле `slug` — беремо його.
 */

// Базова таблиця: літера → латиниця в середині слова
const MAP = {
  а: "a", б: "b", в: "v", г: "h", ґ: "g", д: "d", е: "e", є: "ie",
  ж: "zh", з: "z", и: "y", і: "i", ї: "i", й: "i", к: "k", л: "l",
  м: "m", н: "n", о: "o", п: "p", р: "r", с: "s", т: "t", у: "u",
  ф: "f", х: "kh", ц: "ts", ч: "ch", ш: "sh", щ: "shch", ь: "",
  ю: "iu", я: "ia", "'": "", "’": "", ʼ: "",
  // трапляються в текстах, скопійованих із російської розкладки
  ё: "e", ъ: "", ы: "y", э: "e",
};

// На початку слова частина літер читається інакше
const MAP_WORD_START = {
  є: "ye", ї: "yi", й: "y", ю: "yu", я: "ya",
};

const isLetter = (char) => /[a-zа-яґєіїё0-9]/i.test(char);

const MAX_LENGTH = 80;

export const slugify = (value) => {
  const source = String(value ?? "").toLowerCase();
  let out = "";

  for (let i = 0; i < source.length; i += 1) {
    const char = source[i];
    const prev = i > 0 ? source[i - 1] : "";
    const atWordStart = i === 0 || !isLetter(prev);

    if (atWordStart && MAP_WORD_START[char] !== undefined) {
      out += MAP_WORD_START[char];
    } else if (MAP[char] !== undefined) {
      out += MAP[char];
    } else {
      out += char;
    }
  }

  const cleaned = out.replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

  if (cleaned.length <= MAX_LENGTH) return cleaned;

  // Обрізаємо по межі слова, щоб слаг не закінчувався половиною слова
  const cut = cleaned.slice(0, MAX_LENGTH);
  const lastDash = cut.lastIndexOf("-");

  return (lastDash > 0 ? cut.slice(0, lastDash) : cut).replace(/-+$/g, "");
};

/**
 * Проставляє кожному запису унікальний `slug`.
 *
 * Пріоритет: власне поле slug → слаг із заголовка → id.
 * Якщо два записи дають однаковий слаг, обидва отримують суфікс із власного id,
 * щоб посилання не «переїжджали» при появі нових статей.
 */
export const assignUniqueSlugs = (items) => {
  const baseOf = (item) => {
    const own = typeof item.slug === "string" ? item.slug.trim() : "";
    return own || slugify(item.title) || String(item.id);
  };

  const counts = new Map();
  items.forEach((item) => {
    const base = baseOf(item);
    counts.set(base, (counts.get(base) ?? 0) + 1);
  });

  return items.map((item) => {
    const base = baseOf(item);

    if (counts.get(base) === 1) return { ...item, slug: base };

    const suffix = String(item.id).replace(/[^a-z0-9]/gi, "").slice(0, 6).toLowerCase();
    return { ...item, slug: suffix ? `${base}-${suffix}` : base };
  });
};
