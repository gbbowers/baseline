# Button

Triggers an action. For navigation, use a link; you can style an `<a>` as a button when it should look like one.

**Figma:** `Button` (Style × Size × State, 45 variants). Properties: *Label*, *Leading icon* + swap, *Trailing icon* + swap.
**CSS:** `css/components/button.css`

```html
<button class="bl-button">Save changes</button>
<button class="bl-button bl-button--secondary">Cancel</button>
<a class="bl-button bl-button--tertiary" href="/docs">Read the docs</a>
<button class="bl-button bl-button--secondary bl-button--sm"><svg aria-hidden="true">…plus…</svg>Add</button>
```

## Styles

| Style | Class | Use |
|---|---|---|
| **Primary** | (default) | The single most important action in a view. **One per view.** |
| **Secondary** | `--secondary` | Supporting actions alongside a Primary, or the main action where nothing should shout |
| **Tertiary** | `--tertiary` | Low-emphasis and inline actions, toolbars, dismiss buttons |

There's no "destructive" style. For irreversible actions, confirm with a dialog that explains the consequence, and make the confirm button a neutral Primary labelled with the verb ("Delete project"). Red buttons teach people to fear the color rather than read the label.

## Sizes

| Size | Class | Height | Label | Icon |
|---|---|---|---|---|
| Small | `--sm` | `control/32` | `Label` 14 | 16 |
| Medium | (default) | `control/40` | `Label-L` 16 | 20 |
| Large | `--lg` | `control/48` | `Label-L` 16 | 20 |

Icon-only: use [Icon Button](icon-button.md) (`bl-icon-button`). `--icon` remains for making another Button style square, and still needs an `aria-label`.

## States

Default, Hover, Pressed, Focus and Disabled. See [interaction states](../foundations/interaction-states.md). For disabled, prefer `aria-disabled="true"` so the button can explain itself.

## Tokens

`action/{primary,secondary}/*`, `action/tertiary/fg`, `surface/hover`, `surface/pressed`, `action/disabled/*`, `control/*`, `spacing/*`, `shape/radius-control`, `stroke/1`, `border/focus`.

## Writing labels

Start with a verb and say what happens: "Save changes", "Send invite", "Export PDF". Avoid "OK", "Submit" and "Click here". Use sentence case.
