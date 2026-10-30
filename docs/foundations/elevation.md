# Elevation

Depth is communicated with the least visual noise that works, in this order of preference:

1. **Surface color.** Most hierarchy comes from placing surfaces of different values on each other.
2. **Border.** Use it when two adjacent surfaces share a value.
3. **Shadow.** Only for things that genuinely float above the page.

## 1. Surfaces

| Token | Light | Dark | Use |
|---|---|---|---|
| `surface/page` | Soft white | Near-black | The page itself |
| `surface/default` | White | Neutral 800 | Cards and content areas on the page |
| `surface/raised` | White | Neutral 700 | Floating layers. In dark mode, height reads as *lighter* |
| `surface/sunken` | Cream | Neutral 900 | Wells, nested panels, neutral tags |
| `surface/inverse` | Charcoal | Neutral 100 | Strong neutral emphasis |
| `surface/brand` · `highlight` · `warm` | Evergreen · Lime · Clay tint | darker equivalents | Brand moments and editorial bands, not containers for dense UI |
| `surface/selected` | Primary 050 | Primary 900 | Selected rows and items |
| `surface/hover` · `pressed` | 8% / 16% black | 8% / 16% white | Translucent overlays that work on any surface |

Colored GAIWA surfaces communicate *type*, not depth. Don't use a tinted surface to imply something sits higher.

## 2. Borders

`border/faint` for structural lines and flat cards, `border/default` for standard separation, and `border/strong` for emphasis and selection. Prefer a border to a shadow whenever the element isn't floating.

## 3. Shadows

Three effect styles, with colors bound to semantic tokens so they deepen in dark mode:

| Effect style | CSS | Use |
|---|---|---|
| `Elevation/Raised` | `--shadow-elevation-raised` | Cards that must lift off a same-color surface (`.bl-card--raised`) |
| `Elevation/Overlay` | `--shadow-elevation-overlay` | Menus, popovers, tooltips |
| `Elevation/Modal` | `--shadow-elevation-modal` | Dialogs and sheets, always over `surface/scrim` |

For modals, the **scrim** (`surface/scrim`, 48% black in light and 64% in dark) carries the hierarchy. The shadow only reinforces it.

## Rules

- Don't stack shadows. Only the outermost floating element casts one.
- Never use decorative shadows. A shadow on a card flush with the page is noise; use `.bl-card` (flat) instead.
- Shadows stay soft and translucent. If one draws the eye, it's too strong.
