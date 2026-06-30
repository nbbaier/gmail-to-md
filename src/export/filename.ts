const MAX_BASENAME_LENGTH = 120;
const FALLBACK_SLUG = "untitled-message";
const HYPHEN = "-";

const NON_SLUG_CHARS = /[^\p{L}\p{N}]+/gu;
const REPEATED_HYPHENS = /-{2,}/g;
const EDGE_HYPHENS = /^-+|-+$/g;
const TRAILING_HYPHENS = /-+$/;
const ISO_DATE_PREFIX = /^\d{4}-\d{2}-\d{2}/;

/**
 * Build a saved filename from the sent date and subject (PRD): a `YYYY-MM-DD`
 * prefix plus a lower kebab-case slug of the subject, capped at 120 characters,
 * with `.md` appended. Blank subjects fall back to `untitled-message` so every
 * Save has a valid filename. Chrome uniquifies any download collisions.
 */
export function buildFilename(input: {
  date: string;
  subject: string;
}): string {
  const datePrefix = toDatePrefix(input.date);
  const slug = slugify(input.subject) || FALLBACK_SLUG;
  const basename = capBasename(datePrefix ? `${datePrefix}-${slug}` : slug);
  return `${basename}.md`;
}

/**
 * Normalize a subject to a filesystem-friendly slug: lower kebab-case, `&`
 * spelled out as `and`, punctuation and whitespace collapsed to single hyphens,
 * and Unicode letters preserved (via NFC normalization so accents survive).
 */
function slugify(subject: string): string {
  return subject
    .normalize("NFC")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(NON_SLUG_CHARS, HYPHEN)
    .replace(REPEATED_HYPHENS, HYPHEN)
    .replace(EDGE_HYPHENS, "");
}

/** Take the `YYYY-MM-DD` portion of an ISO 8601 date, or "" if unrecognized. */
function toDatePrefix(date: string): string {
  const match = date.match(ISO_DATE_PREFIX);
  return match ? match[0] : "";
}

/** Cap the basename at the length limit without leaving a trailing hyphen. */
function capBasename(basename: string): string {
  if (basename.length <= MAX_BASENAME_LENGTH) {
    return basename;
  }
  return basename.slice(0, MAX_BASENAME_LENGTH).replace(TRAILING_HYPHENS, "");
}
