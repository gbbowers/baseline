// Shared token loading + resolution. Zero dependencies.
import fs from 'node:fs';
import path from 'node:path';

export const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '../..');

// Load every tokens/*.tokens.json, optionally swapping theme.tokens.json for another file.
export function loadTokens({ themeFile } = {}) {
  const dir = path.join(ROOT, 'tokens');
  const files = fs.readdirSync(dir).filter((f) => f.endsWith('.tokens.json')).sort();
  const flat = new Map(); // "a.b.c" -> token
  for (const f of files) {
    const src = f === 'theme.tokens.json' && themeFile ? path.resolve(themeFile) : path.join(dir, f);
    const json = JSON.parse(fs.readFileSync(src, 'utf8'));
    walk(json, [], (keys, tok) => {
      const id = keys.join('.');
      if (flat.has(id)) throw new Error(`Duplicate token path "${id}" (in ${f} and ${flat.get(id).file})`);
      const ext = (tok.$extensions && tok.$extensions['com.figma']) || {};
      flat.set(id, {
        id,
        file: f,
        type: tok.$type,
        value: tok.$value,
        modes: ext.modes || null,
        css: ext.css || '--' + keys.join('-'),
        description: tok.$description || '',
      });
    });
  }
  return flat;
}

function walk(node, keys, fn) {
  if (node && typeof node === 'object' && '$value' in node) return fn(keys, node);
  for (const k of Object.keys(node || {})) if (!k.startsWith('$')) walk(node[k], [...keys, k], fn);
}

export const isRef = (v) => typeof v === 'string' && /^\{[^}]+\}$/.test(v);
export const refId = (v) => v.slice(1, -1);

// Resolve a value (following aliases) to its final literal.
export function resolve(flat, value, mode, seen = new Set()) {
  if (!isRef(value)) return value;
  const id = refId(value);
  if (seen.has(id)) throw new Error(`Circular reference at ${id}`);
  seen.add(id);
  const t = flat.get(id);
  if (!t) throw new Error(`Unresolved reference ${value}`);
  const v = mode && t.modes && mode in t.modes ? t.modes[mode] : t.value;
  return resolve(flat, v, mode, seen);
}

// Validate every reference up front so typos fail loudly.
export function validate(flat) {
  const errors = [];
  for (const t of flat.values()) {
    const vals = t.modes ? Object.values(t.modes) : [t.value];
    for (const v of vals) if (isRef(v) && !flat.has(refId(v))) errors.push(`${t.id} -> ${v}`);
  }
  if (errors.length) throw new Error('Unresolved token references:\n  ' + errors.join('\n  '));
}
