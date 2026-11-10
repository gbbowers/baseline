# Interaction states

One state vocabulary for every interactive component. Component docs reference this page instead of restating it.

| State | Meaning | Figma | CSS |
|---|---|---|---|
| **Default** | Resting | Variant | (base) |
| **Hover** | Pointer over a target that will respond | Variant | `:hover` |
| **Pressed** | Being activated | Variant | `:active` |
| **Focus** | Has keyboard focus | Variant on Button, Icon Button and Input, for handoff only | `:focus-visible` |
| **Disabled** | Unavailable | Variant | `:disabled` / `[aria-disabled="true"]` |
| **Error** | Invalid input (fields only) | Variant | `[aria-invalid="true"]` |

Not every component has every state, and that's deliberate.

## Focus

There's one focus treatment for everything, defined once in `css/base.css`:

```css
:focus-visible { outline: var(--stroke-2) solid var(--color-border-focus); outline-offset: var(--stroke-2); }
```

- It uses **`:focus-visible`**, not `:focus`. Keyboard users get the ring, and pointer users get hover and pressed feedback instead.
- The ring is **additive.** It sits outside the component and doesn't change its fill, border or content.
- It's **the same everywhere.** No per-component colors or offsets, so a keyboard user can track one shape across the whole interface.
- `border/focus` is Primary 500 in light mode and Lime in dark mode. Both are at least 3:1 against every surface, and `npm run check` verifies this.
- **Inputs are the one exception.** They show focus by thickening the border to 2px in `border/focus`, because a ring outside a bordered field reads as a double border.
- Never use `outline: none` without an equivalent visible indicator.

## Disabled: last resort

Show a disabled control only when seeing it helps (for example, a Submit that enables once the form is valid). Before you reach for it:

- **Hide it** if the user can't act on it and doesn't need to know it exists.
- **Lock it** if the value matters but can't change. Render it at full contrast with the affordance removed, and explain why.
- If you must disable, **prefer `aria-disabled="true"`** over the `disabled` attribute. It keeps the control focusable, so it can be described (`aria-describedby`) and can show a tooltip. Block the action in your handler.

Disabled colors (`action/disabled/*`, `text/disabled`) are intentionally below AA. WCAG exempts inactive controls, but that's also why a disabled control can't be the only way you communicate something.
