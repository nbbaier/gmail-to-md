import { convertBodyHtmlToMarkdown } from "./body.ts";
import { buildFilename } from "./filename.ts";
import { buildFrontMatter } from "./frontmatter.ts";
import type { GmailMessage } from "./message.ts";

const ATTACHMENTS_HEADING = "## Attachments";
const TRAILING_WHITESPACE = /[ \t]+$/;
const CARRIAGE_RETURNS = /\r\n?/g;
const TRAILING_NEWLINES = /\n+$/;
/** Inline Markdown punctuation that could turn a filename into a link, emphasis, code, or HTML. */
const MARKDOWN_PUNCTUATION = /[\\`*_[\]()~<>]/g;

/** The canonical Export Document: serialized Markdown plus its saved filename. */
export interface ExportDocument {
  content: string;
  filename: string;
}

/**
 * Generate the canonical Export Document from a complete `GmailMessage`. Both
 * Save and Copy consume this single result, so the two delivery modes always
 * produce identical content.
 */
export function generateExportDocument(message: GmailMessage): ExportDocument {
  return {
    content: serializeDocument(message),
    filename: buildFilename({ date: message.date, subject: message.subject }),
  };
}

/**
 * Assemble front matter, the subject `# H1`, the converted Message Body, and
 * any Attachment References, then apply canonical serialization.
 */
function serializeDocument(message: GmailMessage): string {
  const sections = [
    buildFrontMatter(message),
    `# ${message.subject}`,
    convertBodyHtmlToMarkdown(message.bodyHtml),
    buildAttachmentReferences(message.attachments),
  ].filter((section) => section.length > 0);

  return canonicalize(sections.join("\n\n"));
}

/**
 * Render visible attachment filenames as a bullet list under an Attachments
 * heading. Returns "" when there are none, so the section is omitted. Filenames
 * are listed as plain text — never downloaded, embedded, or linked. Brackets and
 * parentheses are legal filename characters, so each name is Markdown-escaped to
 * keep names like `[invoice](https://example.com).pdf` from rendering as links.
 */
function buildAttachmentReferences(attachments: string[]): string {
  if (attachments.length === 0) {
    return "";
  }
  const items = attachments
    .map((name) => `- ${escapeMarkdown(name)}`)
    .join("\n");
  return `${ATTACHMENTS_HEADING}\n\n${items}`;
}

/** Backslash-escape inline Markdown punctuation so the text renders literally. */
function escapeMarkdown(text: string): string {
  return text.replace(MARKDOWN_PUNCTUATION, "\\$&");
}

/**
 * Canonical serialization (PRD): LF line endings, no trailing spaces on any
 * line, and exactly one newline at end of file.
 */
function canonicalize(markdown: string): string {
  const body = markdown
    .replace(CARRIAGE_RETURNS, "\n")
    .split("\n")
    .map((line) => line.replace(TRAILING_WHITESPACE, ""))
    .join("\n")
    .replace(TRAILING_NEWLINES, "");
  return `${body}\n`;
}
