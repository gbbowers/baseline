# Callout

An inline message block for the five [GAIWA](../foundations/messaging.md) types.

**Figma:** `Callout` (Type = Guide, Affirm, Inform, Warn, Alert). Properties: *Title*, *Body*, *Show title*, *Dismissible*.
**CSS:** `css/components/callout.css`

```html
<div class="bl-callout bl-callout--warn" role="status">
  <svg aria-hidden="true">…warning…</svg>
  <div class="bl-callout__body">
    <p class="bl-callout__title">Renewal reminders are off</p>
    <p class="bl-callout__text">With less than 30 days left, we won't send reminders. Set one manually if you need it.</p>
  </div>
  <button class="bl-button bl-button--tertiary bl-button--sm bl-button--icon bl-callout__dismiss" aria-label="Dismiss">
    <svg aria-hidden="true">…x…</svg>
  </button>
</div>
```

## Anatomy

| Part | Token |
|---|---|
| Surface / border | `feedback/{type}/bg`, `feedback/{type}/border` |
| Icon (24) | `feedback/{type}/icon`, using the type's standard icon only |
| Title | `Label-L`, `text/strong` |
| Body | `Body-S`, `text/default` |
| Dismiss | Tertiary icon button, small |

Padding is 16, the gap is 12, and the radius is `shape/radius-control`.

## Guidance

- **ARIA:** `role="status"` for Guide, Affirm, Inform and Warn. `role="alert"` for Alert only, because it interrupts screen readers.
- **Text stays grey** in every type.
- One callout per region. Stacking several callouts dilutes all of them, so merge or prioritise.
- Only make a callout dismissible when it's safe to lose. Alerts about unresolved problems shouldn't be dismissible.
- Put an action button inside the body if the message suggests one. Use a Tertiary or Secondary small button, never a Primary.
