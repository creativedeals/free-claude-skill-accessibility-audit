# WCAG 2.2 AA checklist

Grouped by the four principles (POUR). For each item: what to check and the common failure. Items marked *[auto]* are covered by `scripts/a11y-scan.mjs` or `scripts/contrast-check.mjs`; the rest need judgement. WCAG 2.2 added the items marked *[2.2]*.

## Perceivable

- **1.1.1 Non-text content** *[auto: presence]* — every image, icon, and control has a text alternative. Judgement: is the alt *meaningful* and not redundant? Decorative images use `alt=""`. Informative images describe the information, not the file.
- **1.2 Time-based media** — audio has a transcript; video has captions (1.2.2) and, where needed, audio description (1.2.5).
- **1.3.1 Info and relationships** *[auto: headings]* — structure is in the markup: real headings, lists, `<table>` with headers, `<fieldset>`/`<legend>` for groups. Failure: headings faked with bold text, layout tables.
- **1.3.5 Identify input purpose** — inputs collecting user data use the right `autocomplete` token (name, email, tel…).
- **1.4.1 Use of colour** — colour is never the only way to convey meaning (links, errors, chart series). Judgement.
- **1.4.3 Contrast (minimum)** *[auto: contrast-check]* — text ≥ 4.5:1, large text ≥ 3:1. Run the numbers; do not estimate.
- **1.4.4 Resize text / 1.4.10 Reflow** — content is usable at 200% text and reflows without horizontal scroll at 320px width (≈ 400% zoom). Failure: fixed-width layouts, text in images.
- **1.4.11 Non-text contrast** *[auto: contrast-check, ui]* — UI components and meaningful graphics ≥ 3:1 against adjacent colours (input borders, focus rings, icon buttons).
- **1.4.12 Text spacing** — no loss of content when users override line-height/letter/word spacing.

## Operable

- **2.1.1 Keyboard** — every interactive element works with the keyboard alone. Judgement: tab through the whole page, activate everything.
- **2.1.2 No keyboard trap** — focus can always move away from a component (watch modals, embeds).
- **2.4.1 Bypass blocks** — a skip link (or landmarks) lets keyboard users jump past repeated navigation.
- **2.4.2 Page titled** *[auto]* — a unique, descriptive `<title>`.
- **2.4.3 Focus order** *[auto: positive tabindex]* — focus order follows meaning. Failure: positive `tabindex`, DOM order fighting visual order.
- **2.4.4 Link purpose** *[auto: empty links]* — link text makes sense; avoid bare "click here"/"read more" that repeat.
- **2.4.6 Headings and labels** — headings and labels describe their content.
- **2.4.7 Focus visible** — the focused element has a clearly visible indicator. Failure: `outline: none` with no replacement.
- **2.4.11 Focus not obscured** *[2.2]* — the focused element is not fully hidden behind sticky headers/footers.
- **2.5.3 Label in name** — a control's visible label is part of its accessible name (so voice control works).
- **2.5.7 Dragging movements** *[2.2]* — anything done by dragging has a single-pointer alternative (tap/click).
- **2.5.8 Target size (minimum)** *[2.2]* — pointer targets are at least 24×24 CSS px, or have enough spacing.

## Understandable

- **3.1.1 Language of page** *[auto: html lang]* — `<html lang>` is set; parts in another language use `lang` too (3.1.2).
- **3.2.1 / 3.2.2 On focus / on input** — focusing or changing a field does not trigger a surprising context change (auto-submit, new window).
- **3.2.6 Consistent help** *[2.2]* — help mechanisms (contact, chat) appear in the same relative place across pages.
- **3.3.1 Error identification** — errors are described in text, next to the field, not by colour alone. Judgement.
- **3.3.2 Labels or instructions** *[auto: unlabelled controls]* — every control has a persistent, programmatic label. Failure: placeholder used as the only label.
- **3.3.3 Error suggestion** — when the fix is known, suggest it ("date must be dd-mm-yyyy").
- **3.3.7 Redundant entry** *[2.2]* — do not ask for the same info twice in one process (offer to reuse it).
- **3.3.8 Accessible authentication (minimum)** *[2.2]* — no cognitive test (like transcribing a code) without an alternative; allow paste and password managers.

## Robust

- **4.1.2 Name, role, value** *[auto: iframes, empty controls]* — every UI component exposes a correct name, role, and state to assistive tech. Prefer native HTML; use ARIA only to fill gaps, and correctly.
- **4.1.3 Status messages** — dynamic status (form saved, results updated, errors) is announced via a live region without moving focus.
- **Valid markup** — no duplicate `id`s, properly nested/closed elements, no ARIA that contradicts the element.

## The keyboard + screen-reader pass (do not skip)

The single most revealing manual check: unplug the mouse and tab through the page, then run one screen reader (NVDA, VoiceOver, or TalkBack) over the key flow. Most real blockers, unreachable menus, silent buttons, illogical order, invisible focus, only surface here.
