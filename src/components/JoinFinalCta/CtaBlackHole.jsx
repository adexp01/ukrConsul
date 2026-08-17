import { useEffect, useMemo, useRef } from "react";
import "./CtaBlackHole.css";

/*
 * Анімований фон CTA — «чорна діра»: акреційне кільце з доменним ворпом
 * шуму, оранж ↔ синій по куту, радіальна віньєтка + м'яке згасання
 * до країв картки.
 *
 * Чому свій WebGL, а не бібліотека: reactbits/molten-metal тягне `ogl`
 * (+~45 КБ). Тут потрібен один фулскрін-трикутник і один фрагментний
 * шейдер — це 60 рядків без залежностей.
 *
 * Гейти на малювання ті самі, що в ShieldSequence:
 *   IntersectionObserver — не крутимо кадри, поки секції не видно;
 *   visibilitychange     — не крутимо у фоновій вкладці;
 *   prefers-reduced-motion — не монтуємо канвас узагалі, лишається
 *   статичний bgElements.svg.
 */

const VERT = `#version 300 es
in vec2 p; void main(){ gl_Position = vec4(p, 0.0, 1.0); }`;

const FRAG = `#version 300 es
precision highp float;
uniform vec2  uRes;
uniform vec2  uMouse;
uniform float uTime, uSpeed, uSwirl, uWarp, uScale, uRing, uWidth, uGlow, uCore;
uniform float uExposure, uAngle, uVig, uFeather, uGrain, uOpacity, uMouseStrength;
uniform vec3  uC1, uC2, uC3, uC0;
out vec4 frag;

float hash21(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
float vnoise(vec2 p){
  vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
  float a = hash21(i), b = hash21(i + vec2(1, 0)), c = hash21(i + vec2(0, 1)), d = hash21(i + vec2(1, 1));
  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}
float fbm(vec2 p){
  float s = 0.0, amp = 0.5; mat2 rot = mat2(0.8, 0.6, -0.6, 0.8);
  for (int i = 0; i < 4; i++){ s += amp * vnoise(p); p = rot * p * 2.02; amp *= 0.5; }
  return s;
}

void main(){
  vec2 fc = gl_FragCoord.xy;
  vec2 rect = fc / uRes;                     /* 0..1 у межах картки */
  vec2 uv = (fc - 0.5 * uRes) / uRes.y;      /* центр, з пропорціями */
  uv += (uMouse - 0.5) * uMouseStrength * 0.18;

  float t = uTime * uSpeed;
  float r = length(uv) * uScale;
  float ang = atan(uv.y, uv.x);

  /* обертання тим швидше, чим ближче до центру — диск «затягує» */
  float sw = ang + uSwirl * (0.55 / (r + 0.30)) + t * 0.9;
  vec2 q = vec2(cos(sw), sin(sw)) * r;

  float n1 = fbm(q * 2.1 + vec2(t * 1.2, -t * 0.8));
  float n2 = fbm(q * 4.7 + n1 * 1.6 - vec2(t * 0.7, t * 1.5));

  float rw = r + (n1 - 0.5) * uWarp + (n2 - 0.5) * uWarp * 0.45;
  float d = abs(rw - uRing);
  float shell = exp(-pow(d / max(uWidth, 0.004), 2.0));
  float bloom = uGlow * 0.022 / (d + 0.09);
  float energy = (shell * 1.15 + bloom) * (0.35 + 1.05 * n2) * uExposure;
  float inner = exp(-pow(rw / max(uRing * 0.7, 0.001), 2.0));   /* тінь у центрі */

  float hue = 0.5 + 0.5 * cos(mix(ang, sw, 0.25) - radians(uAngle));
  vec3 col = mix(uC2, uC1, pow(clamp(hue, 0.0, 1.0), 0.8));
  col = mix(col, uC3, smoothstep(0.75, 1.9, energy));

  /* маска: віньєтка + м'який край, щоб канвас не різав по радіусу картки */
  float vr = length(vec2(uv.x * 0.82, uv.y));
  float vig = mix(1.0, smoothstep(0.95, 0.18, vr), uVig);
  float fx = smoothstep(0.0, uFeather, rect.x) * smoothstep(1.0, 1.0 - uFeather, rect.x);
  float fy = smoothstep(0.0, uFeather, rect.y) * smoothstep(1.0, 1.0 - uFeather, rect.y);
  float mask = vig * fx * fy;

  float e = clamp(energy, 0.0, 2.2);
  vec3 rgb = uC0 * (1.0 - uCore * inner) + col * e;
  float a = clamp(max(e, uCore * inner * 0.9 + 0.10), 0.0, 1.0) * mask * uOpacity;

  if (uGrain > 0.0){
    a = clamp(a + (hash21(fc + fract(uTime) * 91.7) - 0.5) * uGrain, 0.0, 1.0);
  }
  frag = vec4(rgb * a, a);   /* premultiplied */
}`;

const hexToRgb = (hex) => {
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return m ? [1, 2, 3].map((i) => parseInt(m[i], 16) / 255) : [1, 1, 1];
};

const compile = (gl, type, src) => {
  const s = gl.createShader(type);
  gl.shaderSource(s, src);
  gl.compileShader(s);
  return s;
};

