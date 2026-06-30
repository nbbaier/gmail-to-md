/**
 * The typed boundary between Gmail DOM extraction and Export Document
 * generation (PRD). Extraction (later slices) produces a complete `GmailMessage`
 * or a typed failure; everything downstream consumes only this model, so Gmail
 * selector breakage cannot leak into formatting or delivery code.
 */
export interface GmailMessage {
  /** Visible attachment filenames. Contents are never included. */
  attachments: string[];
  /** Rendered Message Body HTML, before Markdown conversion. */
  bodyHtml: string;
  /** CC recipients. Always an array; may be empty. */
  cc: string[];
  /** Sent date as an ISO 8601 string. */
  date: string;
  /** Sender, as a full email address where Gmail exposes one. */
  from: string;
  /** Clean Gmail conversation URL (not a guaranteed per-message permalink). */
  sourceUrl: string;
  /** Message subject. May be empty for legitimately subject-less messages. */
  subject: string;
  /** To recipients. Always an array; may be empty. */
  to: string[];
}
