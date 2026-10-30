// OKLCH / WCAG helpers. Zero dependencies.
const toLin = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const toSrgb = (c) => (c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055);

export function hexToRgb(hex) {
  const h = hex.replace('#', '');
  const n = (i) => parseInt(h.slice(i, i + 2), 16) / 255;
  return { r: n(0), g: n(2), b: n(4), a: h.length === 8 ? n(6) : 1 };
}
export function rgbToHex({ r, g, b }) {
  const h = (x) => Math.round(Math.max(0, Math.min(1, x)) * 255).toString(16).padStart(2, '0');
  return '#' + h(r) + h(g) + h(b);
}

function rgbToOklab({ r, g, b }) {
  [r, g, b] = [r, g, b].map(toLin);
  let l = 0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b;
  let m = 0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b;
  let s = 0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b;
  [l, m, s] = [l, m, s].map(Math.cbrt);
  return [
    0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s,
  ];
}
function oklabToLinRgb(L, a, b) {
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3;
  return [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ];
}
export function hexToOklch(hex) {
  const [L, a, b] = rgbToOklab(hexToRgb(hex));
  return { L, C: Math.hypot(a, b), H: ((Math.atan2(b, a) * 180) / Math.PI + 360) % 360 };
}
// OKLCH -> hex, reducing chroma until the color fits sRGB.
export function oklchToHex(L, C, H) {
  const rad = (H * Math.PI) / 180;
  const fits = (c) => oklabToLinRgb(L, c * Math.cos(rad), c * Math.sin(rad)).every((x) => x >= -1e-4 && x <= 1 + 1e-4);
  let c = C;
  if (!fits(c)) {
    let lo = 0, hi = C;
    for (let i = 0; i < 30; i++) { const mid = (lo + hi) / 2; if (fits(mid)) lo = mid; else hi = mid; }
    c = lo;
  }
  const [r, g, b] = oklabToLinRgb(L, c * Math.cos(rad), c * Math.sin(rad)).map((x) => toSrgb(Math.max(0, Math.min(1, x))));
  return rgbToHex({ r, g, b });
}

export function luminance(hex) {
  const { r, g, b } = hexToRgb(hex);
  return 0.2126 * toLin(r) + 0.7152 * toLin(g) + 0.0722 * toLin(b);
}
export function contrast(a, b) {
  const [x, y] = [luminance(a), luminance(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
}
// Composite a translucent #rrggbbaa over an opaque background.
export function over(fg, bg) {
  const f = hexToRgb(fg), b = hexToRgb(bg);
  if (f.a >= 1) return fg.slice(0, 7);
  return rgbToHex({ r: f.r * f.a + b.r * (1 - f.a), g: f.g * f.a + b.g * (1 - f.a), b: f.b * f.a + b.b * (1 - f.a) });
}
