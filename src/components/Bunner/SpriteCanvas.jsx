import { useEffect, useRef } from "react";

const FRAME_COUNT = 179;
const FPS = 34;

const frameSrc = (index) =>
  new URL(
    `../../../public/animation/frames/SHIELD_ALPHA_${String(index).padStart(5, "0")}.png`,
    import.meta.url,
  ).href;

const LUMINANCE_THRESHOLD = 38;
const LUMINANCE_FEATHER = 28;

const stripSolidBackground = (img) => {
  const buffer = document.createElement("canvas");
  buffer.width = img.width;
  buffer.height = img.height;

  const bufferCtx = buffer.getContext("2d", { willReadFrequently: true });
  bufferCtx.drawImage(img, 0, 0);

  const imageData = bufferCtx.getImageData(0, 0, buffer.width, buffer.height);
  const { data } = imageData;

  for (let i = 0; i < data.length; i += 4) {
    const lum =
      data[i] * 0.2126 + data[i + 1] * 0.7152 + data[i + 2] * 0.0722;

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

const preloadSprites = () =>
  Promise.all(
    Array.from({ length: FRAME_COUNT }, (_, index) => {
      const img = new Image();
      img.src = frameSrc(index);

      return new Promise((resolve, reject) => {
        img.onload = () => resolve(stripSolidBackground(img));
        img.onerror = reject;
      });
    }),
  );

export const SpriteCanvas = ({ className }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const ctx = canvas.getContext("2d");
    if (!ctx) return undefined;

    let animationId;
    let isCancelled = false;
    let lastFrameTime = 0;
    let currentFrame = 0;

    const frameDuration = 1000 / FPS;

    preloadSprites()
      .then((images) => {
        if (isCancelled) return;

        canvas.width = images[0].width;
        canvas.height = images[0].height;

        const draw = (time) => {
          if (isCancelled) return;

          if (time - lastFrameTime >= frameDuration) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(images[currentFrame], 0, 0);

            currentFrame = (currentFrame + 1) % FRAME_COUNT;
            lastFrameTime = time;
          }

          animationId = requestAnimationFrame(draw);
        };

        animationId = requestAnimationFrame(draw);
      })
      .catch((error) => {
        console.error("Failed to preload sprite frames:", error);
      });

    return () => {
      isCancelled = true;
      cancelAnimationFrame(animationId);
    };
  }, []);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
};
