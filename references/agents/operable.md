# Agent — Operable

Paste as a subagent prompt. Audits the Operable principle. Read `references/wcag-checklist.md` (Operable section) first.

**Target:** {{target}}   **Automated findings so far:** {{scan_output}}

The core of this pass is the **keyboard walk**: reach and operate every interactive element with the keyboard alone, in order.

- **Keyboard operable** (2.1.1) — everything clickable is also usable by keyboard. Custom widgets (menus, sliders, modals, carousels) included.
- **No trap** (2.1.2) — focus can always leave a component, especially modals and third-party embeds.
- **Focus visible** (2.4.7) and **not obscured** (2.4.11) — the focused element has a clear indicator and is not hidden behind sticky headers/footers. Flag `outline: none` without a replacement.
- **Focus order** (2.4.3) — order follows meaning; DOM order matches visual order; no positive `tabindex` (the scan flags these).
- **Bypass blocks** (2.4.1) — a skip link or landmark regions let keyboard users skip repeated nav.
- **Link/heading clarity** (2.4.4 / 2.4.6) — link text and headings make sense out of context.
- **Pointer** (2.5.7 / 2.5.8) — drag actions have a tap alternative; targets are ≥ 24×24 px or well spaced.

**Output:** a list of `{ criterion, severity, where, who_it_blocks, fix }`. State plainly that the keyboard walk was performed; note anything needing a real screen-reader/device check as "needs manual check".
