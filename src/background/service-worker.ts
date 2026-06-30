/**
 * Background service worker.
 *
 * Routes Save and Copy requests from the popup to their delivery modes. The
 * routing and delivery logic itself lives in `router.ts`, `save.ts`, and
 * `copy.ts` so it can be unit tested without a real Chrome runtime.
 */
import type { ExportMessage } from "./messages.ts";
import { routeExportMessage } from "./router.ts";

chrome.runtime.onInstalled.addListener(() => {
  console.info("[gmail-to-md] service worker installed");
});

chrome.runtime.onMessage.addListener(
  (message: ExportMessage, _sender, sendResponse) => {
    routeExportMessage(message).then(sendResponse);
    return true;
  }
);
