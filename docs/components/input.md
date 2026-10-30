# Input

A single-line text field with a label, optional leading icon and helper text. The same classes style `<textarea>`.

**Figma:** `Input` (State = Default, Hover, Focus, Error, Disabled). Properties: *Label*, *Value*, *Helper text*, *Show label*, *Show helper*, *Leading icon*.
**CSS:** `css/components/input.css`

```html
<div class="bl-field">
  <label class="bl-field__label" for="email">Email</label>
  <input class="bl-input" id="email" type="email" autocomplete="email" aria-describedby="email-help">
  <p class="bl-field__help" id="email-help">We'll only use this for receipts.</p>
</div>

<!-- error -->
<input class="bl-input" … aria-invalid="true" aria-describedby="email-err">
<p class="bl-field__help bl-field__help--error" id="email-err"><svg aria-hidden="true">…alert…</svg>Add the rest of the address, like jane@example.com.</p>

<!-- leading icon -->
<div class="bl-input-group"><svg aria-hidden="true">…</svg><input class="bl-input" type="search"></div>
```

## Anatomy

| Part | Style | Token |
|---|---|---|
| Label | `Label` 14 SemiBold | `text/default` |
| Field | 40px high, 12px padding, `Body-L` | `surface/default`, `border/input` |
| Placeholder | `Body-L` | `text/subtle` |
| Helper | `Caption` 12 | `text/subtle` |

## States

| State | Treatment |
|---|---|
| Hover | Border → `border/input-hover` |
| Focus | 2px `border/focus` (border + 1px ring, no layout shift) |
| Error | 2px `feedback/alert/icon` border, plus an alert icon in the helper. **Helper text stays grey** |
| Disabled | `action/disabled/bg` with `text/disabled`. Consider a read-only value instead |

## Guidance

- Always use a visible label. Placeholder text isn't a label.
- Validate on blur or submit, not on every keystroke.
- Error copy says how to fix the problem, not just that something's wrong (see [GAIWA Alert](../foundations/messaging.md)).
- Tie help and error text to the input with `aria-describedby`.
