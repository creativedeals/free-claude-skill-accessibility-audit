# Agent — Robust

Paste as a subagent prompt. Audits the Robust principle. Read `references/wcag-checklist.md` (Robust section) first.

**Target:** {{target}}   **Automated findings so far:** {{scan_output}}

- **Name, role, value** (4.1.2) — every interactive component exposes a correct accessible name, a correct role, and its current state to assistive tech. Custom widgets built from `<div>`/`<span>` must supply these; native elements get them for free.
- **Prefer native over ARIA** — flag ARIA that reinvents a native element (a `role="button"` on a `<div>` where a `<button>` belongs), and ARIA that is wrong or contradictory (mismatched roles, stale `aria-expanded`, `aria-hidden` on focusable content).
- **Status messages** (4.1.3) — dynamic updates (saved, error, "3 results") are announced via an appropriate live region (`aria-live`, `role="status"`/`alert`) without stealing focus.
- **Valid, well-formed markup** — no duplicate `id`s, elements properly nested and closed, form controls correctly associated. Untitled iframes and empty controls are flagged by the scan; confirm the fixes.

Where possible, confirm the accessible name/role/state as a screen reader would report them, not just from the source.

**Output:** a list of `{ criterion, severity, where, who_it_blocks, fix }`. Give the correct native-HTML fix first; only prescribe ARIA when native markup cannot express it.
