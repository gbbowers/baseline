# Spacing, sizing & shape

Every distance comes from one **base-4 scale** (`Baseline / Scale primitives`): 0, 4, 8, 12, 16, 20, 24, 28, 32, 40, 44, 48, 56, 64, 72, 80, 96, 112, 128, 160, 192, 256, 320, 480, 640, 768, 960, 1280. Purpose-named groups in *Dimension tokens* alias it, and those are what you use.

| Group | Tokens | CSS | Use |
|---|---|---|---|
| `spacing/` | 0, 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96, 128 | `--space-*` | Padding, gaps, margins |
| `control/` | 24, 32, 40, 44, 48, 56, 64 | `--control-*` | Heights of tags (24), buttons and inputs (32/40/48) and touch targets (44) |
| `icon/` | 12, 16, 20, 24, 28, 32, 40, 48 | `--icon-*` | Icon boxes. 20 is the default and 16 is for dense UI |
| `avatar/` | 24–96 | `--avatar-*` | Avatars and thumbnails |
| `layout/` | 256–1280 | `--layout-*` | Max widths and sidebars |
| `radius/` | 0, 4, 8, 12, 16, 24, 32 | `--radius-*` | Raw corner steps; prefer `shape/*` |
| `stroke/` | 1, 2 | `--stroke-*` | Borders (1) and focus rings / emphasis (2). Stays in px |

CSS emits rem (16px base), so spacing respects the user's font size. Strokes stay in px so hairlines stay hairlines.

## Rhythm

- **Inside components:** 4 / 8 / 12 / 16. Use 4 for icon-to-label gaps and 8 for related elements.
- **Between components:** 16 / 24.
- **Between sections:** 32 / 48 / 64. Above 32, move in 16px steps.
- Move through the scale incrementally. Jumping from 8 straight to 48 between adjacent regions creates accidental emphasis.

## Shape (theme knobs)

| Token | Baseline | Applies to |
|---|---|---|
| `shape/radius-control` | `radius/8` | Buttons, inputs, callouts |
| `shape/radius-container` | `radius/16` | Cards, panels |
| `shape/radius-badge` | `radius/4` | Tags |

Components bind to `shape/*`, never to `radius/*`, so a project can go sharp (all `radius/0`) or friendly (`radius-control` = 999 for pills) in one place. Unlike BENDS, Baseline doesn't reserve the pill shape for buttons by default. That's now a per-theme choice.

**Nesting:** an inner container steps down one radius level from its parent (a card at 16 holds panels at 8). `.bl-card .bl-card` does this automatically.

## Rules

- No off-scale values. `48px`, not `50px`. If nothing fits, check the neighbouring step before asking for a new one.
- Icon containers are square and on-scale.
- Interactive targets are at least 32px high on desktop. Use `control/44` for touch-first layouts.
