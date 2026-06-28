/**
 * Background service worker.
 *
 * For the scaffold slice this only confirms the worker loads. Later slices wire
 * up message handling for the Save (downloads) and Copy (offscreen clipboard)
 * delivery modes described in the PRD.
 */

chrome.runtime.onInstalled.addListener(() => {
  console.info("[gmail-to-md] service worker installed");
});

export {};
