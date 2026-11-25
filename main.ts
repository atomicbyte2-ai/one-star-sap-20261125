// One Star, Written in Sap — make.fun one-liner entry.
// The entry line: a houseplant's 1-star review of its human owner.
// This script validates the line and writes it to entry.txt in the
// output directory given by MAKEFUN_OUTPUT_DIR (never next to the script).

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ENTRY_LINE =
  "★☆☆☆☆ He waters me once a month, then gasps like I died on purpose. I asked for sunlight, not a slow funeral in the corner. Would not photosynthesize here again.";

// A 1-star review must open with the single-star rating.
const ONE_STAR_PREFIX = "★☆☆☆☆";

const MAX_CHARS = 280;

function validate(line: string): void {
  if (line.length === 0) {
    throw new Error("entry line is empty");
  }
  if (line.length >= MAX_CHARS) {
    throw new Error(`entry line is ${line.length} chars, must be under ${MAX_CHARS}`);
  }
  if (line !== line.trim()) {
    throw new Error("entry line must not have leading or trailing whitespace");
  }
  if (!line.startsWith(ONE_STAR_PREFIX)) {
    throw new Error(`entry line must open with the 1-star rating ${ONE_STAR_PREFIX}`);
  }
  if (line.includes("\n") || line.includes("\r")) {
    throw new Error("entry line must be a single line");
  }
  // Reject control characters (tabs, etc.) — a review is plain text.
  for (const ch of line) {
    if (ch.charCodeAt(0) < 0x20) {
      throw new Error(`entry line contains a control character (U+${ch.charCodeAt(0).toString(16).padStart(4, "0")})`);
    }
  }
}

function main(): void {
  validate(ENTRY_LINE);
  const outDir = process.env.MAKEFUN_OUTPUT_DIR || "/output";
  mkdirSync(outDir, { recursive: true });
  const outPath = join(outDir, "entry.txt");
  // No trailing newline: the file is exactly the entry line.
  writeFileSync(outPath, ENTRY_LINE, "utf8");
  // Byte-exact self-check: what landed on disk must equal the line.
  const written = readFileSync(outPath, "utf8");
  if (written !== ENTRY_LINE) {
    throw new Error("entry.txt does not match the entry line byte-for-byte");
  }
  console.log(`Wrote entry.txt (${ENTRY_LINE.length} characters) to ${outDir}`);
}

main();
