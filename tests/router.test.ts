import { describe, expect, test } from "bun:test";
import { routeExportMessage } from "../src/background/router.ts";
import type { ExportDocument } from "../src/export/document.ts";

const DOCUMENT: ExportDocument = {
  content: '---\nsubject: "Quarterly Report"\n---\n\n# Quarterly Report\n',
  filename: "2024-06-28-quarterly-report.md",
};

describe("routeExportMessage", () => {
  test("save requests read Save Location and deliver the document through saveExportDocument", async () => {
    const calls: [ExportDocument, string][] = [];
    const response = await routeExportMessage(
      { type: "save-export-document", document: DOCUMENT },
      {
        getSaveLocation: () => Promise.resolve("notes"),
        saveExportDocument: (document, saveLocation) => {
          calls.push([document, saveLocation]);
          return Promise.resolve();
        },
        copyExportDocument: () =>
          Promise.reject(new Error("copy should not be called")),
      }
    );

    expect(response).toEqual({ ok: true });
    expect(calls).toEqual([[DOCUMENT, "notes"]]);
  });

  test("copy requests deliver the same document through copyExportDocument, bypassing Save Location", async () => {
    const copied: ExportDocument[] = [];
    const response = await routeExportMessage(
      { type: "copy-export-document", document: DOCUMENT },
      {
        getSaveLocation: () =>
          Promise.reject(new Error("getSaveLocation should not be called")),
        saveExportDocument: () =>
          Promise.reject(new Error("save should not be called")),
        copyExportDocument: (document) => {
          copied.push(document);
          return Promise.resolve();
        },
      }
    );

    expect(response).toEqual({ ok: true });
    expect(copied).toEqual([DOCUMENT]);
    expect(copied[0]).toBe(DOCUMENT);
  });

  test("fails closed and reports the error message when delivery throws", async () => {
    const response = await routeExportMessage(
      { type: "save-export-document", document: DOCUMENT },
      {
        getSaveLocation: () => Promise.resolve(""),
        saveExportDocument: () => Promise.reject(new Error("disk full")),
        copyExportDocument: () => Promise.resolve(),
      }
    );

    expect(response).toEqual({ ok: false, error: "disk full" });
  });

  test("reports a generic message when a thrown value is not an Error", async () => {
    const response = await routeExportMessage(
      { type: "copy-export-document", document: DOCUMENT },
      {
        getSaveLocation: () => Promise.resolve(""),
        saveExportDocument: () => Promise.resolve(),
        copyExportDocument: () => Promise.reject("clipboard denied"),
      }
    );

    expect(response).toEqual({ ok: false, error: "clipboard denied" });
  });
});
