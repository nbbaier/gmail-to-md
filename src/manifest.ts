import pkg from "../package.json" with { type: "json" };

/**
 * Manifest V3 definition for the Gmail Message Export extension.
 *
 * Least-privilege by design (PRD): the extension relies on `activeTab` plus
 * `scripting` so the Gmail extractor is injected only after the user invokes
 * Save or Copy. It deliberately avoids broad always-on Gmail host permissions.
 * `storage` backs the Save Location setting, `downloads` backs Save, and
 * `offscreen` backs clipboard writes for Copy in later slices.
 */
export const manifest: chrome.runtime.ManifestV3 = {
  manifest_version: 3,
  name: "Gmail Message Export",
  description:
    "Export the selected Gmail message as a local Markdown document.",
  version: pkg.version,
  permissions: ["activeTab", "scripting", "storage", "downloads", "offscreen"],
  action: {
    default_title: "Gmail Message Export",
    default_popup: "popup/popup.html",
  },
  options_ui: {
    page: "options/options.html",
    open_in_tab: true,
  },
  background: {
    service_worker: "background/service-worker.js",
    type: "module",
  },
};
