// Baseline token export — shared by the Figma plugin (code.js) and agent/MCP runs.
// Reads every local variable collection, text style and effect style and returns
// DTCG-format token files keyed by filename. Pure Plugin API; no DOM.
//
// Mapping
//   collection "Baseline / Theme"          -> theme.tokens.json   (the per-project file)
//   collection "Baseline / Color semantic" -> color.tokens.json   (modes in $extensions)
//   other "Baseline / <Name>" collections  -> <name>.tokens.json
//   text styles                            -> styles.tokens.json  (typography composites)
//   effect styles                          -> styles.tokens.json  (shadow composites)
//
// Every token carries $extensions["com.figma"].css — the variable's WEB code syntax
// (e.g. "--color-text-default"). The build uses it as the CSS custom-property name,
// so the name you see in Figma Dev Mode is exactly the name in the stylesheet.
// Multi-mode collections also carry $extensions["com.figma"].modes = { light, dark }.

async function baselineExport() {
  const FILE_FOR = (name) => {
    const short = name.replace(/^Baseline\s*\/\s*/i, '').trim().toLowerCase();
    if (short === 'color semantic') return 'color.tokens.json';
    if (short === 'scale primitives') return 'scale.tokens.json';
    if (short === 'dimension tokens') return 'dimension.tokens.json';
    return short.replace(/[^a-z0-9]+/g, '-') + '.tokens.json';
  };
  const hex = (c) => {
    const h = (x) => Math.round(x * 255).toString(16).padStart(2, '0');
    const a = c.a !== undefined && c.a < 1 ? h(c.a) : '';
    return '#' + h(c.r) + h(c.g) + h(c.b) + a;
  };
  const path = (name) => name.split('/').map((s) => s.trim().replace(/\s+/g, '-').toLowerCase());
  const ref = (v) => '{' + path(v.name).join('.') + '}';

  const collections = await figma.variables.getLocalVariableCollectionsAsync();
  const byId = {};
  for (const c of collections) for (const id of c.variableIds) {
    const v = await figma.variables.getVariableByIdAsync(id);
    if (v) byId[id] = v;
  }

  const typeFor = (v, collName) => {
    if (v.resolvedType === 'COLOR') return 'color';
    if (v.resolvedType === 'STRING') {
      if (v.scopes.includes('FONT_FAMILY')) return 'fontFamily';
      if (/^easing\//.test(v.name)) return 'cubicBezier';
      return 'string';
    }
    if (v.resolvedType === 'FLOAT') {
      if (v.scopes.includes('FONT_WEIGHT')) return 'fontWeight';
      if (/^duration\//.test(v.name)) return 'duration';
      return 'dimension';
    }
    return 'string';
  };
  const literal = (val, type) => {
    if (type === 'color') return hex(val);
    if (type === 'dimension') return val + 'px';
    if (type === 'duration') return val + 'ms';
    if (type === 'cubicBezier') {
      const m = String(val).match(/cubic-bezier\(([^)]+)\)/);
      return m ? m[1].split(',').map(Number) : val;
    }
    return val;
  };
  const encode = (val, type) =>
    val && typeof val === 'object' && val.type === 'VARIABLE_ALIAS'
      ? (byId[val.id] ? ref(byId[val.id]) : null)
      : literal(val, type);

  const files = {};
  const setDeep = (root, keys, token) => {
    let o = root;
    for (const k of keys.slice(0, -1)) o = o[k] = o[k] || {};
    o[keys[keys.length - 1]] = token;
  };

  for (const c of collections) {
    const file = FILE_FOR(c.name);
    const root = (files[file] = files[file] || {
      $description: `Exported from Figma collection "${c.name}". Do not edit by hand — edit in Figma and re-export.`,
    });
    const [base, ...others] = c.modes;
    // Natural sort (050 < 100 < 1000) so exports diff cleanly regardless of creation order.
    const natural = (a, b) => {
      const pa = path(a.name), pb = path(b.name);
      for (let i = 0; i < Math.min(pa.length, pb.length); i++) {
        if (pa[i] === pb[i]) continue;
        const na = /^\d+$/.test(pa[i]), nb = /^\d+$/.test(pb[i]);
        if (na && nb) return parseInt(pa[i], 10) - parseInt(pb[i], 10);
        if (na !== nb) return na ? -1 : 1;
        return pa[i] < pb[i] ? -1 : 1;
      }
      return pa.length - pb.length;
    };
    const ordered = c.variableIds.map((id) => byId[id]).filter(Boolean).sort(natural).map((v) => v.id);
    for (const id of ordered) {
      const v = byId[id];
      if (!v) continue;
      const type = typeFor(v, c.name);
      const token = { $type: type, $value: encode(v.valuesByMode[base.modeId], type) };
      if (v.description) token.$description = v.description;
      const ext = {};
      if (v.codeSyntax && v.codeSyntax.WEB) ext.css = v.codeSyntax.WEB.replace(/^var\((.+)\)$/, '$1');
      if (others.length) {
        ext.modes = { [base.name.toLowerCase()]: token.$value };
        for (const m of others) ext.modes[m.name.toLowerCase()] = encode(v.valuesByMode[m.modeId], type);
      }
      if (Object.keys(ext).length) token.$extensions = { 'com.figma': ext };
      setDeep(root, path(v.name), token);
    }
  }

  // Text + effect styles -> composite tokens
  const styles = { $description: 'Text and effect styles exported from Figma. Values reference variables where bound.' };
  for (const s of await figma.getLocalTextStylesAsync()) {
    const b = s.boundVariables || {};
    const pick = (field, fallback) => (b[field] && byId[b[field].id] ? ref(byId[b[field].id]) : fallback);
    // PERCENT and RAW are both relative to font size -> em; PIXELS stays px.
    const ls = s.letterSpacing.unit === 'PIXELS' ? s.letterSpacing.value + 'px' : s.letterSpacing.value / 100 + 'em';
    setDeep(styles, ['type', ...path(s.name.replace(/\s*\|\s*/g, '-'))], {
      $type: 'typography',
      $value: {
        fontFamily: pick('fontFamily', s.fontName.family),
        fontWeight: pick('fontWeight', s.fontName.style),
        fontSize: pick('fontSize', s.fontSize + 'px'),
        lineHeight: pick('lineHeight', s.lineHeight.unit === 'PIXELS' ? s.lineHeight.value + 'px' : 'normal'),
        letterSpacing: ls,
      },
      ...(s.description ? { $description: s.description } : {}),
    });
  }
  for (const s of await figma.getLocalEffectStylesAsync()) {
    const layers = s.effects.filter((e) => e.type === 'DROP_SHADOW' || e.type === 'INNER_SHADOW').map((e) => ({
      color: e.boundVariables && e.boundVariables.color && byId[e.boundVariables.color.id] ? ref(byId[e.boundVariables.color.id]) : hex(e.color),
      offsetX: e.offset.x + 'px', offsetY: e.offset.y + 'px', blur: e.radius + 'px', spread: (e.spread || 0) + 'px',
      inset: e.type === 'INNER_SHADOW',
    }));
    setDeep(styles, ['shadow', ...path(s.name)], { $type: 'shadow', $value: layers, ...(s.description ? { $description: s.description } : {}) });
  }
  files['styles.tokens.json'] = styles;
  return files;
}

// Import a theme.tokens.json into the "Baseline / Theme" collection (bootstrap a new project).
// Only literal colors / strings / numbers are written; aliases inside the theme are resolved
// against the same collection. Creates missing variables, never deletes.
async function baselineImportTheme(theme) {
  const cols = await figma.variables.getLocalVariableCollectionsAsync();
  const col = cols.find((c) => /theme$/i.test(c.name));
  if (!col) throw new Error('No "Baseline / Theme" collection in this file.');
  const modeId = col.modes[0].modeId;
  const existing = {};
  for (const id of col.variableIds) { const v = await figma.variables.getVariableByIdAsync(id); existing[v.name] = v; }
  const flat = [];
  const walk = (o, keys) => {
    if (o && typeof o === 'object' && '$value' in o) return flat.push([keys.join('/'), o]);
    for (const k of Object.keys(o || {})) if (!k.startsWith('$')) walk(o[k], [...keys, k]);
  };
  walk(theme, []);
  const toRGBA = (h) => {
    h = h.replace('#', '');
    const n = (i) => parseInt(h.slice(i, i + 2), 16) / 255;
    return { r: n(0), g: n(2), b: n(4), a: h.length === 8 ? n(6) : 1 };
  };
  let written = 0;
  for (const [name, t] of flat) {
    const isRef = typeof t.$value === 'string' && t.$value.startsWith('{');
    const type = t.$type === 'color' ? 'COLOR' : t.$type === 'fontFamily' || t.$type === 'string' ? 'STRING' : 'FLOAT';
    let v = existing[name];
    if (!v) {
      v = figma.variables.createVariable(name, col, type);
      v.scopes = [];
      v.setVariableCodeSyntax('WEB', `var(--${name.replace(/\//g, '-')})`);
      existing[name] = v;
    }
    if (isRef) continue; // second pass
    const val = type === 'COLOR' ? toRGBA(t.$value) : type === 'FLOAT' ? parseFloat(t.$value) : t.$value;
    v.setValueForMode(modeId, val);
    written++;
  }
  // Aliases may point anywhere in the file (e.g. shape -> radius/8 in Dimension tokens).
  const anywhere = {};
  for (const v of await figma.variables.getLocalVariablesAsync()) anywhere[v.name.split('/').map((s) => s.trim().replace(/\s+/g, '-').toLowerCase()).join('/')] = v;
  const missing = [];
  for (const [name, t] of flat) {
    if (!(typeof t.$value === 'string' && t.$value.startsWith('{'))) continue;
    const key = t.$value.slice(1, -1).replace(/\./g, '/');
    const target = existing[key] || anywhere[key];
    if (target) { existing[name].setValueForMode(modeId, { type: 'VARIABLE_ALIAS', id: target.id }); written++; }
    else missing.push(`${name} -> ${t.$value}`);
  }
  return { written, missing };
}

// ---------------------------------------------------------------------------
// Plugin entry. Agents running code through the Figma MCP can paste the two
// functions above and call them directly; this block only runs inside the plugin.
if (typeof __html__ !== 'undefined') {
  figma.showUI(__html__, { width: 420, height: 520, themeColors: true });
  figma.ui.onmessage = async (msg) => {
    try {
      if (msg.type === 'export') {
        const files = await baselineExport();
        figma.ui.postMessage({ type: 'exported', files });
      } else if (msg.type === 'import-theme') {
        const result = await baselineImportTheme(JSON.parse(msg.json));
        figma.ui.postMessage({ type: 'imported', result });
      }
    } catch (e) {
      figma.ui.postMessage({ type: 'error', message: String(e && e.message ? e.message : e) });
    }
  };
}
