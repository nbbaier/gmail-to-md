import { getSaveLocation } from "../settings/save-location.ts";
import { copyExportDocument } from "./copy.ts";
import type { ExportMessage, ExportMessageResponse } from "./messages.ts";
import { saveExportDocument } from "./save.ts";

/** Injectable so routing can be tested without a real Chrome runtime. */
export interface ExportMessageDeps {
  copyExportDocument: typeof copyExportDocument;
  getSaveLocation: typeof getSaveLocation;
  saveExportDocument: typeof saveExportDocument;
}

const defaultDeps: ExportMessageDeps = {
  getSaveLocation,
  saveExportDocument,
  copyExportDocument,
};

/**
 * Route a Save or Copy request to its delivery mode. Both modes deliver the
 * same `ExportMessage.document`, so Save and Copy always produce identical
 * content (PRD). Failures are caught and reported rather than thrown, so the
 * service worker always responds to the popup.
 */
export async function routeExportMessage(
  message: ExportMessage,
  deps: ExportMessageDeps = defaultDeps
): Promise<ExportMessageResponse> {
  try {
    if (message.type === "save-export-document") {
      const saveLocation = await deps.getSaveLocation();
      await deps.saveExportDocument(message.document, saveLocation);
    } else {
      await deps.copyExportDocument(message.document);
    }
    return { ok: true };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}
