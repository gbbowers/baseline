# Working in a Baseline project — rules for AI coding tools

These rules apply to Claude, Copilot, Cursor and any other assistant editing UI in a project that uses Baseline. They are short on purpose. The reasoning lives in `docs/`.

## Tokens, never literals
- Every color, space, radius, size, font, shadow, duration and easing comes from a CSS custom property in `dist/tokens.css`. **Never write a hex, rgb(), px spacing or ms duration in component CSS.**
- Use the **semantic** layer (`--color-text-default`, `--color-surface-page`, `--color-action-primary-bg`, `--color-feedback-warn-icon`, …). Primitives (`--primary-700`, `--neutral-300`, `--guide-600`) are for the theme layer only.
- If no token fits, stop and say so. Don't invent a value or a new token in code: tokens are added in Figma and exported.
- `dist/` and `tokens/` are generated. Change values in Figma → export → `npm run build`. The exception is bootstrapping a new project's `tokens/theme.tokens.json`.

## Components
- Reuse `bl-` classes (`bl-button`, `bl-field`/`bl-input`, `bl-tag`, `bl-callout`, `bl-card`) before writing new UI. Modifiers use `--` (`bl-button--secondary`, `bl-tag--alert`). Elements use `__` (`bl-card__title`).
- New component CSS follows the same pattern: private `--_*` custom properties set from semantic tokens, with variants that only reassign them.
- One Primary button per view. Pill/round shapes come from `--shape-radius-*`; don't hardcode `border-radius`.

## Color and messaging (GAIWA)
- Message types: **Guide** (coach), **Affirm** (success), **Inform** (context), **Warn** (caution), **Alert** (urgent). Use `bl-callout--{type}` / `bl-tag--{type}`.
- **Text stays grey.** Never color body text or headings with a feedback color; the icon, border and surface carry the type.
- Never rely on color alone. Pair every status color with an icon or a text label.
- `role="alert"` only for Alert; the other types use `role="status"`.
- Inform must not look like a link. Never use `--color-text-link` for non-interactive text.

## Accessibility
- Keep the global `:focus-visible` ring. Never `outline: none` without an equivalent indicator.
- Prefer `aria-disabled="true"` plus an explanation over `disabled` when the user needs to know why.
- Icon-only buttons need `aria-label`; decorative SVGs need `aria-hidden="true"`.
- After changing any color token, run `npm run check`. It must pass.

## Icons
- Phosphor (MIT), **Light** weight, via inline SVG or `assets/icons/sprite.svg`. Use the Figma names (`#i-guide`, `#i-alert`, …), not Phosphor names. Size with `--icon-*` tokens; color follows `currentColor`.
- Do not add Font Awesome Pro or other licensed sets to this repo.
