# Icons

Baseline uses **[Phosphor](https://phosphoricons.com)** (MIT), **Light weight**: a calm, fine line that matches the botanical, editorial tone and sits lightly next to Libre Franklin. Being MIT-licensed is what lets it ship inside a repo you clone into every project. (BENDS used Font Awesome Pro, which can't be redistributed that way.)

The icons the components use are in `assets/icons/` (individual SVGs, plus `sprite.svg` with `<symbol id="i-{name}">`) and on the **Icons** page in Figma as `Icon/{name}` components. File names and sprite ids match the Figma component names; [`assets/icons/README.md`](../../assets/icons/README.md) maps each one to its Phosphor source. For anything else, install `@phosphor-icons/core` (raw SVGs; use `assets/light/`) or `@phosphor-icons/web` (icon font), or copy from phosphoricons.com.

## Using icons

```html
<!-- inline -->
<svg class="bl-icon" aria-hidden="true" viewBox="0 0 256 256"><path d="…"/></svg>

<!-- sprite (inline sprite.svg once per page) -->
<svg class="bl-icon" aria-hidden="true"><use href="#i-inform"/></svg>
```

- Color follows `currentColor`. Set color on the parent, not on the icon.
- Decorative icons get `aria-hidden="true"`. Icon-only buttons need an `aria-label` on the button.
- In Figma, Button exposes **Leading/Trailing icon swap** properties. Elsewhere, use a normal instance swap to any `Icon/*` component. Recolor through the icon's `Vector` layer fill.

## Sizes

| Token | px | Use |
|---|---|---|
| `icon/16` | 16 | Dense UI: small buttons, tags, helper text |
| `icon/20` | 20 | **Default**: medium and large buttons, inputs |
| `icon/24` | 24 | Callouts, navigation |
| `icon/32`–`48` | 32–48 | Empty states, feature callouts |

Classes: `.bl-icon` (20), `.bl-icon--16`, `--24`, `--32`.

## Color

| Context | Token |
|---|---|
| Next to text | Inherit (`currentColor`) |
| Standalone neutral icon | `text/subtle`, which meets 3:1 |
| Interactive (inside a button or link) | Inherit from the control |
| GAIWA | `feedback/{type}/icon`, only with that type's standard icon |

## GAIWA icon set

| Type | Figma / sprite (Phosphor source) |
|---|---|
| Guide | `Icon/guide` / `#i-guide` (lightbulb) |
| Affirm | `Icon/affirm` / `#i-affirm` (check-square) |
| Inform | `Icon/inform` / `#i-inform` (info) |
| Warn | `Icon/warn` / `#i-warn` (warning) |
| Alert | `Icon/alert` / `#i-alert` (warning-diamond) |

## Rules

- One weight everywhere: Light. Don't mix in Regular, Bold or Fill.
- Light strokes are thin at 16px. On busy or tinted surfaces, step the icon up to 20 rather than switching weight.
- Icon sizes come from `icon/*`; containers are square and on the scale.
- Never use icon color alone to carry meaning.
- Don't add licensed icon sets (Font Awesome Pro and similar) to this repo.
