import { useCallback, useMemo, useState } from "react";

/**
 * Проста карусель «вікно з N карток і дві стрілки».
 *
 * Була скопійована в трьох блоках («Що ми робимо» на треку, рішення офісу,
 * екосистема на «Долучитися») — з тим самим станом, тими самими межами й тими
 * самими помилками. Тепер логіка одна.
 *
 * `items` мемоїзується всередині: у компонентах список приходить із локалей
 * через t(), тобто новим масивом на кожен рендер, і без цього кожна залежність,
 * побудована на ньому, змінювалась би постійно.
 */
export const useCarousel = (items, visibleCount) => {
  const list = useMemo(() => (Array.isArray(items) ? items : []), [items]);
  const maxStartIndex = Math.max(0, list.length - visibleCount);
  const [startIndex, setStartIndex] = useState(0);

  // Список міг стати коротшим (зміна мови, інша вкладка) — не залишаємо вікно за межами
  const safeStartIndex = Math.min(startIndex, maxStartIndex);

  const visibleItems = useMemo(
    () => list.slice(safeStartIndex, safeStartIndex + visibleCount),
    [list, safeStartIndex, visibleCount],
  );

  const goPrev = useCallback(
    () => setStartIndex((current) => Math.max(0, current - 1)),
    [],
  );

  const goNext = useCallback(
    () => setStartIndex((current) => Math.min(maxStartIndex, current + 1)),
    [maxStartIndex],
  );

  return {
    items: list,
    visibleItems,
    startIndex: safeStartIndex,
    goPrev,
    goNext,
    isFirst: safeStartIndex === 0,
    isLast: safeStartIndex >= maxStartIndex,
  };
};
