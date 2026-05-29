import { useEffect, useRef } from "react";
import { useIsMobile } from "../../hooks/IsMobile";

const SOURCE_FRAME_COUNT = 179;
const FRAME_STEP = 2;
const DEFAULT_FPS = 32;
const INITIAL_BATCH = 28;
const LOAD_CONCURRENCY = 3;

const LUMINANCE_THRESHOLD = 38;
const LUMINANCE_FEATHER = 28;

const frameSrc = (index) =>
  new URL(
    `../../../public/animation/frames/SHIELD_ALPHA_${String(index).padStart(5, "0")}.png`,
    import.meta.url,
  ).href;

const buildPlaybackIndices = () => {
  const indices = [];
  for (let i = 0; i < SOURCE_FRAME_COUNT; i += FRAME_STEP) {
    indices.push(i);
  }
  return indices;
};

const PLAYBACK_INDICES = buildPlaybackIndices();
const PLAYBACK_FRAME_COUNT = PLAYBACK_INDICES.length;

const getProcessScale = (isMobile) => (isMobile ? 0.55 : 0.85);

const loadImage = (index) =>
  new Promise((resolve, reject) => {
    const img = new Image();
    img.decoding = "async";
    img.src = frameSrc(index);
    img.onload = () => resolve(img);
    img.onerror = reject;
  });

const stripSolidBackground = (img, scale = 1) => {
  const buffer = document.createElement("canvas");
  const width = Math.max(1, Math.round(img.width * scale));
  const height = Math.max(1, Math.round(img.height * scale));

  buffer.width = width;
  buffer.height = height;

  const bufferCtx = buffer.getContext("2d", { willReadFrequently: true });
  bufferCtx.drawImage(img, 0, 0, width, height);

  const imageData = bufferCtx.getImageData(0, 0, width, height);
  const { data } = imageData;

  for (let i = 0; i < data.length; i += 4) {
    const lum = data[i] * 0.2126 + data[i + 1] * 0.7152 + data[i + 2] * 0.0722;

    if (lum <= LUMINANCE_THRESHOLD) {
      data[i + 3] = 0;
    } else if (lum < LUMINANCE_THRESHOLD + LUMINANCE_FEATHER) {
      data[i + 3] = Math.round(
        ((lum - LUMINANCE_THRESHOLD) / LUMINANCE_FEATHER) * 255,
      );
    }
  }

  bufferCtx.putImageData(imageData, 0, 0);
  return buffer;
};

const loadAndProcessFrame = async (sourceIndex, processScale) => {
  const img = await loadImage(sourceIndex);
  return stripSolidBackground(img, processScale);
};

const mapPool = async (items, concurrency, mapper) => {
  const results = new Array(items.length);
  let nextIndex = 0;

  const worker = async () => {
    while (nextIndex < items.length) {
      const current = nextIndex;
      nextIndex += 1;
      results[current] = await mapper(items[current], current);
    }
  };

  await Promise.all(
    Array.from({ length: Math.min(concurrency, items.length) }, () => worker()),
  );

  return results;
};

const getPlaybackFps = (playbackDurationMs) => {
  if (!playbackDurationMs) return DEFAULT_FPS;
  return PLAYBACK_FRAME_COUNT / (playbackDurationMs / 1000);
};

