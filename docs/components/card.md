# Card

A container that groups related content and actions.

**Figma:** `Card` (Elevation = Flat, Raised). Properties: *Show eyebrow*, *Show actions*. Contains a nested `Button` instance.
**CSS:** `css/components/card.css`

```html
<article class="bl-card">
  <div class="bl-card__header">
    <p class="bl-card__eyebrow">Case study</p>
    <h3 class="bl-card__title">Rebuilding onboarding</h3>
  </div>
  <p class="bl-card__body">How a three-step flow replaced a twelve-field form.</p>
  <div class="bl-card__actions">
    <a class="bl-button bl-button--secondary bl-button--sm" href="…">Read the story</a>
  </div>
</article>
```

## Variants

| Elevation | Class | Treatment | Use |
|---|---|---|---|
| **Flat** | (default) | `surface/default` + 1px `border/faint` | Almost everything in a page layout |
| **Raised** | `--raised` | `surface/default` + `Elevation/Raised` shadow, no border | Content that floats or must lift off a same-color surface |

See [elevation](../foundations/elevation.md): surface color first, border second, shadow last.

## Spec

Padding is 24, the gap is 16 (4 between eyebrow and title), and the radius is `shape/radius-container`. The eyebrow is `Label-S` uppercase in `text/subtle`. The title is `Lead | Card Title` in `text/strong`. The body is `Body-S`.

Nested cards (`.bl-card .bl-card`) step down to `shape/radius-control` and sit on `surface/sunken` with no border.

## Guidance

- Use the right heading level for the page outline (`h2`/`h3`). The class controls the look, not the level.
- When the whole card is a link, put the link on the title and stretch its hit area with a pseudo-element. Don't wrap the card in an `<a>` when it also contains other actions.
- Keep a single primary action per card. Additional actions are Tertiary.
