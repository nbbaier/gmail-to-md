/**
 * Message Body conversion entry point.
 *
 * This is the seam between the Export Document core and HTML-to-Markdown
 * conversion. For this slice it is intentionally minimal — it returns the
 * rendered body unchanged (raw HTML is valid inside Markdown). A later slice
 * replaces this with cleanup plus GitHub-Flavored Markdown conversion
 * (Turndown), without changing this signature or the `GmailMessage` boundary.
 */
export function convertBodyHtmlToMarkdown(bodyHtml: string): string {
  return bodyHtml.trim();
}
