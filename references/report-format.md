# Report format

One report per audit. Lead with the verdict and the issues that block the most people. Keep every finding actionable.

## Structure

```markdown
# Accessibility audit — <target>

**Scope audited:** <page/flow/component>   **Level:** AA   **Date:** <date>
**Method:** automated (a11y-scan + contrast-check) + manual judgement (keyboard, screen reader, zoom)

## Verdict
One paragraph: the overall state, the count of blockers vs minor issues, and the single most important thing to fix first.

## Blockers (fix first)
Issues that stop someone completing a task.

| # | Issue | WCAG | Who it blocks | Fix |
|---|-------|------|---------------|-----|
| 1 | Login field has no label | 3.3.2 / 4.1.2 | Screen-reader users cannot tell what to type | Add `<label for="user">Gebruikersnaam</label>` |

## Serious
Real barriers that have a workaround but exclude or exhaust users.

## Minor
Polish: small contrast misses on non-essential text, redundant link text.

## Verified vs needs manual check
- **Automated (proven):** contrast pairs, alt presence, labels, headings, tabindex, iframe titles.
- **Judged this audit:** keyboard operability, focus order/visibility, screen-reader output, reflow at 320px, plain language.
- **Not yet checked (recommend):** <e.g. full screen-reader pass on the checkout, mobile target sizes>.

## EAA readiness (if in scope)
Two or three sentences: is this an in-scope service, which findings are compliance risks, and the exemption note if relevant. Framed as risk to review, not a compliance ruling.

## Appendix — raw script output
The a11y-scan and contrast-check output, verbatim.
```

## Severity rule

Rank by **who is blocked from what**, not by count:

- **Blocker** — a task (buy, log in, contact, read) cannot be completed by some group.
- **Serious** — the task is possible but painful or exclusionary (illogical focus, missing captions on key media, contrast on primary content).
- **Minor** — cosmetic or edge-case; does not block a task.

## Writing the fixes

- Give the actual code or the exact change, not "add a label".
- Prefer native HTML over ARIA. If ARIA is needed, give the correct role/state.
- Never report a contrast or structural failure that was not produced by a script run.
