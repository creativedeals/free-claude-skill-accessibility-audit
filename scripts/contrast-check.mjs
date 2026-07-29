#!/usr/bin/env node
// Accessibility Audit — WCAG contrast-ratio checker. Zero dependencies, Node 18+.
//
// The contrast ratio is the one accessibility check that is pure, objective math
// (WCAG 2.x SC 1.4.3 / 1.4.6 / 1.4.11). This tells you pass/fail exactly, no
// judgement needed — so verify every colour pair here rather than eyeballing it.
//
// Usage:
//   node contrast-check.mjs "#1a1a1a" "#ffffff"            # one foreground/background pair
//   node contrast-check.mjs pairs.csv                       # CSV: fg,bg,label,size
//        size column (optional): "normal" (default) | "large" | "ui"
//
// Thresholds:
//   normal text  AA 4.5 : 1   AAA 7.0 : 1
//   large text   AA 3.0 : 1   AAA 4.5 : 1   (>= 24px, or >= 18.66px bold)
//   ui / graphic AA 3.0 : 1                 (SC 1.4.11 non-text contrast)

import { readFileSync } from 'node:fs'

// ── colour math (WCAG relative luminance) ────────────────────────────────────
function parseHex(input) {
  let h = String(input).trim().replace(/^#/, '')
  if (/^[0-9a-fA-F]{3}$/.test(h)) h = h.split('').map(c => c + c).join('')
  if (!/^[0-9a-fA-F]{6}$/.test(h)) return null
  return [0, 2, 4].map(i => parseInt(h.slice(i, i + 2), 16))
}

function channelLuminance(c8) {
  const c = c8 / 255
  return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
}

function relativeLuminance([r, g, b]) {
  return 0.2126 * channelLuminance(r) + 0.7152 * channelLuminance(g) + 0.0722 * channelLuminance(b)
}

function contrastRatio(fg, bg) {
  const l1 = relativeLuminance(fg)
  const l2 = relativeLuminance(bg)
  const lighter = Math.max(l1, l2)
  const darker = Math.min(l1, l2)
  return (lighter + 0.05) / (darker + 0.05)
}

// thresholds per content size
function thresholds(size) {
  switch ((size || 'normal').toLowerCase()) {
    case 'large': return { aa: 3.0, aaa: 4.5 }
    case 'ui':
    case 'graphic':
    case 'non-text': return { aa: 3.0, aaa: null }
    default: return { aa: 4.5, aaa: 7.0 }
  }
}

function evaluate(fgHex, bgHex, size) {
  const fg = parseHex(fgHex)
  const bg = parseHex(bgHex)
  if (!fg || !bg) return { ok: false, error: `invalid hex (${fgHex} / ${bgHex})` }
  const ratio = contrastRatio(fg, bg)
  const t = thresholds(size)
  return {
    ok: true,
    ratio: Math.round(ratio * 100) / 100,
    aa: ratio >= t.aa,
    aaa: t.aaa == null ? null : ratio >= t.aaa,
    size: (size || 'normal').toLowerCase(),
  }
}

// ── CLI ──────────────────────────────────────────────────────────────────────
const args = process.argv.slice(2)
if (args.length === 0) {
  console.error('Usage: node contrast-check.mjs "#fg" "#bg"  |  node contrast-check.mjs pairs.csv')
  process.exit(2)
}

function fmt(r, label) {
  if (!r.ok) return `FAIL  ${label}  ${r.error}`
  const aaa = r.aaa == null ? 'n/a' : (r.aaa ? 'pass' : 'FAIL')
  const verdict = r.aa ? ' OK ' : 'FAIL'
  return `${verdict}  ${label.padEnd(28)} ${String(r.ratio).padStart(6)}:1  [${r.size}]  AA ${r.aa ? 'pass' : 'FAIL'}  AAA ${aaa}`
}

let failed = 0
const rows = []

if (args.length >= 2 && parseHex(args[0]) && parseHex(args[1])) {
  const r = evaluate(args[0], args[1], args[2])
  rows.push({ r, label: `${args[0]} on ${args[1]}` })
} else {
  // CSV mode: fg,bg,label,size
  const text = readFileSync(args[0], 'utf8').replace(/\r\n/g, '\n')
  // Comments start with // (not #, since hex colours start with #).
  const lines = text.split('\n').filter(l => l.trim() && !/^\s*\/\//.test(l))
  const start = /fg|foreground/i.test(lines[0]) ? 1 : 0
  for (const line of lines.slice(start)) {
    const [fg, bg, label, size] = line.split(',').map(s => (s || '').trim())
    rows.push({ r: evaluate(fg, bg, size), label: label || `${fg} on ${bg}` })
  }
}

for (const { r, label } of rows) {
  if (!r.ok || !r.aa) failed++
  console.log(fmt(r, label))
}

console.log('')
if (failed) {
  console.log(`${failed} of ${rows.length} pair(s) FAIL WCAG AA.`)
  process.exit(1)
} else {
  console.log(`All ${rows.length} pair(s) pass WCAG AA.`)
}
