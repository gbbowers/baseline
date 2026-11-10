# Icon Button

An action shown only as an icon. Styled like a [Tertiary button](button.md): no fill at rest, a neutral surface on hover and press. Use it for compact, familiar, repeated actions such as close, search, more options, previous and next.

**Figma:** `Icon Button` on the Button page (Size × State, 15 variants). Properties: *Icon* (instance swap, any `Icon/*` component) and *Accessible label* (text, on a hidden layer).
**CSS:** `css/components/icon-button.css`

```html
<button class="bl-icon-button" aria-label="Search">
  <svg aria-hidden="true" focusable="false"><use href="#i-magnifying-glass"/></svg>
</button>

<button class="bl-icon-button bl-icon-button--sm" aria-label="Dismiss message">
  <svg aria-hidden="true" focusable="false"><use href="#i-x"/></svg>
</button>

<a class="bl-icon-button bl-icon-button--lg" href="/search" aria-label="Search the site">
  <svg aria-hidden="true" focusable="false"><use href="#i-magnifying-glass"/></svg>
</a>
```

## Sizes

| Size | Class | Box | Icon |
|---|---|---|---|
| Small | `--sm` | `control/32` | `icon/16` |
| Medium | (default) | `control/40` | `icon/20` |
| Large | `--lg` | `control/48` | `icon/24` |

Heights match Button, so an Icon Button sits on the same line as a text button of the same size. Large uses a 24px icon, one step up from Button's 20, because a lone Light-weight glyph looks underweight in a 48px box.

## States

Default, Hover, Pressed, Focus and Disabled, the same as Button. See [interaction states](../foundations/interaction-states.md). Focus uses the global `:focus-visible` ring; the Figma Focus variant is for handoff only.

## Accessible labelling (required)

An icon has no text, so the control has no accessible name unless you give it one. **Every Icon Button needs a label.**

- **Name the control, hide the icon.** Put `aria-label` on the `<button>` or `<a>`, and `aria-hidden="true" focusable="false"` on the SVG. Don't put `<title>` or `aria-label` on the SVG as well; that can announce the name twice.
- **Say what it does, not what it shows.** "Search", "Close dialog", "Remove Ana from the list". Not "Magnifying glass", "X" or "Icon".
- **Be specific when there are several.** A list with ten "Delete" buttons needs "Delete invoice 2041", or `aria-labelledby` that combines the button with the row's title (`aria-labelledby="btn-del-2041 row-2041-title"`).
- **Reuse visible text when it exists.** If a heading or label on screen already names the action, point to it with `aria-labelledby` instead of duplicating it in `aria-label`, so the two can't drift apart.
- **Toggles keep one label.** For an on/off action (mute, bookmark, show password), keep the label constant and expose state with `aria-pressed="true|false"`. Don't flip the label to "Unmute" *and* set `aria-pressed`; that's announced as "Unmute, pressed".
- **Translate it.** The label is user-facing copy. Run it through the same i18n as visible text.
- **`title` isn't a label.** Browsers don't show it on touch or keyboard focus, and screen readers handle it inconsistently. If sighted users also need the name, add a tooltip that appears on hover *and* focus, and keep `aria-label` as the source of truth.
- **Disabled.** Prefer `aria-disabled="true"` so the button stays focusable and its label is still read. Don't rely on a disabled icon alone to explain why; say why nearby.
- **Use a real `<button>` (or `<a href>` for navigation).** Never a `<div>` or `<span>` with a click handler.

**In Figma**, fill in the *Accessible label* property on every instance. It sits on a hidden layer (`a11y-label`) so it doesn't render but shows up in Dev Mode, which gives engineering the `aria-label` with the design.

## Target size

Small (32px) passes WCAG 2.2 AA Target Size (2.5.8, 24px minimum). It's under the 44px AAA guidance and Apple's 44pt touch target, so on touch-first layouts prefer Medium or Large, or keep 8px clear between adjacent small targets.

## When not to use it

- **The icon isn't universally understood.** If you'd hesitate to name it, use a Button with a label (and the icon as a leading icon).
- **It's the main action in a view.** Use a Primary [Button](button.md) with text.
- **It needs emphasis.** Icon Button is tertiary only. If a toolbar action needs more weight, use a Secondary Button with a label.

## Tokens

`action/tertiary/fg`, `surface/hover`, `surface/pressed`, `action/disabled/fg`, `control/32|40|48`, `icon/16|20|24`, `shape/radius-control`, `stroke/1`, `border/focus`.

## Relationship to `bl-button--icon`

`bl-button--icon` still exists. It makes any Button style square (for example a Secondary icon-only button, or the numbered pages in pagination). For a standard icon-only action, use `bl-icon-button`.