export const SpriteCanvas = ({
  className,
  play = true,
  playbackDurationMs,
}) => {
  const canvasRef = useRef(null);
  const playRef = useRef(play);
  const runtimeRef = useRef(null);
  const isMobile = useIsMobile(1025);

  playRef.current = play;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return undefined;

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";

    let animationId = 0;
    let isCancelled = false;
    let lastFrameTime = 0;
    let currentFrame = 0;
    let isVisible = true;
    let isPlaying = false;
    let isBatchReady = false;

    const frames = new Array(PLAYBACK_FRAME_COUNT).fill(null);
    const fps = getPlaybackFps(playbackDurationMs);
    const frameDuration = 1000 / fps;
    const processScale = getProcessScale(isMobile);

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const drawFrame = (frame) => {
      if (!frame) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(frame, 0, 0);
    };

    const setCanvasSizeFromFrame = (frame) => {
      if (canvas.width !== frame.width || canvas.height !== frame.height) {
        canvas.width = frame.width;
        canvas.height = frame.height;
      }
    };

    const assignFrame = (slotIndex, frame) => {
      frames[slotIndex] = frame;

      if (slotIndex === 0) {
        setCanvasSizeFromFrame(frame);
        drawFrame(frame);
      }
    };

    const drawLoop = (time) => {
      if (isCancelled) return;

      animationId = requestAnimationFrame(drawLoop);

      if (!isPlaying || !isVisible) return;

      if (time - lastFrameTime >= frameDuration) {
        const frame = frames[currentFrame];
        if (frame) {
          drawFrame(frame);
        }

        currentFrame = (currentFrame + 1) % PLAYBACK_FRAME_COUNT;
        lastFrameTime = time;
      }
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
      },
      { threshold: 0.08 },
    );
    observer.observe(canvas);

    const loadSlot = async (slotIndex) => {
      const sourceIndex = PLAYBACK_INDICES[slotIndex];
      const frame = await loadAndProcessFrame(sourceIndex, processScale);

      if (isCancelled) return null;

      assignFrame(slotIndex, frame);
      return frame;
    };

    const pausePlayback = () => {
      isPlaying = false;
      currentFrame = 0;
      lastFrameTime = 0;

      if (frames[0]) {
        drawFrame(frames[0]);
      }
    };

    const startPlayback = () => {
      if (prefersReducedMotion || !playRef.current) return;

      currentFrame = 0;
      lastFrameTime = 0;
      isPlaying = true;

      if (!animationId) {
        animationId = requestAnimationFrame(drawLoop);
      }
    };

    const tryStartPlayback = () => {
      if (!isBatchReady || isCancelled) return;

      if (playRef.current) {
        startPlayback();
      } else {
        pausePlayback();
      }
    };

    runtimeRef.current = {
      isBatchReady: false,
      startPlayback,
      pausePlayback,
    };

    const loadRemainingFrames = async (fromSlot) => {
      const slots = PLAYBACK_INDICES.map((_, slotIndex) => slotIndex).slice(fromSlot);

      await mapPool(slots, LOAD_CONCURRENCY, async (slotIndex) => {
        if (frames[slotIndex]) return;
        await loadSlot(slotIndex);
      });
    };

    const init = async () => {
      try {
        await loadSlot(0);

        if (isCancelled) return;

        if (prefersReducedMotion) {
          isPlaying = false;
          return;
        }

        const firstBatchEnd = Math.min(INITIAL_BATCH, PLAYBACK_FRAME_COUNT);
        const firstBatchSlots = Array.from(
          { length: firstBatchEnd - 1 },
          (_, index) => index + 1,
        );

        await mapPool(firstBatchSlots, LOAD_CONCURRENCY, (slotIndex) =>
          loadSlot(slotIndex),
        );

        if (isCancelled) return;

        isBatchReady = true;
        runtimeRef.current.isBatchReady = true;
        tryStartPlayback();
        void loadRemainingFrames(firstBatchEnd);
      } catch (error) {
        console.error("Failed to preload sprite frames:", error);
      }
    };

    void init();

    return () => {
      isCancelled = true;
      isPlaying = false;
      runtimeRef.current = null;
      observer.disconnect();
      cancelAnimationFrame(animationId);
    };
  }, [isMobile, playbackDurationMs]);

  useEffect(() => {
    const runtime = runtimeRef.current;
    if (!runtime?.isBatchReady) return;

    if (play) {
      runtime.startPlayback();
    } else {
      runtime.pausePlayback();
    }
  }, [play]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      aria-hidden="true"
    />
  );
};
