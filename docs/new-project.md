# Start a new project from Baseline

About 15 minutes from zero to a themed component set in both Figma and code.

## 1. Copy the two halves

```bash
git clone <baseline-repo> my-project-ds && cd my-project-ds
rm -rf .git && git init   # or keep history and add Baseline as an upstream remote
```

In Figma: duplicate **Baseline – Foundation** and rename it (for example, *Acme – Foundation*). Everything travels with the duplicate: variables, styles, components and the color register page. There's no separate component library to re-link.

## 2. Generate a theme from brand colors

Pass each role one or more anchor colors. `@step` pins the color to an exact step; leave it off and the color snaps to the closest lightness.

```bash
npm run ramp -- \
  --primary "#3b5bdb" \
  --accent "#f59f00@300" \
  --neutral "#343a40@700" \
  --font-body "Inter" --font-display "Fraunces" \
  --out themes/acme.tokens.json
```

Roles you skip keep Baseline's values. The output prints each ramp with its 500/600 contrast and flags any ramp that breaks the rule.

Preview it before touching Figma:

```bash
node scripts/build.mjs --theme themes/acme.tokens.json
node scripts/check-contrast.mjs --theme themes/acme.tokens.json
open examples/index.html
```

If a pairing fails, adjust the anchor (usually a darker `neutral` or a different `@step`) and rerun. For example, a cool grey generated from `#343a40` gives a dark-mode input border of only 2.6:1, and the check catches it.

## 3. Push the theme into Figma

In the duplicated file, run **Baseline Tokens → Import theme**, paste `themes/acme.tokens.json` and import. The Theme collection updates, and every semantic token, style and component re-themes with it.

Then finish in Figma, which is now the source of truth again:

- Rename `brand/*` aliases to your brand's names.
- Install the fonts locally if they aren't Google Fonts.
- Adjust `shape/*` if the brand wants sharper or rounder corners.
- Spot-check the component pages in both modes. Switch the *Color semantic* mode on a frame.

## 4. Export and build

**Baseline Tokens → Export & download** → move the files into `tokens/` → `npm run build && npm run check`. Commit `tokens/` and `dist/`.

## 5. Make it yours

- Update `README.md` and the Figma link in `CLAUDE.md`.
- Load your fonts in the host app (`dist/` doesn't bundle font files).
- Delete `themes/` once the theme lives in Figma.

## Keeping in sync with Baseline

Projects own their `theme.tokens.json`. Everything else (semantic mappings, components, scripts) can be pulled from Baseline later. If you keep Baseline as a git remote, `git merge baseline/main` is safe as long as you resolve `tokens/theme.tokens.json` in favour of the project.
