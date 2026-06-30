import type { ExportDocument } from "../export/document.ts";

const OFFSCREEN_DOCUMENT_PATH = "offscreen/offscreen.html";

/**
 * Chrome allows only one offscreen document per extension. Concurrent Copy
 * requests can each observe zero existing contexts before either finishes
 * creating one, so the second `createDocument` call would reject with
 * "Only a single offscreen document may be created." Sharing this in-flight
 * creation promise serializes them instead.
 */
let creatingOffscreenDocument: Promise<void> | null = null;

/**
 * Copy the Export Document to the system clipboard via the offscreen
 * document. Copy and Save both consume the same `ExportDocument.content`, so
 * the two delivery modes always produce identical output.
 */
export async function copyExportDocument(
  document: ExportDocument
): Promise<void> {
  await ensureOffscreenDocument();

  const response = (await chrome.runtime.sendMessage({
    target: "offscreen",
    type: "copy-to-clipboard",
    text: document.content,
  })) as { ok: boolean; error?: string } | undefined;

  if (!response?.ok) {
    throw new Error(response?.error ?? "Failed to copy to the clipboard.");
  }
}

async function ensureOffscreenDocument(): Promise<void> {
  const existing = await chrome.runtime.getContexts({
    contextTypes: [chrome.runtime.ContextType.OFFSCREEN_DOCUMENT],
    documentUrls: [chrome.runtime.getURL(OFFSCREEN_DOCUMENT_PATH)],
  });

  if (existing.length > 0) {
    return;
  }

  if (!creatingOffscreenDocument) {
    creatingOffscreenDocument = chrome.offscreen
      .createDocument({
        url: OFFSCREEN_DOCUMENT_PATH,
        reasons: [chrome.offscreen.Reason.CLIPBOARD],
        justification:
          "Write the generated Export Document to the system clipboard for the Copy delivery mode.",
      })
      .finally(() => {
        creatingOffscreenDocument = null;
      });
  }

  await creatingOffscreenDocument;
}
