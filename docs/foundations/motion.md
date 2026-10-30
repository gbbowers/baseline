# Motion

Motion is functional: it tells someone **what just happened** — something arrived, left, or changed. If an animation doesn't answer that, leave it out.

## Principles

- **Purposeful.** Entry shows where something came from; exit confirms it's gone.
- **Calm.** Short and quiet. No bouncing, looping or attention-seeking.
- **Spatially consistent.** Overlays (dialogs) fade or scale in place; edge-anchored layers (sheets, drawers) slide from their edge; in-place updates crossfade.
- **Optional.** Nothing should require motion to be understood.

## Tokens (`Baseline / Motion`)

| Token | Value | CSS | Use |
|---|---|---|---|
| `duration/instant` | 0ms | `--duration-instant` | State that should feel immediate |
| `duration/fast` | 120ms | `--duration-fast` | Hover/press color, focus, tooltips, small inline changes |
| `duration/base` | 200ms | `--duration-base` | Dialog and sheet enter/exit, expanding panels |
| `duration/slow` | 320ms | `--duration-slow` | Larger layout transitions where orientation needs time |
| `easing/standard` | `cubic-bezier(0.2, 0, 0, 1)` | `--easing-standard` | Things moving or changing within the view |
| `easing/enter` | `cubic-bezier(0, 0, 0.2, 1)` | `--easing-enter` | Arriving: decelerates into place |
| `easing/exit` | `cubic-bezier(0.4, 0, 1, 1)` | `--easing-exit` | Leaving: accelerates away |

Exits can run slightly faster than entries (use `fast` for an exit when `base` was the entry).

## Rules

- Animate entry and exit, not idle state.
- Never block interaction. A dialog is operable as soon as it's visible, even mid-transition.
- Don't animate layout shifts caused by data loading.
- Exits aren't optional. Disappearing without a transition is jarring; a short fade is enough.
- Anything that loops longer than 5 seconds needs a pause control (WCAG 2.2.2).

## Reduced motion

`css/base.css` collapses every transition and animation to 1ms under `prefers-reduced-motion: reduce`. Movement becomes immediate, and state still changes. If a component needs a softer fallback, use a short opacity crossfade instead of zero, but never translation or scale.