export const CtaBlackHole = ({
  speed = 0.22,
  swirl = 1.1,
  warp = 0.18,
  scale = 1.15,
  ring = 0.42,
  width = 0.055,
  glow = 0.8,
  core = 0.7,
  exposure = 0.4,
  angle = 205,
  vignette = 0.85,
  feather = 0.16,
  grain = 0.03,
  opacity = 0.95,
  mouseStrength = 0.25,
  color1 = "#ff6a00",
  color2 = "#3038c8",
  color3 = "#ffd7a8",
  colorBase = "#0b1128",
  maxDpr = 1.25,
  className = "",
}) => {
  const hostRef = useRef(null);

  const cfg = useMemo(
    () => ({
      speed, swirl, warp, scale, ring, width, glow, core, exposure, angle,
      vignette, feather, grain, opacity, mouseStrength,
      color1, color2, color3, colorBase,
    }),
    [speed, swirl, warp, scale, ring, width, glow, core, exposure, angle,
      vignette, feather, grain, opacity, mouseStrength,
      color1, color2, color3, colorBase],
  );
  const cfgRef = useRef(cfg);
  useEffect(() => { cfgRef.current = cfg; }, [cfg]);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return undefined;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return undefined;

    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl2", {
      alpha: true,
      premultipliedAlpha: true,
      antialias: false,
      powerPreference: "low-power",
    });
    if (!gl) return undefined;

    host.appendChild(canvas);

    const prog = gl.createProgram();
    gl.attachShader(prog, compile(gl, gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compile(gl, gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "p");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    gl.clearColor(0, 0, 0, 0);

    const U = (n) => gl.getUniformLocation(prog, n);
    const u = {
      res: U("uRes"), time: U("uTime"), mouse: U("uMouse"),
      speed: U("uSpeed"), swirl: U("uSwirl"), warp: U("uWarp"), scale: U("uScale"),
      ring: U("uRing"), width: U("uWidth"), glow: U("uGlow"), core: U("uCore"),
      exposure: U("uExposure"), angle: U("uAngle"), vig: U("uVig"),
      feather: U("uFeather"), grain: U("uGrain"), opacity: U("uOpacity"),
      mouseStrength: U("uMouseStrength"),
      c1: U("uC1"), c2: U("uC2"), c3: U("uC3"), c0: U("uC0"),
    };

    const resize = () => {
      const rect = host.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, maxDpr);
      canvas.width = Math.max(1, Math.floor(rect.width * dpr));
      canvas.height = Math.max(1, Math.floor(rect.height * dpr));
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(u.res, canvas.width, canvas.height);
    };
    const ro = new ResizeObserver(resize);
    ro.observe(host);
    resize();

    const target = [0.5, 0.5];
    const current = [0.5, 0.5];
    const parent = host.parentElement || host;
    const onMove = (e) => {
      const rect = host.getBoundingClientRect();
      target[0] = (e.clientX - rect.left) / rect.width;
      target[1] = 1 - (e.clientY - rect.top) / rect.height;
    };
    const onLeave = () => { target[0] = 0.5; target[1] = 0.5; };
    parent.addEventListener("mousemove", onMove);
    parent.addEventListener("mouseleave", onLeave);

    let raf = 0;
    let seen = false;
    let pageVisible = !document.hidden;
    const t0 = performance.now();

    const frame = (now) => {
      const c = cfgRef.current;
      gl.uniform1f(u.time, (now - t0) * 0.001);
      gl.uniform1f(u.speed, c.speed);
      gl.uniform1f(u.swirl, c.swirl);
      gl.uniform1f(u.warp, c.warp);
      gl.uniform1f(u.scale, c.scale);
      gl.uniform1f(u.ring, c.ring);
      gl.uniform1f(u.width, c.width);
      gl.uniform1f(u.glow, c.glow);
      gl.uniform1f(u.core, c.core);
      gl.uniform1f(u.exposure, c.exposure);
      gl.uniform1f(u.angle, c.angle);
      gl.uniform1f(u.vig, c.vignette);
      gl.uniform1f(u.feather, c.feather);
      gl.uniform1f(u.grain, c.grain);
      gl.uniform1f(u.opacity, c.opacity);
      gl.uniform1f(u.mouseStrength, c.mouseStrength);
      gl.uniform3fv(u.c1, hexToRgb(c.color1));
      gl.uniform3fv(u.c2, hexToRgb(c.color2));
      gl.uniform3fv(u.c3, hexToRgb(c.color3));
      gl.uniform3fv(u.c0, hexToRgb(c.colorBase));

      current[0] += 0.06 * (target[0] - current[0]);
      current[1] += 0.06 * (target[1] - current[1]);
      gl.uniform2f(u.mouse, current[0], current[1]);

      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      raf = requestAnimationFrame(frame);
    };
    const start = () => { if (seen && pageVisible && !raf) raf = requestAnimationFrame(frame); };
    const stop = () => { if (raf) { cancelAnimationFrame(raf); raf = 0; } };

    const io = new IntersectionObserver(([entry]) => {
      seen = entry.isIntersecting;
      if (seen) start(); else stop();
    }, { threshold: 0 });
    io.observe(host);

    const onVisibility = () => {
      pageVisible = !document.hidden;
      if (pageVisible) start(); else stop();
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      parent.removeEventListener("mousemove", onMove);
      parent.removeEventListener("mouseleave", onLeave);
      canvas.remove();
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, [maxDpr]);

  return <div ref={hostRef} className={`cta-black-hole ${className}`.trim()} aria-hidden="true" />;
};
