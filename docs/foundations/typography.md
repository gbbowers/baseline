# Typography

Baseline uses **Libre Franklin**: a sturdy American grotesque with editorial heritage, warm enough for a portfolio and tight enough for dense UI. It ships as two theme tokens, `font/body` and `font/display`, which are the same family by default. A project can split them (for example, a serif display face) without touching any style.

| Token | CSS | Default |
|---|---|---|
| `font/body` → `Family/Body` | `--font-family-body` | Libre Franklin |
| `font/display` → `Family/Display` | `--font-family-display` | Libre Franklin |

The build appends a system fallback stack. Load the web font in the host app; `dist/` doesn't bundle font files.

## Scale

Sizes and line heights sit on the base-4 scale, with one deliberate exception: **14px** (`Size/14`, line height 20) is the dense-UI size that the base-4 scale doesn't produce. Every line height is a multiple of 4.

| Style | Family | Weight | Size / line | Use |
|---|---|---|---|---|
| `Display` | display | ExtraBold | 96 / 112, −1.5% | Large-scale hero |
| `Display-S` | display | ExtraBold | 80 / 96, −1.5% | Statement text |
| `Headline-L` | display | ExtraBold | 64 / 72, −1.5% | Hero headlines |
| `Headline` | display | SemiBold | 56 / 64 | Editorial titles |
| `Headline-S` | display | SemiBold | 48 / 56 | Feature headlines |
| `Section heading` | body | SemiBold | 40 / 48 | Marketing content sections |
| `Page heading-L` | body | SemiBold | 32 / 44 | App: primary page titles |
| `Page heading` | body | SemiBold | 28 / 40 | App: compact page titles |
| `Section title` | body | SemiBold | 24 / 32 | Panels and content groups |
| `Lead \| Card Title` | body | Medium | 20 / 28 | Introductions, card titles |
| `Body-L` | body | Regular | 16 / 24 | Default copy |
| `Body-S` | body | Regular | 14 / 20 | Dense copy, tables |
| `Caption` | body | Regular | 12 / 16 | Metadata, helper text |
| `Label-L` | body | SemiBold | 16 / 24 | Medium and large buttons |
| `Label` | body | SemiBold | 14 / 20 | Small buttons, form labels |
| `Label-S` | body | SemiBold | 12 / 16 | Tags, eyebrows |

In CSS every style is a class: `.bl-text-display`, `.bl-text-body-l`, `.bl-text-lead-card-title`, and so on. Components set their own type from the same tokens, so you don't need to add these classes to component markup.

## Guidance

- **Display tier (`Display` → `Headline-S`) is for marketing and editorial pages.** App screens top out at `Page heading-L`.
- **Weight carries hierarchy before size does.** Labels are SemiBold at body sizes rather than larger Regular text.
- **Eyebrows** use `Label-S`, uppercase, with 0.04em tracking (`.bl-card__eyebrow`). Don't uppercase anything else.
- **Measure:** keep running copy to roughly 60–75 characters (`max-width: 64ch`).
- **Color:** headings use `text/strong`, copy uses `text/default`, and secondary copy uses `text/subtle`. Never use feedback colors for text.
