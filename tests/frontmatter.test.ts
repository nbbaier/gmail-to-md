import { describe, expect, test } from "bun:test";
import { buildFrontMatter } from "../src/export/frontmatter.ts";
import type { GmailMessage } from "../src/export/message.ts";

function message(overrides: Partial<GmailMessage> = {}): GmailMessage {
  return {
    subject: "Subject",
    from: "sender@example.com",
    to: [],
    cc: [],
    date: "2024-06-28T14:30:00Z",
    bodyHtml: "<p>Body</p>",
    attachments: [],
    sourceUrl: "https://mail.google.com/mail/u/0/#inbox/abc123",
    ...overrides,
  };
}

describe("buildFrontMatter", () => {
  test("renders fields in order, wrapped in --- fences", () => {
    const lines = buildFrontMatter(message()).split("\n");
    expect(lines[0]).toBe("---");
    expect(lines.at(-1)).toBe("---");
    expect(lines.slice(1, -1).map((line) => line.split(":")[0])).toEqual([
      "subject",
      "from",
      "to",
      "cc",
      "date",
      "source",
    ]);
  });

  test("always renders to and cc, as [] when empty", () => {
    const result = buildFrontMatter(message({ to: [], cc: [] }));
    expect(result).toContain("to: []");
    expect(result).toContain("cc: []");
  });

  test("renders populated recipients as quoted flow arrays", () => {
    const result = buildFrontMatter(
      message({ to: ["a@example.com", "b@example.com"], cc: ["c@example.com"] })
    );
    expect(result).toContain('to: ["a@example.com", "b@example.com"]');
    expect(result).toContain('cc: ["c@example.com"]');
  });

  test("preserves the ISO 8601 date verbatim", () => {
    const result = buildFrontMatter(message({ date: "2024-06-28T14:30:00Z" }));
    expect(result).toContain('date: "2024-06-28T14:30:00Z"');
  });

  test("places the Source URL as the final field before the closing fence", () => {
    const lines = buildFrontMatter(
      message({ sourceUrl: "https://example.com/x" })
    ).split("\n");
    expect(lines.at(-2)).toBe('source: "https://example.com/x"');
  });

  test("escapes quotes and backslashes in scalar values", () => {
    const result = buildFrontMatter(
      message({ subject: 'He said "hi" \\ bye' })
    );
    expect(result).toContain('subject: "He said \\"hi\\" \\\\ bye"');
  });
});
