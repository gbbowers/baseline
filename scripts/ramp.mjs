#!/usr/bin/env node
// Generate role ramps for a new project's theme from a few brand colors.
//
//   node scripts/ramp.mjs \
//     --primary "#163d2b@700" \
//     --accent "#c6e86b@200" \
//     --secondary "#db8b62@300,#b94d27@500" \
//     --neutral "#252b23@700" \
//     --font-body "Libre Franklin" --font-display "Libre Franklin" \
//     --out themes/my-project.tokens.json
//
// Each role takes one or more anchors "#hex[@step]". The anchor hex lands exactly on that step
// (omit @step to snap to the closest lightness). Other steps are interpolated in OKLCH using
// shared lightness targets, so every family steps together and keeps the contrast rule:
// step 500 ≥ 3:1 and step 600 ≥ 4.5:1 against the page color.
//
// Roles you don't pass keep their current values. GAIWA ramps (guide/affirm/inform/warn/alert),
// alpha, shape and the rest of theme.tokens.json are copied from the current theme.
// Then: Figma → Baseline Tokens plugin → Import theme → paste the file → Export → npm run build.
import fs from 'node:fs';
import path from 'node:path';
import { ROOT } from './lib/tokens.mjs';
import { hexToOklch, oklchToHex, contrast } from './lib/color.mjs';

const STEPS = ['050', '100', '200', '300', '400', '500', '600', '700', '800', '900'];
const L_TARGET = [0.965, 0.91, 0.83, 0.73, 0.62, 0.53, 0.45, 0.37, 0.29, 0.21];
const C_PROFILE = [0.13, 0.25, 0.45, 0.7, 0.85, 0.92, 0.8, 0.64, 0.48, 0.3]; // relative chroma by step

export function ramp(anchors) {
  // anchors: [{ hex, step? }]
  const pinned = anchors.map(({ hex, step }) => {
    const o = hexToOklch(hex);
    const i = step ? STEPS.indexOf(step) : L_TARGET.reduce((best, l, j) => (Math.abs(l - o.L) < Math.abs(L_TARGET[best] - o.L) ? j : best), 0);
    if (i < 0) throw new Error(`Unknown step "${step}" — use one of ${STEPS.join(', ')}`);
    return { i, hex: hex.toLowerCase(), ...o };
  }).sort((a, b) => a.i - b.i);

  // Lightness: piecewise remap of default targets so anchors land exactly; ends keep defaults.
  const pts = [{ i: 0, L: L_TARGET[0] }, ...pinned.map((p) => ({ i: p.i, L: p.L })), { i: 9, L: L_TARGET[9] }]
    .filter((p, k, arr) => !(k === 0 && arr[1].i === 0) && !(k === arr.length - 1 && arr[arr.length - 2].i === 9));
  const lightness = (i) => {
    for (let k = 0; k < pts.length - 1; k++) {
      const a = pts[k], b = pts[k + 1];
      if (i >= a.i && i <= b.i) {
        if (a.i === b.i) return a.L;
        const t = (L_TARGET[a.i] - L_TARGET[i]) / (L_TARGET[a.i] - L_TARGET[b.i]);
        return a.L + (b.L - a.L) * t;
      }
    }
  };
  // Chroma ceiling + hue: interpolate between anchors, hold flat outside them.
  const interp = (i, f) => {
    if (i <= pinned[0].i) return f(pinned[0]);
    if (i >= pinned.at(-1).i) return f(pinned.at(-1));
    for (let k = 0; k < pinned.length - 1; k++) {
      const a = pinned[k], b = pinned[k + 1];
      if (i >= a.i && i <= b.i) { const t = (i - a.i) / (b.i - a.i); return f(a) * (1 - t) + f(b) * t; }
    }
  };
  const out = {};
  STEPS.forEach((s, i) => {
    const p = pinned.find((x) => x.i === i);
    if (p) return (out[s] = p.hex);
    const cmax = interp(i, (x) => x.C / C_PROFILE[x.i]);
    const hue = interp(i, (x) => x.H);
    out[s] = oklchToHex(lightness(i), cmax * C_PROFILE[i], hue);
  });
  return out;
}

const parseAnchors = (s) => s.split(',').map((x) => { const [hex, step] = x.trim().split('@'); return { hex: hex.startsWith('#') ? hex : '#' + hex, step }; });

function main() {
  const argv = process.argv.slice(2);
  const opt = (k) => (argv.includes(`--${k}`) ? argv[argv.indexOf(`--${k}`) + 1] : null);
  if (argv.includes('--help') || !argv.length) {
    console.log(fs.readFileSync(new URL(import.meta.url), 'utf8').split('\n').slice(1, 20).map((l) => l.replace(/^\/\/ ?/, '')).join('\n'));
    return;
  }
  const base = JSON.parse(fs.readFileSync(path.join(ROOT, 'tokens/theme.tokens.json'), 'utf8'));
  const tok = (hex, css) => ({ $type: 'color', $value: hex, $extensions: { 'com.figma': { css } } });
  const brand = {};
  for (const role of ['primary', 'accent', 'secondary', 'neutral']) {
    const spec = opt(role);
    if (!spec) continue;
    const anchors = parseAnchors(spec);
    const r = ramp(anchors);
    const group = role === 'neutral' ? { '000': tok('#ffffff', '--neutral-000') } : {};
    for (const [s, hex] of Object.entries(r)) group[s] = tok(hex, `--${role}-${s}`);
    if (role === 'neutral') group['1000'] = tok('#000000', '--neutral-1000');
    base[role] = group;
    anchors.forEach((a, k) => {
      const step = Object.entries(r).find(([, h]) => h === a.hex.toLowerCase())?.[0];
      brand[`${role}${anchors.length > 1 ? '-' + (k + 1) : ''}`] = { $type: 'color', $value: `{${role}.${step}}`, $extensions: { 'com.figma': { css: `--brand-${role}${anchors.length > 1 ? '-' + (k + 1) : ''}` } } };
    });
    const page = (base.neutral?.['050']?.$value) || '#ffffff';
    const c5 = contrast(r['500'], page), c6 = contrast(r['600'], page);
    console.log(`${role.padEnd(9)} ${STEPS.map((s) => r[s]).join(' ')}   500:${c5.toFixed(1)} 600:${c6.toFixed(1)}${c5 < 3 || c6 < 4.5 ? '  ⚠ below contrast rule' : ''}`);
  }
  if (Object.keys(brand).length) base.brand = brand; // brand names are project-specific; rename freely in Figma
  for (const [k, css] of [['font-body', '--font-body'], ['font-display', '--font-display']]) {
    const v = opt(k);
    if (v) { base.font = base.font || {}; base.font[k.split('-')[1]] = { $type: 'fontFamily', $value: v, $extensions: { 'com.figma': { css } } }; }
  }
  base.$description = 'Theme generated by scripts/ramp.mjs. Import into Figma (Baseline Tokens → Import theme), then export to make Figma the source of truth again.';
  const out = opt('out') || 'themes/new.tokens.json';
  fs.mkdirSync(path.dirname(path.resolve(out)), { recursive: true });
  fs.writeFileSync(out, JSON.stringify(base, null, 2) + '\n');
  console.log(`\nWrote ${out}\nPreview: node scripts/build.mjs --theme ${out} && node scripts/check-contrast.mjs --theme ${out}`);
}

if (import.meta.url === `file://${process.argv[1]}`) main();
