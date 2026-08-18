import { useCallback, useEffect, useMemo, useState } from "react";

/**
 * Скільки карток видно за раз на поточній ширині.
 *
 * Потрібно саме як число в JS, а не лише в CSS: від нього залежить, до якого
 * індексу можна крутити. Якщо CSS показує одну картку, а JS думає, що три —
 * останні дві стають недосяжними, бо межа порахована по три.
 *
 * `steps` — від вужчого до ширшого: [{ upTo: 640, count: 1 }, { count: 3 }].
 * Значення читається синхронно, як у useIsMobile: інакше перший рендер завжди
 * «десктопний», і вікно каруселі встигає перерахуватись двічі.
 */
export const usePerView = (steps) => {
  const list = useMemo(() => steps, [steps]);

  const resolve = useCallback(() => {
    if (typeof window === "undefined") return list[list.length - 1].count;

    const hit = list.find(
      (step) =>
        step.upTo && window.matchMedia(`(max-width: ${step.upTo}px)`).matches,
    );

    return hit ? hit.count : list[list.length - 1].count;
  }, [list]);

  const [perView, setPerView] = useState(resolve);

  useEffect(() => {
    const update = () => setPerView(resolve());
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [resolve]);

  return perView;
};

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
