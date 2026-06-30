import { describe, expect, test } from "bun:test";
import { buildFilename } from "../src/export/filename.ts";

const DATE = "2024-06-28T14:30:00Z";
const MD_EXTENSION = /\.md$/;

describe("buildFilename", () => {
  test("uses a YYYY-MM-DD date prefix plus a kebab-case subject", () => {
    expect(buildFilename({ date: DATE, subject: "Quarterly Report" })).toBe(
      "2024-06-28-quarterly-report.md"
    );
  });

  test("removes or hyphenizes punctuation", () => {
    expect(
      buildFilename({ date: DATE, subject: "Re: Lunch?! (tomorrow)" })
    ).toBe("2024-06-28-re-lunch-tomorrow.md");
  });

  test("converts & to and", () => {
    expect(buildFilename({ date: DATE, subject: "Sales & Marketing" })).toBe(
      "2024-06-28-sales-and-marketing.md"
    );
  });

  test("collapses repeated whitespace to single hyphens", () => {
    expect(buildFilename({ date: DATE, subject: "Hello    world" })).toBe(
      "2024-06-28-hello-world.md"
    );
  });

  test("collapses repeated hyphens", () => {
    expect(buildFilename({ date: DATE, subject: "a --- b" })).toBe(
      "2024-06-28-a-b.md"
    );
  });

  test("falls back to untitled-message for blank subjects", () => {
    expect(buildFilename({ date: DATE, subject: "   " })).toBe(
      "2024-06-28-untitled-message.md"
    );
  });

  test("preserves Unicode letters", () => {
    expect(buildFilename({ date: DATE, subject: "Café déjà vu" })).toBe(
      "2024-06-28-café-déjà-vu.md"
    );
  });

  test("caps the basename at 120 characters without a trailing hyphen", () => {
    const subject = "word ".repeat(60).trim();
    const filename = buildFilename({ date: DATE, subject });
    const basename = filename.replace(MD_EXTENSION, "");
    expect(basename.length).toBeLessThanOrEqual(120);
    expect(basename.endsWith("-")).toBe(false);
  });

  test("omits the date prefix when the date is not ISO 8601", () => {
    expect(buildFilename({ date: "not-a-date", subject: "Hello" })).toBe(
      "hello.md"
    );
  });
});
