# Messaging — GAIWA

GAIWA is Baseline's five-type framework for how an interface talks to people in context: **G**uide, **A**ffirm, **I**nform, **W**arn, **A**lert. The name is also a nudge toward Gaia, a reminder to stay human in how messages are written.

Each type has its own color ramp and its own icon. In UI they appear as [Callouts](../components/callout.md) and [Tags](../components/tag.md).

| Type | Persona | Ramp | Icon | ARIA |
|---|---|---|---|---|
| **Guide** | The helpful coach | `guide` (purple) | `guide` (Phosphor lightbulb) | `role="status"` |
| **Affirm** | The encouraging coach | `affirm` (green) | `affirm` (Phosphor check-square) | `role="status"` |
| **Inform** | The seasoned coworker at the next desk | `inform` (blue) | `inform` (Phosphor info) | `role="status"` |
| **Warn** | The mentor helping you course-correct | `warn` (yellow) | `warn` (Phosphor warning) | `role="status"` |
| **Alert** | Urgent, explained in plain language | `alert` (red) | `alert` (Phosphor warning-diamond) | `role="alert"` |

## The five types

**Guide** adds tips and instruction that help people level up.
✔ Point out a faster way to do what they're doing manually, or why a tedious step pays off.
✘ Narrate what's already visible ("Select an option above").

**Affirm** confirms that something good happened, or that something is in a good state.
✔ Remove ambiguity after a meaningful action: what's done, and what's next.
✘ Celebrate every click.

**Inform** puts the context needed to decide or act where it's needed.
✔ Answer the question someone would ask next.
✘ Add an ⓘ with nothing useful behind it. Don't make Inform look like a link.

**Warn** steers people away from trouble before it happens.
✔ Place it *before* the spot where common mistakes occur. Make it measured and reassuring: it's fixable.
✘ Use alarming framing for something routine.

**Alert** reports something urgent or negative, with a next step.
✔ Say what happened and what to do. If it isn't their fault, say so.
✘ Blame people, use red text, or fire on a typo. Use it sparingly, because overuse erodes it.

## Color and icon rules

- **Text stays grey.** Titles use `text/strong` and copy uses `text/default`, even on a tinted surface. The surface, border and icon carry the type.
- **Never rely on color alone.** Pair it with the icon, a label, or both.
- **Icons are type-locked.** A type's standard icon never appears in another type's color: no green warning triangles and no red checkmarks.
- **GAIWA colors don't decorate controls.** A Save/Discard pair isn't green/red. Use neutral buttons and let the copy explain.
- Inform icons may go greyscale where blue could be mistaken for a link.

## Status vs. message

A status (a Tag) says **what state something is in**. A message (a Callout) says **what to do about it**. Map each status to a GAIWA type: overdue is Warn or Alert, synced is Inform or Affirm. Always show the plain-language label, never an internal enum.

## Writing

Lead with what the person needs to know. Use plain language, short sentences and specific nouns. If the message suggests an action, put that action in or right next to the message.
