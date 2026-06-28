import { describe, expect, test } from "bun:test";
import { generateExportDocument } from "../src/export/document.ts";
import type { GmailMessage } from "../src/export/message.ts";

const TRAILING_WHITESPACE = /[ \t]+$/;

function message(overrides: Partial<GmailMessage> = {}): GmailMessage {
  return {
    subject: "Quarterly Report",
    from: "sender@example.com",
    to: ["a@example.com"],
    cc: [],
    date: "2024-06-28T14:30:00Z",
    bodyHtml: "<p>Hello</p>",
    attachments: [],
    sourceUrl: "https://mail.google.com/mail/u/0/#inbox/abc123",
    ...overrides,
  };
}

describe("generateExportDocument", () => {
  test("returns canonical content plus the saved filename", () => {
    const doc = generateExportDocument(message());
    expect(doc.filename).toBe("2024-06-28-quarterly-report.md");
    expect(doc.content.startsWith("---\n")).toBe(true);
  });

  test("places the subject as an # H1 after the front matter", () => {
    const doc = generateExportDocument(
      message({ subject: "Quarterly Report" })
    );
    expect(doc.content).toContain("---\n\n# Quarterly Report\n");
  });

  test("includes an Attachments section only when attachments exist", () => {
    const without = generateExportDocument(message({ attachments: [] }));
    expect(without.content).not.toContain("## Attachments");

    const withAttachments = generateExportDocument(
      message({ attachments: ["report.pdf", "image.png"] })
    );
    expect(withAttachments.content).toContain(
      "## Attachments\n\n- report.pdf\n- image.png"
    );
  });

  test("lists attachment filenames as plain text, never links", () => {
    const doc = generateExportDocument(message({ attachments: ["notes.txt"] }));
    expect(doc.content).toContain("- notes.txt");
    expect(doc.content).not.toContain("](");
  });

  test("uses LF line endings with no carriage returns", () => {
    const doc = generateExportDocument(
      message({ bodyHtml: "<p>line one</p>\r\n<p>line two</p>" })
    );
    expect(doc.content).not.toContain("\r");
  });

  test("leaves no trailing whitespace on any line", () => {
    const doc = generateExportDocument(
      message({ bodyHtml: "trailing spaces here   \nand here  " })
    );
    for (const line of doc.content.split("\n")) {
      expect(line).toBe(line.replace(TRAILING_WHITESPACE, ""));
    }
  });

  test("ends with exactly one newline", () => {
    const doc = generateExportDocument(message());
    expect(doc.content.endsWith("\n")).toBe(true);
    expect(doc.content.endsWith("\n\n")).toBe(false);
  });

  test("keeps an empty subject valid: untitled filename, no trailing-space H1", () => {
    const doc = generateExportDocument(message({ subject: "" }));
    expect(doc.filename).toBe("2024-06-28-untitled-message.md");
    expect(doc.content).toContain("\n\n#\n");
    expect(doc.content).not.toContain("# \n");
  });

  test("keeps empty recipient arrays valid and serialized in front matter", () => {
    const doc = generateExportDocument(message({ to: [], cc: [] }));
    expect(doc.content).toContain("to: []");
    expect(doc.content).toContain("cc: []");
  });
});
