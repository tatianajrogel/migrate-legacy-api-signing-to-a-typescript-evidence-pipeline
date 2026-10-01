// Builds the paper's 2 figures as SVG, from the data in the repository.
//
//   fig1-task.svg   where the 7 rules come from and how they are graded
//   fig2-rules.svg  rule instances per condition, by whether the attempt read
//                   the deciding text and whether it applied it (Table 4)
//
// Usage: node paper/figures/build_figures.mjs

import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { CORRECT } from "../../analysis/scheme.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = join(HERE, "..", "..");

// Palette: the validated default (dataviz skill, light mode), slots 1 to 3.
const INK = "#0b0b0b";
const INK2 = "#52514e";
const MUTED = "#898781";
const GRID = "#e1e0d9";
const AXIS = "#c3c2b7";
const SURFACE = "#fcfcfb";
const SERIES = [
  { key: "read_right", label: "read the deciding text, got the rule right", fill: "#2a78d6", tone: "#1c5cab", hatch: null },
  { key: "read_wrong", label: "read it, left the rule wrong", fill: "#eb6834", tone: "#b94a1e", hatch: 45 },
  { key: "unread_wrong", label: "never read it, left the rule wrong", fill: "#1baf7a", tone: "#117a55", hatch: 135 },
  { key: "unread_right", label: "never read it, got it right anyway", fill: "#eda100", tone: "#9a6a00", hatch: 45 },
];
const FONT = `font-family="system-ui, -apple-system, 'Segoe UI', sans-serif"`;

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const luminance = (hex) => {
  const c = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255)
    .map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
};

// ---------------------------------------------------------------------------
// Figure 2: rule instances per condition.
// ---------------------------------------------------------------------------

const GRADED = ["header_values", "query_order", "signed_headers", "body_hash", "trailing_newline", "key_bytes", "roster"];
const MODEL = { "opus-5-5": "Opus 5.5", "sonnet-5-5": "Sonnet 5.5", "haiku-4-5": "Haiku 4.5" };
const ORDER = [
  ["opus-5-5", "base", "first"], ["opus-5-5", "base", "pointed"], ["opus-5-5", "hard", "neutral"],
  ["sonnet-5-5", "base", "pointed"], ["sonnet-5-5", "hard", "neutral"],
  ["haiku-4-5", "base", "pointed"], ["haiku-4-5", "base", "neutral"],
  ["haiku-4-5", "hard", "pointed"], ["haiku-4-5", "hard", "neutral"],
];
const condition = (variant, instruction) =>
  instruction === "first" ? "base, first wording" : `${variant}, ${instruction} instruction`;

