# Color

Baseline's palette has a botanical character: **Evergreen depth, Lime energy, the warmth of earth.** The *Color* page in Figma is the brand register. This doc covers how the palette is structured and how to use it in UI.

Values aren't repeated here because they drift. See `tokens/theme.tokens.json`, or open `examples/index.html` to see every ramp.

## Structure

| Ramp | Role | Baseline anchor |
|---|---|---|
| `primary` | Actions, links, brand surfaces | Evergreen = `primary/700` |
| `accent` | Emphasis, highlight, dark-mode actions | Lime = `accent/200` |
| `secondary` | Warmth: illustration, warm surfaces | Clay = `secondary/300`, Burnt orange = `secondary/500` |
| `neutral` | Text, borders, surfaces (most of the UI) | Soft white `050`, Cream `100`, Warm stone `300`, Charcoal `700` |
| `guide` · `affirm` · `inform` · `warn` · `alert` | GAIWA messaging only | purple · green · blue · yellow · red |
| `alpha/*` | Hover and pressed overlays, scrim, shadows | black/white at 8, 16, 48 and 64% |

Steps run `050` (lightest) to `900` (darkest). Two steps are load-bearing: `500` is the 3:1 floor for icons, borders and large text, and `600` is the 4.5:1 floor for body text. Both are measured against the page.

## Semantic tokens: the daily vocabulary

Components and layouts use these, never ramps.

| Group | Tokens | Notes |
|---|---|---|
| `text/` | `default`, `strong`, `subtle`, `disabled`, `inverse`, `link`, `link-hover` | `subtle` is still AA (neutral/600), not a decorative grey |
| `surface/` | `page`, `default`, `raised`, `sunken`, `inverse`, `brand`, `highlight`, `warm`, `selected`, `hover`, `pressed`, `scrim` | `hover`/`pressed` are translucent overlays, so they work on any surface |
| `border/` | `faint`, `default`, `strong`, `input`, `input-hover`, `focus` | `input` is 3:1 against the surface (WCAG 1.4.11) |
| `action/` | `primary/{bg,bg-hover,bg-pressed,fg}`, `secondary/{…,border,fg}`, `tertiary/fg`, `disabled/{bg,fg}` | Buttons and button-like controls |
| `feedback/{type}/` | `bg`, `bg-subtle`, `border`, `icon`, `bg-strong`, `fg-on-strong` | One set per GAIWA type |
| `elevation/` | `shadow`, `shadow-strong` | Used by the elevation effect styles |

### Light and dark

The semantic collection has **Light** and **Dark** modes. Primitives don't change between modes; only the role assignments flip. The signature move: Evergreen actions on light become **Lime** actions on dark, with dark text on the button.

In CSS, dark mode follows `prefers-color-scheme` unless you set `data-theme="light"` or `"dark"` on `<html>` or any subtree.

## Rules

- **Use semantic tokens.** If you're typing a ramp name in component code, there's a missing semantic token. Add it in Figma.
- **Text stays in the neutral scale,** except links. A Guide callout on a purple surface still has grey text. Color and icon carry the meaning.
- **Never rely on color alone** for status. Pair it with an icon or a label.
- **Brand colors are for brand moments.** `brand/*` and the `secondary` ramp are for logos, illustration and editorial accents, not UI states. Burnt orange isn't an error color, and Lime isn't a success color.
- **Inform isn't a link.** Informational blue lives on `feedback/inform/*` surfaces. Never use `text/link` for non-interactive text.
- **Alert is rare.** It's the loudest signal in the system; overuse erodes it.
- **Check contrast after any change:** `npm run check` covers 58 pairings in each mode.

## Production note

Figma values are sRGB. CMYK on the Color page is an unprofiled approximation, so convert through your printer's ICC profile for print.
