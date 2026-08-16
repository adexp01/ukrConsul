import { useEffect, useRef } from "react";
import "./style.css";

/**
 * У вихідній секвенції 91 кадр — це два повні оберти, тож при повному
 * програванні щит більшу частину часу стоїть до нас спиною або ребром.
 * З 44-го кадру він уже повернутий так, що видно внутрішній бік, тому
 * лишаємо тільки вузьку дугу 39–43: щит увесь час дивиться на нас, а
 * посередині дуги — 41-й кадр, той самий ракурс, що в макеті.
 */
const FRAME_FIRST = 39;
const FRAME_LAST = 43;
const FRAME_STEP = FRAME_LAST > FRAME_FIRST ? 1 : -1;
const FRAME_COUNT = Math.abs(FRAME_LAST - FRAME_FIRST) + 1;
const FRAME_SIZE = 720;
const INITIAL_BATCH = 4;
const LOAD_CONCURRENCY = 6;

const frameSrc = (index) => {
  const frame = FRAME_FIRST + index * FRAME_STEP;
  return `/animation/shield360/shield-${String(frame).padStart(3, "0")}.webp`;
};

const loadImage = (src) =>
  new Promise((resolve) => {
    const img = new Image();
    img.decoding = "async";
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });

/** Черга з обмеженою кількістю одночасних завантажень */
const loadPool = async (indices, frames, onFirstReady, onFrame) => {
  let cursor = 0;
  let notified = false;

  const worker = async () => {
    while (cursor < indices.length) {
      const index = indices[cursor];
      cursor += 1;

      frames[index] = await loadImage(frameSrc(index));
      onFrame();

      if (!notified && cursor >= INITIAL_BATCH) {
        notified = true;
        onFirstReady();
      }
    }
  };

  await Promise.all(Array.from({ length: LOAD_CONCURRENCY }, () => worker()));
  if (!notified) onFirstReady();
};

/**
 * Щит, що повертається за прокруткою.
 *
 * Кадр рахується з того, наскільки далеко блок пройшов через вікно:
 * зʼявився знизу — початок дуги, пішов за верхній край — кінець.
 * Між сусідніми кадрами домальовуємо наступний з прозорістю, щоб поворот
 * не «клацав» — кадрів у дузі мало, а рух має лишитись плавним.
 */
export const ShieldSequence = ({ className = "", ariaHidden = true }) => {
  const canvasRef = useRef(null);
  const framesRef = useRef(new Array(FRAME_COUNT).fill(null));
  const currentRef = useRef(-1);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const context = canvas.getContext("2d");
    const frames = framesRef.current;
    let rafId = 0;
    let started = false;
    let disposed = false;
    let progress = 0;

    /** Найближчий завантажений кадр — щоб не блимати порожнечею */
    const nearestLoaded = (target) => {
      for (let offset = 0; offset < FRAME_COUNT; offset += 1) {
        const before = target - offset;
        const after = target + offset;
        if (before >= 0 && frames[before]) return before;
        if (after < FRAME_COUNT && frames[after]) return after;
      }
      return -1;
    };

    const render = () => {
      const exact = progress * (FRAME_COUNT - 1);
      if (Math.abs(currentRef.current - exact) < 0.01) return;
      currentRef.current = exact;

      const base = nearestLoaded(Math.floor(exact));
      if (base < 0) return;

      context.clearRect(0, 0, canvas.width, canvas.height);
      context.globalAlpha = 1;
      context.drawImage(frames[base], 0, 0, canvas.width, canvas.height);

      const blend = exact - base;
      const next = frames[base + 1];
      if (next && blend > 0.02) {
        context.globalAlpha = Math.min(1, blend);
        context.drawImage(next, 0, 0, canvas.width, canvas.height);
        context.globalAlpha = 1;
      }
    };

    const update = () => {
      rafId = 0;
      const rect = canvas.getBoundingClientRect();
      const viewport = window.innerHeight || 1;
      const raw = (viewport - rect.top) / (viewport + rect.height || 1);

      progress = Math.min(1, Math.max(0, raw));
      render();
    };

    const onScroll = () => {
      if (rafId) return;
      rafId = window.requestAnimationFrame(update);
    };

    const start = () => {
      if (started || disposed) return;
      started = true;

      const order = Array.from({ length: FRAME_COUNT }, (_, i) => i);
      loadPool(
        order,
        frames,
        () => {
          if (disposed) return;
          update();
          window.addEventListener("scroll", onScroll, { passive: true });
          window.addEventListener("resize", onScroll);
        },
        () => {
          // кожен новий кадр може уточнити те, що вже намальовано
          if (disposed || !started) return;
          currentRef.current = -1;
          render();
        },
      );
    };

    // Вантажимо не одразу, а коли блок підійшов до екрана
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          observer.disconnect();
          start();
        }
      },
      { rootMargin: "300px 0px" },
    );
    observer.observe(canvas);

    return () => {
      disposed = true;
      observer.disconnect();
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`shield-sequence${className ? ` ${className}` : ""}`}
      width={FRAME_SIZE}
      height={FRAME_SIZE}
      aria-hidden={ariaHidden || undefined}
    />
  );
};
