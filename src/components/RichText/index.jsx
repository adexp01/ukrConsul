/**
 * Мінімальний інлайн-рендер для тексту статей.
 *
 * Імпорт зі старого WordPress зберігає акценти в markdown-стилі, бо блоки
 * в CRM — це звичайні рядки. Тут вони перетворюються назад на розмітку:
 *
 *   **жирний**            → <strong>
 *   *курсив*              → <em>
 *   ***жирний курсив***   → <strong><em>
 *   [текст](https://…)    → <a>
 *
 * Порядок важливий: спершу акценти, потім посилання всередині них.
 * Інакше `**[текст](url)**` розпадається і зірочки лишаються видимими.
 *
 * Навмисно без повноцінного markdown: заголовки, списки й картинки — це
 * окремі типи блоків, парсити їх тут не потрібно.
 */

// ***жирний курсив*** | **жирний** | *курсив*
// Вміст курсиву не може починатись чи закінчуватись пробілом — інакше
// «5 * 3 і 2 * 2» перетворюється на курсив, як у стандартному markdown.
const EMPHASIS =
  /\*\*\*([\s\S]+?)\*\*\*|\*\*([\s\S]+?)\*\*|\*([^\s*][^*\n]*?[^\s*]|[^\s*])\*/g;
const LINK = /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g;

let uid = 0;
const nextKey = (prefix) => `${prefix}${(uid += 1)}`;

/** Текст → вузли з посиланнями, без акцентів */
function withLinks(input) {
  const source = String(input ?? "");
  const out = [];
  let cursor = 0;
  let match;

  LINK.lastIndex = 0;
  while ((match = LINK.exec(source)) !== null) {
    if (match.index > cursor) out.push(source.slice(cursor, match.index));

    out.push(
      <a
        key={nextKey("l")}
        href={match[2]}
        className="rich-text__link"
        target="_blank"
        rel="noopener noreferrer"
      >
        {match[1]}
      </a>,
    );

    cursor = match.index + match[0].length;
  }

  if (cursor < source.length) out.push(source.slice(cursor));

  return out.length > 0 ? out : [source];
}

/** Текст із markdown-акцентами → масив React-вузлів */
export const renderRichText = (value) => {
  const source = String(value ?? "");
  if (!source) return null;

  const nodes = [];
  let cursor = 0;
  let match;

  EMPHASIS.lastIndex = 0;
  while ((match = EMPHASIS.exec(source)) !== null) {
    if (match.index > cursor) {
      nodes.push(...withLinks(source.slice(cursor, match.index)));
    }

    const [boldItalic, bold, italic] = [match[1], match[2], match[3]];

    if (boldItalic !== undefined) {
      nodes.push(
        <strong key={nextKey("bi")}>
          <em>{withLinks(boldItalic)}</em>
        </strong>,
      );
    } else if (bold !== undefined) {
      nodes.push(<strong key={nextKey("b")}>{withLinks(bold)}</strong>);
    } else {
      nodes.push(<em key={nextKey("i")}>{withLinks(italic)}</em>);
    }

    cursor = match.index + match[0].length;
  }

  if (cursor < source.length) nodes.push(...withLinks(source.slice(cursor)));

  return nodes;
};
