Follow [AGENTS.md](AGENTS.md) for all UI work in this repo.

Repo-specific notes:
- `tokens/*.tokens.json` are exported from the Figma file *Baseline – Foundation* (file key `7v2384JjfFAJUEqUFEzM55`). When the Figma MCP is available, the export logic in `figma-plugin/code.js` (`baselineExport`) can be run directly with `use_figma`. Returns over ~48KB must be split across calls.
- After any token change: `npm run build && npm run check`, then visually check `examples/index.html` in light and dark mode.
- Keep `dist/` committed. Consumers rely on it without running Node.
