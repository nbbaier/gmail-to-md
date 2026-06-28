import { describe, expect, test } from "bun:test";
import { manifest } from "../src/manifest.ts";

describe("manifest", () => {
  test("targets Manifest V3", () => {
    expect(manifest.manifest_version).toBe(3);
  });

  test("declares the popup and options shells", () => {
    expect(manifest.action?.default_popup).toBe("popup/popup.html");
    expect(manifest.options_ui?.page).toBe("options/options.html");
  });

  test("stays least-privilege: activeTab + scripting, no host permissions", () => {
    expect(manifest.permissions).toContain("activeTab");
    expect(manifest.permissions).toContain("scripting");
    expect(manifest.host_permissions ?? []).toEqual([]);
  });
});
