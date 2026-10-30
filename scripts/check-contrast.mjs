#!/usr/bin/env node
// WCAG contrast audit of semantic pairings, in both modes. Exits non-zero on failure,
// so it can gate CI or a re-theme:  node scripts/check-contrast.mjs [--theme themes/x.tokens.json]
import { loadTokens, validate, resolve } from './lib/tokens.mjs';
import { contrast, over } from './lib/color.mjs';

const args = process.argv.slice(2);
const themeFile = args.includes('--theme') ? args[args.indexOf('--theme') + 1] : null;
const flat = loadTokens({ themeFile });
validate(flat);

const AA = 4.5, UI = 3; // body text, non-text UI (icons, borders, focus)
const TONES = ['guide', 'affirm', 'inform', 'warn', 'alert'];

// [foreground, background, minimum, note]
const PAIRS = [
  ...['surface.page', 'surface.default', 'surface.sunken'].flatMap((bg) => [
    ['text.default', bg, AA], ['text.strong', bg, AA], ['text.subtle', bg, AA], ['text.link', bg, AA],
    ['action.tertiary.fg', bg, AA], ['border.focus', bg, UI, 'focus ring'],
  ]),
  ['border.input', 'surface.default', UI, 'input boundary (WCAG 1.4.11)'],
  ['text.inverse', 'surface.inverse', AA],
  ['action.primary.fg', 'action.primary.bg', AA],
  ['action.primary.fg', 'action.primary.bg-hover', AA],
  ['action.primary.fg', 'action.primary.bg-pressed', AA],
  ['action.secondary.fg', 'action.secondary.bg', AA],
  ['action.secondary.fg', 'action.secondary.bg-hover', AA],
  ['action.secondary.fg', 'action.secondary.bg-pressed', AA],
  ['action.secondary.border', 'action.secondary.bg', UI, 'secondary button boundary'],
  ['feedback.alert.icon', 'surface.default', UI, 'input error border'],
  ...TONES.flatMap((t) => [
    ['text.default', `feedback.${t}.bg`, AA], ['text.strong', `feedback.${t}.bg`, AA],
    ['text.default', `feedback.${t}.bg-subtle`, AA],
    [`feedback.${t}.icon`, `feedback.${t}.bg`, UI], [`feedback.${t}.icon`, `feedback.${t}.bg-subtle`, UI],
    [`feedback.${t}.fg-on-strong`, `feedback.${t}.bg-strong`, AA],
  ]),
];

let failures = 0;
for (const mode of ['light', 'dark']) {
  const page = resolve(flat, flat.get('surface.page').modes[mode], mode);
  const get = (id) => {
    const t = flat.get(id);
    if (!t) throw new Error(`Unknown token ${id}`);
    return resolve(flat, t.modes ? t.modes[mode] : t.value, mode);
  };
  const rows = [];
  for (const [fg, bg, min, note] of PAIRS) {
    const b = over(get(bg), page);
    const ratio = contrast(over(get(fg), b), b);
    const ok = ratio >= min;
    if (!ok) failures++;
    rows.push(`${ok ? '  ok ' : 'FAIL '} ${ratio.toFixed(2).padStart(5)} ≥ ${min}  ${fg} on ${bg}${note ? `  (${note})` : ''}`);
  }
  console.log(`\n${mode.toUpperCase()} — ${rows.filter((r) => r.startsWith('  ok')).length}/${rows.length} pass`);
  console.log(rows.filter((r) => r.startsWith('FAIL') || args.includes('--verbose')).join('\n') || '  all pairs pass');
}
if (failures) { console.error(`\n${failures} pairing(s) below WCAG AA.`); process.exit(1); }
