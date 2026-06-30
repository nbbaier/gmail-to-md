import { describe, expect, test } from "bun:test";
import {
  buildDownloadFilename,
  buildDownloadUrl,
} from "../src/background/save.ts";

describe("buildDownloadUrl", () => {
  test("encodes the content as a base64 text/markdown data URL", () => {
    const url = buildDownloadUrl("# Hello\n");
    expect(url.startsWith("data:text/markdown;base64,")).toBe(true);
  });

  test("round-trips UTF-8 content, including non-ASCII characters", () => {
    const content = "# Café — naïve résumé 日本語\n";
    const url = buildDownloadUrl(content);
    const base64 = url.slice(url.indexOf(",") + 1);
    const decoded = new TextDecoder().decode(
      Uint8Array.from(atob(base64), (char) => char.charCodeAt(0))
    );
    expect(decoded).toBe(content);
  });
});

describe("buildDownloadFilename", () => {
  test("uses the bare filename when Save Location is blank", () => {
    expect(buildDownloadFilename("2024-06-28-report.md", "")).toBe(
      "2024-06-28-report.md"
    );
  });

  test("joins a configured Save Location as a Downloads subfolder", () => {
    expect(buildDownloadFilename("2024-06-28-report.md", "notes/gmail")).toBe(
      "notes/gmail/2024-06-28-report.md"
    );
  });
});
