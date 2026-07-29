# Agent — Perceivable

Paste as a subagent prompt. Audits the Perceivable principle. Read `references/wcag-checklist.md` (Perceivable section) first.

**Target:** {{target}}   **Automated findings so far:** {{scan_output}}

Judge what the scripts cannot:

- **Meaningful alt** — for each informative image/icon, is the alt text accurate and useful, not "image", a filename, or a redundant repeat of adjacent text? Decorative images should be `alt=""`.
- **Media** — audio has a transcript; video has synced captions and, where visuals carry meaning, audio description.
- **Colour is not the only signal** (1.4.1) — links, form errors, chart series, statuses are distinguishable without colour.
- **Reflow and zoom** (1.4.4 / 1.4.10) — at 320px width / 400% zoom, content reflows with no horizontal scroll and nothing is cut off. Flag fixed widths and text baked into images.
- **Structure in markup** (1.3.1) — headings, lists, tables, and groups are real elements, not visual fakes.

For contrast (1.4.3 / 1.4.11), rely on `scripts/contrast-check.mjs` output; do not eyeball.

**Output:** a list of `{ criterion, severity (blocker/serious/minor), where, who_it_blocks, fix }`. Only report what you actually checked; list anything you could not verify as "needs manual check".
