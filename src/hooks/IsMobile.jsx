import { useEffect, useState } from "react";

const matches = (breakpoint) =>
  typeof window !== "undefined" &&
  window.matchMedia(`(max-width: ${breakpoint - 1}px)`).matches;

/**
 * Ширина екрана як стан.
 *
 * Початкове значення читаємо синхронно, а не з ефекту: інакше перший рендер
 * завжди «десктопний», і все, що залежить від цього прапорця, встигає
 * запуститись двічі — з різними параметрами. Найдорожче це коштувало
 * секвенції щита: перші 12 кадрів вантажились і обробляллись у десктопному
 * масштабі, а потім викидались і бралися заново в мобільному.
 */
export function useIsMobile(breakpoint = 768) {
  const [isMobile, setIsMobile] = useState(() => matches(breakpoint));

  useEffect(() => {
    const mediaQuery = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);

    const update = () => {
      setIsMobile(mediaQuery.matches);
    };

    update();
    mediaQuery.addEventListener("change", update);

    return () => {
      mediaQuery.removeEventListener("change", update);
    };
  }, [breakpoint]);

  return isMobile;
}
