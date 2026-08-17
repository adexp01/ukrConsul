/**
 * Ломана з округленими кутами у вигляді SVG-шляху.
 *
 * Була скопійована байт-у-байт у двох місцях — у схемі екосистеми («Про нас»)
 * і в лініях мапи експорту. Тепер одна.
 *
 * @param {{x: number, y: number}[]} points вершини ломаної
 * @param {number} radius бажаний радіус кута; на коротких відрізках
 *   зменшується автоматично, щоб сусідні заокруглення не наклались
 */
export const buildRoundedPath = (points, radius = 12) => {
  if (points.length < 2) return "";

  if (points.length === 2) {
    return `M ${points[0].x} ${points[0].y} L ${points[1].x} ${points[1].y}`;
  }

  let path = `M ${points[0].x} ${points[0].y}`;

  for (let i = 1; i < points.length - 1; i += 1) {
    const prev = points[i - 1];
    const curr = points[i];
    const next = points[i + 1];

    const v1x = curr.x - prev.x;
    const v1y = curr.y - prev.y;
    const v2x = next.x - curr.x;
    const v2y = next.y - curr.y;

    const len1 = Math.hypot(v1x, v1y) || 1;
    const len2 = Math.hypot(v2x, v2y) || 1;
    const cornerRadius = Math.min(radius, len1 / 2, len2 / 2);

    const start = {
      x: curr.x - (v1x / len1) * cornerRadius,
      y: curr.y - (v1y / len1) * cornerRadius,
    };
    const end = {
      x: curr.x + (v2x / len2) * cornerRadius,
      y: curr.y + (v2y / len2) * cornerRadius,
    };

    path += ` L ${start.x} ${start.y} Q ${curr.x} ${curr.y} ${end.x} ${end.y}`;
  }

  const last = points[points.length - 1];
  path += ` L ${last.x} ${last.y}`;

  return path;
};
