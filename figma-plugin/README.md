# Baseline Tokens (Figma plugin)

A local development plugin that keeps Figma the source of truth for tokens.

**Install once:** Figma desktop → *Plugins → Development → Import plugin from manifest…* → choose `figma-plugin/manifest.json`.

**Export.** Run it in the Baseline file (or a project's duplicate) and click *Export & download*. You get one DTCG file per variable collection plus `styles.tokens.json` (text and effect styles). Move them into `tokens/` and run `npm run build`.

| Figma collection | File |
|---|---|
| Baseline / Theme | `theme.tokens.json`, the per-project file |
| Baseline / Color semantic (Light, Dark) | `color.tokens.json`, with modes in `$extensions["com.figma"].modes` |
| Baseline / Scale primitives | `scale.tokens.json` |
| Baseline / Dimension tokens | `dimension.tokens.json` |
| Baseline / Typography | `typography.tokens.json` |
| Baseline / Motion | `motion.tokens.json` |
| Text + effect styles | `styles.tokens.json` |

CSS variable names come from each variable's **Web code syntax** in Figma. If you rename a variable, also update its code syntax, or the CSS name won't follow.

**Import theme.** Paste a theme file (for example, output of `npm run ramp`) to write values into *Baseline / Theme*. It creates missing variables and never deletes. Aliases can point to any collection (for example, `shape/radius-control → radius/8`).

**Without the plugin.** `code.js` exposes `baselineExport()` and `baselineImportTheme(json)` as plain Plugin API functions, so an agent with the Figma MCP can paste them into `use_figma`. The MCP caps returns at ~48KB, so export in two batches: Theme + Color, then everything else.

Why a plugin? Figma's Variables REST API is Enterprise-only, so on other plans the Plugin API is the only programmatic path.
