import { useEffect, useRef } from "react";
import "./style.css";

const FRAME_COUNT = 91;
const FRAME_SIZE = 720;
// Скільки кадрів чекаємо, перш ніж почати малювати. Решта доїжджає далі,
// а вже завантажені показуються одразу.
const INITIAL_BATCH = 10;
const LOAD_CONCURRENCY = 6;

const frameSrc = (index) =>
  `/animation/shield360/shield-${String(index).padStart(3, "0")}.webp`;

const loadImage = (src) =>
  new Promise((resolve) => {
    const img = new Image();
    img.decoding = "async";
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });

/** Черга з обмеженою кількістю одночасних завантажень */
const loadPool = async (indices, frames, onFirstReady) => {
  let cursor = 0;
  let notified = false;

  const worker = async () => {
    while (cursor < indices.length) {
      const index = indices[cursor];
      cursor += 1;

      frames[index] = await loadImage(frameSrc(index));

      if (!notified && cursor >= INITIAL_BATCH) {
        notified = true;
        onFirstReady();
      }
    }
  };

  await Promise.all(
    Array.from({ length: LOAD_CONCURRENCY }, () => worker()),
  );
  if (!notified) onFirstReady();
};

/**
 * Щит, що обертається за прокруткою.
 *
 * Кадр вибирається з того, наскільки далеко блок пройшов через вікно:
 * зʼявився знизу — перший кадр, пішов за верхній край — останній.
 * Кадри тягнуться лише коли блок наблизився до екрана.
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

    const draw = (index) => {
      const frame = frames[index];
      if (!frame || currentRef.current === index) return;

      currentRef.current = index;
      context.clearRect(0, 0, canvas.width, canvas.height);
      context.drawImage(frame, 0, 0, canvas.width, canvas.height);
    };

    /** Найближчий завантажений кадр — щоб не блимати порожнечею */
    const drawNearest = (target) => {
      for (let offset = 0; offset < FRAME_COUNT; offset += 1) {
        const before = target - offset;
        const after = target + offset;
        if (before >= 0 && frames[before]) return draw(before);
        if (after < FRAME_COUNT && frames[after]) return draw(after);
      }
    };

    const update = () => {
      rafId = 0;
      const rect = canvas.getBoundingClientRect();
      const viewport = window.innerHeight || 1;
      const progress =
        (viewport - rect.top) / (viewport + rect.height || 1);
      const clamped = Math.min(1, Math.max(0, progress));

      drawNearest(Math.round(clamped * (FRAME_COUNT - 1)));
    };

    const onScroll = () => {
      if (rafId) return;
      rafId = window.requestAnimationFrame(update);
    };

    const start = () => {
      if (started || disposed) return;
      started = true;

      const order = Array.from({ length: FRAME_COUNT }, (_, i) => i);
      loadPool(order, frames, () => {
        if (disposed) return;
        update();
        window.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("resize", onScroll);
      });
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
