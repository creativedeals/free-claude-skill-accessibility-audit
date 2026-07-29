#!/usr/bin/env node
// Accessibility Audit — static HTML scanner. Zero dependencies, Node 18+.
//
// Catches the machine-checkable WCAG failures: missing alt, unlabelled form
// controls, empty links/buttons, missing lang/title, positive tabindex, untitled
// iframes, and broken heading order. These are the ~30% of accessibility issues a
// script can prove; the skill's agents judge the rest (is the alt meaningful? is
// the focus order logical? is the language plain?).
//
// Usage:
//   node a11y-scan.mjs page.html
//   node a11y-scan.mjs https://example.com
//
// Exit code 1 if any issues are found.

import { readFileSync } from 'node:fs'

const arg = process.argv[2]
if (!arg) {
  console.error('Usage: node a11y-scan.mjs <file.html | https://url>')
  process.exit(2)
}

const html = /^https?:\/\//i.test(arg)
  ? await fetch(arg).then(r => r.text()).catch(e => { console.error('fetch failed:', e.message); process.exit(2) })
  : readFileSync(arg, 'utf8')

const findings = []
const add = (wcag, msg) => findings.push({ wcag, msg })

const attr = (tag, name) => {
  const m = tag.match(new RegExp(`\\b${name}\\s*=\\s*("([^"]*)"|'([^']*)'|([^\\s>]+))`, 'i'))
  return m ? (m[2] ?? m[3] ?? m[4] ?? '') : null
}
const hasAttr = (tag, name) => new RegExp(`\\b${name}\\b`, 'i').test(tag)
const tagsOf = (name) => html.match(new RegExp(`<${name}\\b[^>]*>`, 'gi')) || []
const stripTags = (s) => s.replace(/<[^>]*>/g, '').replace(/&[a-z#0-9]+;/gi, ' ').trim()

// 1. <html lang>
const htmlTag = (html.match(/<html\b[^>]*>/i) || [''])[0]
if (!htmlTag || !attr(htmlTag, 'lang')) add('3.1.1', 'Missing lang attribute on <html> (screen readers cannot pick the right voice)')

// 2. <title>
if (!/<title[^>]*>\s*\S[\s\S]*?<\/title>/i.test(html)) add('2.4.2', 'Missing or empty <title> element')

// 3. images without an alt attribute (alt="" is valid for decorative; absent is not)
let imgMissing = 0
for (const t of tagsOf('img')) if (!hasAttr(t, 'alt')) imgMissing++
if (imgMissing) add('1.1.1', `${imgMissing} <img> without an alt attribute`)

// 4. unlabelled form controls
const labelFor = new Set()
for (const t of html.match(/<label\b[^>]*>/gi) || []) { const f = attr(t, 'for'); if (f) labelFor.add(f) }
let unlabelled = 0
for (const name of ['input', 'select', 'textarea']) {
  for (const t of tagsOf(name)) {
    const type = (attr(t, 'type') || '').toLowerCase()
    if (['hidden', 'submit', 'button', 'reset'].includes(type)) continue
    const id = attr(t, 'id')
    const labelled = hasAttr(t, 'aria-label') || hasAttr(t, 'aria-labelledby') || hasAttr(t, 'title') || (id && labelFor.has(id))
    if (!labelled) unlabelled++
  }
}
if (unlabelled) add('3.3.2 / 4.1.2', `${unlabelled} form control(s) without an associated label`)

// 5. empty links / buttons (no text, no aria-label, no titled/alt image inside)
for (const [name, sc] of [['a', '2.4.4'], ['button', '4.1.2']]) {
  const re = new RegExp(`<${name}\\b[^>]*>([\\s\\S]*?)<\\/${name}>`, 'gi')
  let m, empty = 0
  while ((m = re.exec(html))) {
    const open = m[0].slice(0, m[0].indexOf('>') + 1)
    const inner = m[1]
    const hasText = stripTags(inner).length > 0
    const hasAria = hasAttr(open, 'aria-label') || hasAttr(open, 'aria-labelledby') || hasAttr(open, 'title')
    const imgAlt = /<img\b[^>]*\balt\s*=\s*("[^"]*[^"\s][^"]*"|'[^']*[^'\s][^']*')/i.test(inner)
    if (name === 'a' && !attr(open, 'href')) continue // anchors without href are not links
    if (!hasText && !hasAria && !imgAlt) empty++
  }
  if (empty) add(sc, `${empty} <${name}> with no accessible text (empty link/button)`)
}

// 6. positive tabindex
let posTab = 0
for (const m of html.matchAll(/tabindex\s*=\s*["']?([0-9]+)/gi)) if (Number(m[1]) > 0) posTab++
if (posTab) add('2.4.3', `${posTab} element(s) with a positive tabindex (breaks natural focus order)`)

// 7. iframes without a title
let iframeNoTitle = 0
for (const t of tagsOf('iframe')) if (!attr(t, 'title')) iframeNoTitle++
if (iframeNoTitle) add('4.1.2', `${iframeNoTitle} <iframe> without a title attribute`)

// 8. heading order
const levels = [...html.matchAll(/<h([1-6])\b/gi)].map(m => Number(m[1]))
const h1s = levels.filter(l => l === 1).length
if (levels.length === 0) add('1.3.1', 'No headings found (no document structure)')
else if (h1s === 0) add('1.3.1 / 2.4.6', 'No <h1> on the page')
else if (h1s > 1) add('1.3.1', `${h1s} <h1> elements (expected exactly one)`)
let prev = 0, jumps = 0
for (const l of levels) { if (prev && l > prev + 1) jumps++; prev = l }
if (jumps) add('1.3.1', `${jumps} heading-level jump(s) (e.g. h2 straight to h4)`)

// ── report ───────────────────────────────────────────────────────────────────
console.log(`Accessibility static scan — ${arg}\n`)
if (!findings.length) {
  console.log('No machine-checkable WCAG issues found. Still run the judgement checks (see wcag-checklist.md).')
  process.exit(0)
}
for (const f of findings) console.log(`  [WCAG ${f.wcag}]  ${f.msg}`)
console.log(`\n${findings.length} issue type(s) found. These are automated checks only — a clean scan is not a full pass.`)
process.exit(1)
