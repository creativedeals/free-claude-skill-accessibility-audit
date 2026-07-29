---
name: accessibility-audit
description: Audit a web page or component against WCAG 2.2 AA and report concrete, prioritised fixes. Use when asked to check accessibility, run a WCAG/a11y audit, fix contrast or screen-reader issues, or prepare for the European Accessibility Act (EAA). Combines two dependency-free scanners (contrast maths + static HTML checks) with agent judgement on the criteria a script cannot prove.
license: See LICENSE.md
---

# Accessibility Audit (WCAG 2.2 AA / EAA)

Most "accessibility checkers" either only run the automated ~30% and call it done, or hand-wave the rest. This skill does both halves properly: it runs objective checks with the bundled scripts, then applies structured human judgement to the criteria that need it, and reports fixes ranked by how much they matter.

It exists because accessibility is now a legal requirement, not a nicety. Under the **European Accessibility Act**, a wide range of products and services offered to EU consumers must meet the standard from **28 June 2025** (see `references/eaa-context.md`).

## When to use

Trigger this for any request to check or improve accessibility: a WCAG audit of a page, fixing contrast, unlabelled forms, keyboard traps, screen-reader problems, or an EAA readiness check. For a single colour pair, just run `scripts/contrast-check.mjs` directly.

## Inputs

- **target** — a URL, an HTML file, or a component's rendered markup (required).
- **level** — `AA` (default) or `AAA`.
- **language** — the page's primary language, for the plain-language checks.
- **context** — optional: what the page is for, and whether it is in EAA scope.

## Run order

**1. Automated pass (objective, do this first).**

- Static scan: `node scripts/a11y-scan.mjs <file.html | url>` — missing alt, unlabelled controls, empty links/buttons, missing `lang`/`title`, positive `tabindex`, untitled iframes, broken heading order. Each finding cites its WCAG success criterion.
- Contrast: extract the page's text/background and UI colour pairs, then `node scripts/contrast-check.mjs pairs.csv` (or a single pair inline). Contrast is pure maths, so the script's verdict is final, never eyeball it.

A clean automated scan is **not** a pass. It only clears the machine-checkable subset.

**2. Judgement pass (agents, or sequential in one context).**

Work through `references/wcag-checklist.md`, grouped by the four WCAG principles. Split across four agents for a full audit, one per principle, or run them in order:

- **Perceivable** (`references/agents/perceivable.md`) — is alt text *meaningful* (not "image123")? captions/transcripts for media? does content reflow at 320px / 400% zoom? does meaning survive without colour?
- **Operable** (`references/agents/operable.md`) — is everything reachable and usable by keyboard alone? is focus visible and its order logical? no keyboard traps? are targets big enough (2.5.8)? is there a skip link?
- **Understandable** (`references/agents/understandable.md`) — is the language plain for the audience? are errors identified and explained in text? are labels and instructions clear? is behaviour predictable?
- **Robust** (`references/agents/robust.md`) — valid, well-formed markup? correct ARIA roles/states (and no ARIA where native HTML would do)? status messages announced?

**3. Synthesis.** Merge automated + judgement findings into one report per `references/report-format.md`: each issue with its WCAG criterion, severity, who it blocks, and a concrete fix. Rank by severity, then by reach.

## Principles

- **Prove what you can, judge what you must.** Never report a contrast or structural failure you did not run through a script. Never pass a criterion on "looks fine" when it needs a real check (keyboard, screen reader, zoom).
- **Severity is about people, not counts.** A single unlabelled login field blocks more users than twenty low-contrast footer links. Rank by who is blocked from doing what.
- **Every finding ships a fix.** A finding without a concrete, correct remedy is only half the work. Prefer native HTML fixes over ARIA.
- **Automated-clean is stated honestly.** The report says plainly which parts were machine-verified and which were judged, so no one mistakes a green script for compliance.

## Output

One report (`references/report-format.md`): a summary verdict, the prioritised issue list (criterion, severity, affected users, fix), what was automated vs judged, and a short EAA-readiness note when relevant. Plus the raw script output as an appendix.

## What this skill will not do

- It will not certify legal compliance. It produces an expert audit and a fix list; a formal conformance statement (EN 301 549 / WCAG) is a separate, signed process.
- It will not pass a criterion it could not actually verify. Unverifiable criteria are reported as "needs manual check", not silently marked pass.
