# Baseline

A small, themeable design system for personal projects, built so that any new project can **clone the repo, duplicate the Figma file, swap one theme file, and start**.

- **Figma is the source of truth.** Variables in *Baseline – Foundation* are exported to [`tokens/`](tokens/) as DTCG JSON.
- **One theme file per project.** Everything brand-specific (color ramps, fonts, corner shapes) lives in [`tokens/theme.tokens.json`](tokens/theme.tokens.json). Semantics and components never change between projects.
- **Framework-agnostic CSS.** [`dist/baseline.css`](dist/baseline.css) is plain CSS custom properties and `bl-` classes. It works in a static site, a résumé template, or any framework.
- **Zero dependencies.** The build, contrast check and ramp generator are plain Node (≥18).

```
Figma variables ──(Baseline Tokens plugin: Export)──▶ tokens/*.tokens.json ──(npm run build)──▶ dist/
       ▲                                                                                      │
       └──(plugin: Import theme)── themes/<project>.tokens.json ◀──(npm run ramp)── brand hexes
```

## Use it

```html
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Libre+Franklin:wght@400;500;600;800&display=swap">
<link rel="stylesheet" href="baseline/dist/baseline.css">

<button class="bl-button">Save</button>
<div class="bl-callout bl-callout--affirm" role="status">…</div>
```

Open [`examples/index.html`](examples/index.html) for every component in light and dark mode. Set `data-theme="dark"` or `"light"` on `<html>` (or any subtree) to force a mode; otherwise it follows the OS.

## Scripts

| Command | What it does |
|---|---|
| `npm run build` | `tokens/` → `dist/tokens.css`, `typography.css`, `tokens.json`, `baseline.css` |
| `npm run check` | WCAG contrast audit of 58 semantic pairings × light/dark; exits non-zero on failure |
| `npm run ramp -- --primary "#hex@700" …` | Generates role ramps for a new theme from brand colors |
| `node scripts/build.mjs --theme themes/x.tokens.json` | Builds with a different theme without touching `tokens/` |

## Repo map

| Path | Contents |
|---|---|
| `tokens/` | Figma export. **Don't hand-edit** except `theme.tokens.json` when bootstrapping a new project |
| `css/` | Hand-written base + component CSS (consumes tokens only) |
| `dist/` | Generated. Committed so projects can use it without running Node |
| `figma-plugin/` | *Baseline Tokens* plugin: export variables → DTCG, import a theme |
| `scripts/` | build, contrast check, ramp generator |
| `assets/icons/` | Phosphor Light icons (MIT), named to match the Figma components, plus an SVG sprite |
| `docs/` | Foundations, components, architecture, and the new-project guide |
| `AGENTS.md` | Rules for AI coding tools working in a Baseline project |

## Docs

- [Start a new project from Baseline](docs/new-project.md)
- [Architecture: token layers, naming, pipeline](docs/architecture.md)
- Foundations: [color](docs/foundations/color.md) · [typography](docs/foundations/typography.md) · [spacing & shape](docs/foundations/spacing.md) · [elevation](docs/foundations/elevation.md) · [interaction states](docs/foundations/interaction-states.md) · [motion](docs/foundations/motion.md) · [messaging (GAIWA)](docs/foundations/messaging.md) · [icons](docs/foundations/icons.md)
- Components: [button](docs/components/button.md) · [icon button](docs/components/icon-button.md) · [input](docs/components/input.md) · [tag](docs/components/tag.md) · [callout](docs/components/callout.md) · [card](docs/components/card.md)

## Figma

[Baseline – Foundation](https://www.figma.com/design/7v2384JjfFAJUEqUFEzM55/Baseline---Foundation): variables, text and effect styles, the brand color register, and the component pages (Icons, Button + Icon Button, Input, Tag, Callout, Card).
