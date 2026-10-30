# Architecture

## Token layers

Four layers. Each layer only references the one below it, which is what makes re-theming a one-file change.

| Layer | Figma collection | File | Examples | Who uses it |
|---|---|---|---|---|
| **Scale** | Baseline / Scale primitives | `scale.tokens.json` | `scale/16`, `scale/72` | Nothing directly; it's the raw base-4 geometry |
| **Theme** | Baseline / Theme | `theme.tokens.json` | `primary/700`, `neutral/050`, `guide/600`, `font/body`, `shape/radius-control` | The semantic layer only |
| **System** | Dimension tokens, Typography, Motion | `dimension`, `typography`, `motion` | `spacing/16`, `control/40`, `Size/14`, `duration/fast` | Components and layouts |
| **Semantic color** | Baseline / Color semantic (Light, Dark) | `color.tokens.json` | `text/default`, `surface/page`, `action/primary/bg`, `feedback/warn/icon` | Components and layouts |

Rule: **components bind to the System and Semantic layers only.** If a component references `primary/700`, a new theme can't move it.

### Why role ramps, not hue ramps

Primitives are named for their *role* (`primary`, `accent`, `secondary`, `neutral`, plus the GAIWA ramps `guide`, `affirm`, `inform`, `warn`, `alert`), not their hue. A project whose primary is blue just puts blue into `primary/*`, and nothing downstream renames. The GAIWA ramps keep their hues by convention (guide=purple, affirm=green, inform=blue, warn=yellow, alert=red), but they're still swappable.

### Ramp rules

Every ramp has ten steps, `050`–`900`. Neutral adds `000` (white) and `1000` (black). Steps share lightness targets across families, so `500` in one ramp is about as light as `500` in any other. The accessibility thresholds are baked into the steps:

- `500`: at least **3:1** against the page. This is the floor for icons, borders and large text.
- `600`: at least **4.5:1** against the page. This is the floor for body text.

`npm run ramp` generates ramps that hold these rules, and `npm run check` verifies the actual semantic pairings.

### Brand colors

`brand/*` in the Theme collection are **aliases** into the ramps (`brand/evergreen → primary/700`, `brand/lime → accent/200`), so the brand register and the UI can't drift apart. They're for logos and illustration, not UI states.

### Theme knobs beyond color

| Token | Baseline value | Why it's in Theme |
|---|---|---|
| `font/body`, `font/display` | Libre Franklin / Libre Franklin | The biggest personality lever after color |
| `shape/radius-control` | `radius/8` | Buttons and inputs. Set it to a large value for pill buttons |
| `shape/radius-container` | `radius/16` | Cards |
| `shape/radius-badge` | `radius/4` | Tags |

## Naming

| Thing | Figma | CSS |
|---|---|---|
| Variable | `group/name` (`text/default`) | From the variable's Web code syntax (`--color-text-default`) |
| Primitive | `role/step` (`primary/700`) | `--primary-700` |
| Spacing | `spacing/16` | `--space-16` |
| Text style | `Body-L` | `.bl-text-body-l` |
| Effect style | `Elevation/Raised` | `--shadow-elevation-raised` |
| Component | `Button` with `Style=Secondary, Size=Small` | `.bl-button.bl-button--secondary.bl-button--sm` |

Dimension names are numeric (`spacing/16` rather than `spacing/md`). That's honest about the value and avoids "is md 12 or 16?" debates, but it means density can't be re-themed by remapping names. If a project needs density modes, add a *Density* mode to Dimension tokens. Don't rename the tokens.

## Pipeline

```
Figma (source of truth)
  └─ Baseline Tokens plugin → tokens/*.tokens.json     (DTCG; aliases kept as {refs})
        └─ scripts/build.mjs → dist/tokens.css         (custom properties; semantics use var(--primitive))
                             → dist/typography.css     (.bl-text-* from text styles)
                             → dist/tokens.json        (flat, resolved light/dark values)
                             → dist/baseline.css       (all of the above + css/base.css + css/components/*)
        └─ scripts/check-contrast.mjs                  (WCAG gate on semantic pairs, both modes)
```

Semantic tokens compile to `var(--primitive)` references, not resolved hex. Two consequences:

1. You can re-theme **at runtime** by overriding primitives on a subtree (`.campaign { --primary-700: … }`) without a rebuild.
2. Dark mode only swaps the ~70 semantic declarations; primitives are declared once.

### Decisions and trade-offs

| Decision | Chosen | Alternative | Why |
|---|---|---|---|
| Source of truth | Figma variables | Repo JSON → push to Figma | Design decisions happen in Figma. The cost is that export is a manual plugin click, because the Variables REST API is Enterprise-only |
| Build tool | ~200 lines of zero-dep Node | Style Dictionary | Cloning shouldn't require `npm install`. Move to Style Dictionary v4 when you need iOS/Android outputs or custom transforms; the DTCG files are compatible |
| Components | Plain CSS classes | React / Web Components | Works in résumé templates and static sites. Framework wrappers can sit on top of the classes later |
| Dark mode | Semantic collection with Light/Dark modes | Separate dark primitives | Primitives stay theme-agnostic; only role assignments flip |
| Focus in Figma | Focus variants exist on Button and Input | Code-only (BENDS approach) | Useful for handoff on a personal system; code still uses one global `:focus-visible` ring |
