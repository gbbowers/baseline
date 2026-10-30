# Tag

A compact, non-interactive label for status or metadata.

**Figma:** `Tag` (Tone = Neutral, Guide, Affirm, Inform, Warn, Alert × Emphasis = Subtle, Strong). Properties: *Label*, *Show icon*.
**CSS:** `css/components/tag.css`

```html
<span class="bl-tag">Draft</span>
<span class="bl-tag bl-tag--affirm"><svg aria-hidden="true">…affirm…</svg>Paid</span>
<span class="bl-tag bl-tag--alert bl-tag--strong"><svg aria-hidden="true">…alert…</svg>Overdue</span>
```

## Tones and emphasis

| | Subtle (default) | Strong (`--strong`) |
|---|---|---|
| Surface | `feedback/{tone}/bg-subtle` | `feedback/{tone}/bg-strong` |
| Text | `text/default` (grey) | `feedback/{tone}/fg-on-strong` |
| Icon | `feedback/{tone}/icon` | same as text |

Neutral uses `surface/sunken` (subtle) and `surface/inverse` (strong).

Use **Subtle** almost always. Use **Strong** for the one status that must be noticed in a dense list. If everything is Strong, nothing is.

## Spec

24px high (`control/24`), 8px side padding, 4px icon gap, `Label-S` (12 SemiBold), 16px icon, `shape/radius-badge`.

## Guidance

- Tags aren't buttons. If it's clickable, it's a filter chip or a button. Build that separately rather than adding hover states to Tag.
- Keep the label to one or two words in plain language: "Due soon", not `STATUS_PENDING_REVIEW`.
- Keep the icon on whenever the tone carries meaning, since color alone isn't enough.
