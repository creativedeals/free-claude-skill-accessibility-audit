# Agent — Understandable

Paste as a subagent prompt. Audits the Understandable principle. Read `references/wcag-checklist.md` (Understandable section) first.

**Target:** {{target}}   **Language:** {{language}}   **Automated findings so far:** {{scan_output}}

- **Language** (3.1.1 / 3.1.2) — `<html lang>` is set correctly (the scan checks presence); passages in another language carry their own `lang`.
- **Predictable** (3.2.1 / 3.2.2) — focusing or editing a field does not cause a surprising jump, submit, or new window. Consistent navigation and help placement (3.2.6).
- **Labels and instructions** (3.3.2) — every field has a persistent visible label, not just a placeholder. Instructions and required-field marking are clear before submitting.
- **Errors** (3.3.1 / 3.3.3) — errors are shown in text next to the field, explain what is wrong, and suggest the fix when it is known. Not colour-only.
- **Forms that respect people** (3.3.7 / 3.3.8) — no asking for the same data twice in a flow; authentication allows paste and password managers and avoids memory/transcription tests.
- **Plain language** — is the reading level appropriate for the audience in the target language? Flag jargon, long sentences, and vague microcopy on critical actions.

**Output:** a list of `{ criterion, severity, where, who_it_blocks, fix }`, with concrete rewrites for unclear labels, errors, and instructions.
