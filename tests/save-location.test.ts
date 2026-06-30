import { describe, expect, test } from "bun:test";
import {
  clearSaveLocation,
  getSaveLocation,
  setSaveLocation,
  validateSaveLocation,
} from "../src/settings/save-location.ts";

describe("validateSaveLocation", () => {
  test("accepts a blank value as the Downloads root", () => {
    expect(validateSaveLocation("")).toEqual({ ok: true, value: "" });
    expect(validateSaveLocation("   ")).toEqual({ ok: true, value: "" });
  });

  test("accepts a simple subfolder", () => {
    expect(validateSaveLocation("gmail exports")).toEqual({
      ok: true,
      value: "gmail exports",
    });
  });

  test("accepts a nested subfolder", () => {
    expect(validateSaveLocation("notes/gmail")).toEqual({
      ok: true,
      value: "notes/gmail",
    });
  });

  test("trims surrounding whitespace", () => {
    expect(validateSaveLocation("  notes  ")).toEqual({
      ok: true,
      value: "notes",
    });
  });

  test("rejects a leading slash", () => {
    expect(validateSaveLocation("/notes").ok).toBe(false);
  });

  test("rejects a trailing slash", () => {
    expect(validateSaveLocation("notes/").ok).toBe(false);
  });

  test("rejects path traversal", () => {
    expect(validateSaveLocation("notes/../etc").ok).toBe(false);
    expect(validateSaveLocation("..").ok).toBe(false);
  });

  test("rejects empty path segments", () => {
    expect(validateSaveLocation("notes//gmail").ok).toBe(false);
  });
});

describe("Save Location storage", () => {
  test("round-trips through get/set, and clear restores the Downloads root default", async () => {
    const store = new Map<string, unknown>();
    globalThis.chrome = {
      storage: {
        local: {
          get: (key: string) => Promise.resolve({ [key]: store.get(key) }),
          set: (items: Record<string, unknown>) => {
            for (const [key, value] of Object.entries(items)) {
              store.set(key, value);
            }
            return Promise.resolve();
          },
          remove: (key: string) => {
            store.delete(key);
            return Promise.resolve();
          },
        },
      },
    } as unknown as typeof chrome;

    expect(await getSaveLocation()).toBe("");

    await setSaveLocation("notes/gmail");
    expect(await getSaveLocation()).toBe("notes/gmail");

    await clearSaveLocation();
    expect(await getSaveLocation()).toBe("");
  });
});