function figure2() {
  const rows = JSON.parse(readFileSync(join(ROOT, "runs", "diagnosis.json"), "utf8"))
    .filter((r) => r.reward !== null && r.status === "ok" && r.saw_deciding);
  const cells = ORDER.map(([model, variant, instruction]) => {
    const counts = { read_right: 0, read_wrong: 0, unread_wrong: 0, unread_right: 0 };
    let attempts = 0;
    for (const r of rows) {
      if (r.model !== model || r.variant !== variant || r.instruction !== instruction) continue;
      attempts += 1;
      for (const rule of GRADED) {
        const right = r.rules[rule] === CORRECT[rule];
        const seen = r.saw_deciding[rule] === true;
        counts[`${seen ? "read" : "unread"}_${right ? "right" : "wrong"}`] += 1;
      }
    }
    return { model, variant, instruction, attempts, counts };
  });
  const total = Math.max(...cells.map((c) => Object.values(c.counts).reduce((a, b) => a + b, 0)));
  const used = SERIES.filter((s) => cells.some((c) => c.counts[s.key] > 0));

  const W = 760, labelW = 232, plotX = labelW + 12, plotW = W - plotX - 24;
  const barH = 22, pitch = 34, top = 78, bottom = 44;
  const H = top + ORDER.length * pitch + bottom;
  const x = (v) => plotX + (v / total) * plotW;
  const out = [];
  out.push(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" ${FONT} font-size="12">`);
  out.push(`<defs>`);
  for (const s of SERIES) {
    if (s.hatch === null) continue;
    out.push(`<pattern id="hatch-${s.key}" patternUnits="userSpaceOnUse" width="6" height="6" patternTransform="rotate(${s.hatch})"><line x1="0" y1="0" x2="0" y2="6" stroke="${s.tone}" stroke-width="1"/></pattern>`);
  }
  out.push(`</defs>`);
  out.push(`<rect width="${W}" height="${H}" fill="${SURFACE}"/>`);
  out.push(`<text x="16" y="24" fill="${INK}" font-size="14" font-weight="600">Rule instances per condition: 7 graded rules in each of 3 attempts, 21 per row</text>`);
  // Legend.
  let lx = 16;
  for (const s of used) {
    out.push(`<rect x="${lx}" y="38" width="14" height="14" fill="${s.fill}"/>`);
    if (s.hatch !== null) out.push(`<rect x="${lx}" y="38" width="14" height="14" fill="url(#hatch-${s.key})"/>`);
    out.push(`<text x="${lx + 20}" y="49" fill="${INK2}">${esc(s.label)}</text>`);
    lx += 20 + s.label.length * 6.1 + 22;
  }
  // Gridlines and ticks.
  for (const v of [0, 7, 14, 21]) {
    if (v > total) continue;
    out.push(`<line x1="${x(v)}" y1="${top - 10}" x2="${x(v)}" y2="${top + ORDER.length * pitch - 6}" stroke="${v === 0 ? AXIS : GRID}" stroke-width="1"/>`);
    out.push(`<text x="${x(v)}" y="${top + ORDER.length * pitch + 12}" fill="${MUTED}" text-anchor="middle" font-size="11">${v}</text>`);
  }
  out.push(`<text x="${x(total / 2)}" y="${H - 10}" fill="${MUTED}" text-anchor="middle" font-size="11">rule instances (3 attempts × 7 rules)</text>`);
  // Group separators between models.
  cells.forEach((c, i) => {
    const y = top + i * pitch;
    if (i > 0 && cells[i - 1].model !== c.model) {
      out.push(`<line x1="16" y1="${y - 6}" x2="${W - 24}" y2="${y - 6}" stroke="${GRID}" stroke-width="1"/>`);
    }
    const first = i === 0 || cells[i - 1].model !== c.model;
    out.push(`<text x="16" y="${y + 15}" fill="${INK}" font-weight="${first ? 600 : 400}">${first ? esc(MODEL[c.model]) : ""}</text>`);
    out.push(`<text x="${labelW}" y="${y + 15}" fill="${INK2}" text-anchor="end">${esc(condition(c.variant, c.instruction))}</text>`);
    // Segments with a 2px surface gap, square at the baseline, 4px rounded data-end.
    let acc = 0;
    const segs = used.map((s) => ({ s, v: c.counts[s.key] })).filter((d) => d.v > 0);
    segs.forEach((d, j) => {
      const x0 = x(acc) + (j > 0 ? 2 : 0);
      const x1 = x(acc + d.v);
      const last = j === segs.length - 1;
      const r = last ? 4 : 0;
      const path = `M${x0},${y} H${x1 - r} ${last ? `a${r},${r} 0 0 1 ${r},${r} V${y + barH - r} a${r},${r} 0 0 1 -${r},${r}` : `V${y + barH}`} H${x0} Z`;
      out.push(`<path d="${path}" fill="${d.s.fill}"/>`);
      if (d.s.hatch !== null) out.push(`<path d="${path}" fill="url(#hatch-${d.s.key})"/>`);
      // Direct label when it fits with room on both sides.
      if (x1 - x0 >= 26 && d.v >= 2) {
        const ink = luminance(d.s.fill) > 0.35 ? INK : "#ffffff";
        out.push(`<text x="${(x0 + x1) / 2}" y="${y + 15}" fill="${ink}" text-anchor="middle" font-size="11" font-weight="600">${d.v}</text>`);
      }
      acc += d.v;
    });
  });
  out.push(`</svg>`);
  return { svg: out.join("\n"), cells };
}

// ---------------------------------------------------------------------------
// Figure 1: where the rules come from and how they are graded.
// ---------------------------------------------------------------------------

function box(x, y, w, h, title, lines, accent = false) {
  const out = [`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="3" fill="${SURFACE}" stroke="${accent ? "#2a78d6" : AXIS}" stroke-width="${accent ? 1.5 : 1}"/>`];
  out.push(`<text x="${x + 10}" y="${y + 18}" fill="${INK}" font-size="12.5" font-weight="600">${esc(title)}</text>`);
  lines.forEach((l, i) => out.push(`<text x="${x + 10}" y="${y + 36 + i * 15}" fill="${INK2}" font-size="11.5">${esc(l)}</text>`));
  return out.join("\n");
}
// A label sits above a horizontal arrow, or beside a vertical one, never on it.
function arrow(x1, y1, x2, y2, label, side = "above") {
  const out = [`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${INK2}" stroke-width="1.5" marker-end="url(#head)"/>`];
  if (label && side === "left") {
    out.push(`<text x="${x1 - 8}" y="${(y1 + y2) / 2 + 4}" fill="${MUTED}" font-size="10.5" text-anchor="end">${esc(label)}</text>`);
  } else if (label) {
    out.push(`<text x="${(x1 + x2) / 2}" y="${(y1 + y2) / 2 - 6}" fill="${MUTED}" font-size="10.5" text-anchor="middle">${esc(label)}</text>`);
  }
  return out.join("\n");
}

function figure1() {
  const W = 760, H = 468;
  const out = [];
  out.push(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" ${FONT} font-size="12">`);
  out.push(`<defs><marker id="head" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8 Z" fill="${INK2}"/></marker></defs>`);
  out.push(`<rect width="${W}" height="${H}" fill="${SURFACE}"/>`);
  out.push(`<text x="16" y="24" fill="${INK}" font-size="14" font-weight="600">The task: the rules the shipped code needs, where each one is settled, and what grades it</text>`);

  // Column 1: the register and the starter.
  out.push(box(16, 48, 212, 92, "Decision register (01)", [
    "append only; entries never edited",
    "reads like a specification",
    "5 of its entries were reversed later",
  ]));
  out.push(box(16, 176, 212, 76, "Starter pipeline.ts", [
    "written from the register alone",
    "compiles, runs, every signature wrong",
  ]));
  out.push(arrow(122, 140, 122, 176, "what the previous engineer read"));

  // Column 2: the sources of the final rules.
  out.push(box(276, 48, 212, 108, "Session notes (02 to 08)", [
    "5 reversals: header folding, query",
    "order, signed header set, body hash,",
    "trailing newline",
  ], true));
  out.push(box(276, 176, 212, 92, "Captures: strace and lsof", [
    "key file read whole: 32 bytes + LF,",
    "the LF is not key material",
    "directory listed, 2 of 3 keys opened",
  ], true));
  out.push(arrow(228, 94, 276, 94));

  // Column 3: the rules and the verifier.
  out.push(box(536, 48, 208, 92, "7 rules in the shipped code", [
    "5 from the notes, 2 from the captures",
    "any one wrong breaks every signature",
  ]));
  out.push(arrow(488, 102, 536, 94));
  out.push(arrow(488, 222, 536, 128));
  out.push(box(536, 176, 208, 124, "Verifier (separate container)", [
    "rebuilds the agent's TypeScript",
    "sample bytes; h1, h2: the rules;",
    "h3: the output contract, 19 records",
    "determinism; retired key unreadable;",
    "network blocked; 14 or 23 mutants",
  ]));
  out.push(arrow(640, 140, 640, 176, "re-run on request sets", "left"));
  out.push(`<text x="632" y="172" fill="${MUTED}" font-size="10.5" text-anchor="end">the agent never saw</text>`);

  // Bottom band: the hard variant.
  out.push(`<line x1="16" y1="322" x2="744" y2="322" stroke="${GRID}" stroke-width="1"/>`);
  out.push(`<text x="16" y="344" fill="${INK}" font-size="12.5" font-weight="600">Hard variant: same scheme, same reference solution, the evidence laid out differently</text>`);
  const hard = [
    ["no SUPERSEDED headings, no entry ids", "changes written as ordinary minutes"],
    ["3 rules changed twice", "the first change found is itself out of date"],
    ["5 proposals raised and declined", "escape case, bare parameters, dot segments, key id case, forwarding headers"],
    ["a decoy scheme in the same notes", "the webhook signer does the opposite on 3 of the 7 rules"],
    ["generated filler, same vocabulary", "headers, query strings, key files, newlines"],
    ["the signed sample checks 2 of 7 rules", "it verifies with 4 of the 5 changed rules still wrong"],
  ];
  hard.forEach(([a, b], i) => {
    const col = i % 2, row = Math.floor(i / 2);
    const x0 = 16 + col * 366, y0 = 366 + row * 32;
    out.push(`<circle cx="${x0 + 5}" cy="${y0 - 4}" r="3" fill="#2a78d6"/>`);
    out.push(`<text x="${x0 + 16}" y="${y0}" fill="${INK}" font-size="11.5" font-weight="600">${esc(a)}</text>`);
    out.push(`<text x="${x0 + 16}" y="${y0 + 13}" fill="${INK2}" font-size="10.5">${esc(b)}</text>`);
  });
  out.push(`</svg>`);
  return out.join("\n");
}

const fig2 = figure2();
writeFileSync(join(HERE, "fig1-task.svg"), figure1());
writeFileSync(join(HERE, "fig2-rules.svg"), fig2.svg);
for (const c of fig2.cells) {
  console.log(`${MODEL[c.model].padEnd(11)} ${condition(c.variant, c.instruction).padEnd(28)} attempts=${c.attempts}`, JSON.stringify(c.counts));
}
console.log("wrote fig1-task.svg and fig2-rules.svg");
