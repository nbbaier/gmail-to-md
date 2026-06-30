import type { ExportDocument } from "../export/document.ts";

/** Popup → background runtime message: deliver an already-generated Export Document. */
export interface SaveExportMessage {
  document: ExportDocument;
  type: "save-export-document";
}

export interface CopyExportMessage {
  document: ExportDocument;
  type: "copy-export-document";
}

export type ExportMessage = SaveExportMessage | CopyExportMessage;

export interface ExportMessageResponse {
  error?: string;
  ok: boolean;
}
