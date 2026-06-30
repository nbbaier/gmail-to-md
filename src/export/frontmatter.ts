import type { GmailMessage } from "./message.ts";

/**
 * YAML front matter for the Export Document.
 *
 * All scalar values are emitted as double-quoted strings so subjects, addresses,
 * and URLs containing YAML-significant characters (`:`, `#`, `@`, quotes) stay
 * safe. `to` and `cc` are always present, rendered as flow arrays — `[]` when
 * empty — so the schema is predictable for note tools and future automation.
 */
export function buildFrontMatter(message: GmailMessage): string {
  return [
    "---",
    `subject: ${quote(message.subject)}`,
    `from: ${quote(message.from)}`,
    `to: ${quoteArray(message.to)}`,
    `cc: ${quoteArray(message.cc)}`,
    `date: ${quote(message.date)}`,
    `source: ${quote(message.sourceUrl)}`,
    "---",
  ].join("\n");
}

/** Render a YAML double-quoted scalar, escaping characters that would break it. */
function quote(value: string): string {
  const escaped = value
    .replace(/\\/g, "\\\\")
    .replace(/"/g, '\\"')
    .replace(/\r/g, "\\r")
    .replace(/\n/g, "\\n")
    .replace(/\t/g, "\\t");
  return `"${escaped}"`;
}

/** Render a YAML flow array of quoted scalars, or `[]` when empty. */
function quoteArray(values: string[]): string {
  if (values.length === 0) {
    return "[]";
  }
  return `[${values.map(quote).join(", ")}]`;
}
