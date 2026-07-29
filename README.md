# Accessibility Audit — WCAG 2.2 AA & EAA Skill for Claude

> A free, open-source **web accessibility audit** as a Claude Skill. It runs objective **WCAG 2.2 AA** checks with two dependency-free scanners (colour-contrast maths + static HTML analysis), then applies structured screen-reader, keyboard, and plain-language judgement to the criteria a script cannot prove — and returns a prioritised list of concrete fixes ranked by how many people each issue blocks.

Built for the era where accessibility is a legal requirement, not a nicety: the **European Accessibility Act (EAA)** applies from **28 June 2025** to a wide range of consumer products and services sold in the EU.

Free to use and share. Made by [CreativeDeals](https://creativedeals.nl).

---

## What it does

`accessibility-audit` is an Agent Skill you drop into Claude Code (or any skill-aware AI assistant). Point it at a URL, an HTML file, or a rendered component and it produces an expert accessibility report:

- **Automated pass** — objective, machine-checkable failures found by the bundled scripts:
  - **Colour-contrast checker** (`contrast-check.mjs`) — exact WCAG contrast-ratio maths for text and UI components (AA / AAA thresholds). Contrast is pure maths, so the verdict is final.
  - **Static HTML scanner** (`a11y-scan.mjs`) — missing `alt` text, unlabelled form controls, empty links and buttons, missing `lang`/`title`, positive `tabindex`, untitled iframes, and broken heading order. Every finding cites its WCAG success criterion.
- **Judgement pass** — the ~70% of accessibility that tools miss, worked through the four WCAG principles (**Perceivable, Operable, Understandable, Robust**): is the alt text *meaningful*, is everything reachable by **keyboard alone**, is focus visible and logical, does the page reflow at 320px / 400% zoom, are errors explained in text, is the **ARIA** correct (or unnecessary)?
- **Prioritised report** — every issue with its WCAG criterion, a severity ranked by *who is blocked from doing what*, and a concrete fix (native HTML preferred over ARIA). Plus an honest note on what was machine-verified versus judged, and an **EAA-readiness** summary when the page is in scope.

Automated tools catch roughly a third of accessibility problems and miss the ones that matter most — an unlabelled button a script sees as "present", a focus order that is valid but nonsensical, alt text that exists but says "image1". This skill does **both halves** and tells you honestly which is which.

## Features

- ✅ **WCAG 2.2 AA and AAA** coverage, grouped by the four principles
- ✅ **Zero dependencies** — the two scanners are plain Node.js (18+), no `npm install`
- ✅ **Real colour-contrast checker** — single pair or a CSV of pairs
- ✅ **Static HTML accessibility scanner** — alt, labels, headings, `tabindex`, iframes, `lang`
- ✅ **Screen-reader & keyboard-navigation** judgement, not just a green checkmark
- ✅ **European Accessibility Act (EAA)** context: scope, dates, microenterprise exemption
- ✅ **Prioritised, fix-first report** — severity by human impact, every finding ships a remedy
- ✅ Runs the four principle passes in **parallel with subagents**, or sequentially without

## Requirements

- An AI assistant that can read a skill folder — [Claude Code](https://claude.com/claude-code) or any Agent Skills host.
- **Node.js 18+** for the two scripts. No dependencies, no build step.

## Installation

Drop the `accessibility-audit/` folder into your skills directory and reload:

```bash
# Claude Code
git clone https://github.com/<your-username>/accessibility-audit.git \
  ~/.claude/skills/accessibility-audit
```

After that you can invoke it as `/accessibility-audit`, or simply ask for an accessibility audit in plain language.

## Usage

Point it at a URL, an HTML file, or a component's markup:

```
Use the accessibility-audit skill on https://example.com/checkout
```

You get a report with a verdict, blockers / serious / minor issues (each with its WCAG criterion, who it blocks, and a concrete fix), a breakdown of what was automated versus judged, and an EAA-readiness note when the page is in scope.

Run the scanners standalone any time:

```bash
# Colour contrast — a single foreground/background pair
node scripts/contrast-check.mjs "#767676" "#ffffff"

# Static HTML accessibility scan
node scripts/a11y-scan.mjs page.html
```

## What's inside

```
accessibility-audit/
  SKILL.md                     Orchestrator: run order, the four-principle passes, output
  references/
    wcag-checklist.md          WCAG 2.2 AA, grouped by principle, with common failures
    eaa-context.md             European Accessibility Act: scope, dates, exemptions
    report-format.md           The prioritised report spec (severity by who-is-blocked)
    agents/
      perceivable.md           One paste-ready agent per WCAG principle
      operable.md
      understandable.md
      robust.md
  scripts/
    contrast-check.mjs         WCAG contrast-ratio maths (single pair or a CSV of pairs)
    a11y-scan.mjs              Static HTML scan (alt, labels, headings, tabindex, iframes)
  README.md
  LICENSE.md
```

## FAQ

**Is this an automated accessibility checker?**
Partly. It runs the objective, automatable checks *and* does the manual keyboard, screen-reader, zoom, and plain-language judgement that automated tools skip — then reports both, clearly labelled.

**Does a clean scan mean my site is accessible?**
No. A clean automated scan only clears the machine-checkable subset (~30%). The report always states which criteria still need a manual screen-reader or device check.

**Does it certify legal compliance with the EAA or WCAG?**
No. It produces an expert audit and a fix list. A formal conformance statement (EN 301 549 / WCAG) is a separate, signed process, and this is not legal advice.

**Which standards does it cover?**
WCAG 2.2 at levels AA (default) and AAA, mapped to the four principles, with European Accessibility Act context for EU products and services.

## License

Free to use. See [`LICENSE.md`](LICENSE.md). Made and shared by [CreativeDeals](https://creativedeals.nl) — a commission-free marketplace for websites, domains, and digital services.

---

<sub>**Keywords:** web accessibility audit · WCAG 2.2 AA · a11y · accessibility checker · colour contrast checker · screen reader testing · keyboard navigation · ARIA · European Accessibility Act · EAA · EN 301 549 · Claude Skill · Claude Code · Agent Skills · Anthropic · accessibility testing tool · alt text · WCAG audit</sub>
