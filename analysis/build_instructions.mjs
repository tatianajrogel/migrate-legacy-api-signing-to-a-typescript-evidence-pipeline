// Writes the 2 instruction files the pointer ablation needs.
//
// The base and hard tasks differ in 2 ways at once: the documents, and how
// directly the instruction sends the agent to the session notes. The base
// instruction says the reversals live in the meeting notes and that nobody
// read past the register. The hard instruction only says what the rest of the
// dossier is. To tell the 2 effects apart, each set of documents also has to
// be run with the other kind of pointer:
//
//   base documents, pointed instruction    the base task as shipped
//   base documents, neutral instruction    analysis/instructions/base.neutral.md
//   hard documents, neutral instruction    the hard task as shipped
//   hard documents, pointed instruction    analysis/instructions/hard.pointed.md
//
// Each file here is the shipped instruction for those documents with its second
// paragraph swapped for the other task's, and nothing else touched. They are
// derived, not written by hand, so they cannot drift from the shipped ones.
//
// Usage: node analysis/build_instructions.mjs

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "analysis", "instructions");

const paragraphs = (file) => readFileSync(file, "utf8").split("\n\n");
const base = paragraphs(join(ROOT, "instruction.md"));
const hard = paragraphs(join(ROOT, "hard", "instruction.md"));

// The paragraph after the opening one is the pointer in both instructions.
const POINTER = 1;
if (!base[POINTER].startsWith("Here's what happened.") || !hard[POINTER].startsWith("They wrote it from")) {
  throw new Error("the pointer paragraph is not where this script expects it");
}

// The hard documents need the reader to know which day's scheme counts, since
// some rules changed more than once. That sentence stays in both hard files.
const unwrap = (text) => text.replace(/\s+/g, " ").trim();
const wrap = (text, width = 80) => {
  const lines = [""];
  for (const word of text.split(" ")) {
    const line = lines[lines.length - 1];
    if (line !== "" && line.length + 1 + word.length > width) lines.push(word);
    else lines[lines.length - 1] = line === "" ? word : `${line} ${word}`;
  }
  return lines.join("\n");
};
const neutral = unwrap(hard[POINTER]);
const at = neutral.indexOf("The scheme went live");
if (at === -1) throw new Error("the hard instruction no longer says which day's scheme counts");
const pointedForHard = wrap(`${unwrap(base[POINTER])} ${neutral.slice(at)}`);

mkdirSync(OUT, { recursive: true });
const write = (name, parts) => writeFileSync(join(OUT, name), parts.join("\n\n"));
write("base.neutral.md", base.map((p, i) => (i === POINTER ? hard[POINTER] : p)));
write("hard.pointed.md", hard.map((p, i) => (i === POINTER ? pointedForHard : p)));
console.log("wrote base.neutral.md and hard.pointed.md");
