import type { ExportDocument } from "../export/document.ts";

const MIME_TYPE = "text/markdown";

/** Build a `data:` URL for the Export Document content, UTF-8 safe. */
export function buildDownloadUrl(content: string): string {
  const bytes = new TextEncoder().encode(content);
  let binary = "";
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }
  return `data:${MIME_TYPE};base64,${btoa(binary)}`;
}

/** Join the Save Location subfolder onto the filename, or use the filename alone at the Downloads root. */
export function buildDownloadFilename(
  filename: string,
  saveLocation: string
): string {
  return saveLocation ? `${saveLocation}/${filename}` : filename;
}

/**
 * Save the Export Document as a `.md` file through Chrome's downloads API.
 * Filename collisions are left to Chrome's own uniquify behavior.
 */
export async function saveExportDocument(
  document: ExportDocument,
  saveLocation: string
): Promise<void> {
  await chrome.downloads.download({
    url: buildDownloadUrl(document.content),
    filename: buildDownloadFilename(document.filename, saveLocation),
    saveAs: false,
  });
}
