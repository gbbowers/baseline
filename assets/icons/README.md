# Icons

[Phosphor](https://phosphoricons.com) (MIT, see `LICENSE-phosphor.txt`), **Light** weight. Files and sprite ids use the same names as the Figma components, so design and code say the same thing. The GAIWA icons are named by role (`guide`, `affirm`, `inform`, `warn`, `alert`), so swapping the glyph behind a role doesn't rename anything downstream.

| File / sprite id | Figma component | Phosphor source (light) |
|---|---|---|
| `guide.svg` / `#i-guide` | `Icon/guide` | `lightbulb` |
| `affirm.svg` / `#i-affirm` | `Icon/affirm` | `check-square` |
| `inform.svg` / `#i-inform` | `Icon/inform` | `info` |
| `warn.svg` / `#i-warn` | `Icon/warn` | `warning` |
| `alert.svg` / `#i-alert` | `Icon/alert` | `warning-diamond` |
| `x.svg` / `#i-x` | `Icon/x` | `x` |
| `caret-down.svg` / `#i-caret-down` | `Icon/caret-down` | `caret-down` |
| `magnifying-glass.svg` / `#i-magnifying-glass` | `Icon/magnifying-glass` | `magnifying-glass` |
| `plus.svg` / `#i-plus` | `Icon/plus` | `plus` |
| `arrow-right.svg` / `#i-arrow-right` | `Icon/arrow-right` | `arrow-right` |
| `check.svg` / `#i-check` | `Icon/check` | `check-fat` |

To add an icon: copy `<name>-light.svg` from `@phosphor-icons/core/assets/light/`, save it here under the Figma component's name, add a `<symbol>` to `sprite.svg` and add a row to this table.
