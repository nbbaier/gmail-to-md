/**
 * Save Location setting (PRD): an optional subfolder under Chrome's configured
 * Downloads directory, stored in Chrome local extension storage (not synced).
 * Blank means the Downloads root.
 */

const STORAGE_KEY = "saveLocation";

/** Disallow leading/trailing slashes and traversal; segments are letters, numbers, spaces, `_`, `.`, `-`. */
const SEGMENT_PATTERN = /^[\p{L}\p{N} _.-]+$/u;

export interface SaveLocationValidation {
  error?: string;
  ok: boolean;
  value: string;
}

/**
 * Validate a raw Save Location input. Blank is always valid (Downloads root).
 * Rejects absolute paths, traversal (`..`), and characters that are unsafe in
 * a Downloads subfolder path.
 */
export function validateSaveLocation(raw: string): SaveLocationValidation {
  const value = raw.trim();
  if (value === "") {
    return { ok: true, value };
  }

  const segments = value.split("/");
  const allSegmentsValid = segments.every(
    (segment) =>
      segment !== "" && segment !== ".." && SEGMENT_PATTERN.test(segment)
  );

  if (!allSegmentsValid) {
    return {
      ok: false,
      value,
      error:
        "Save Location must be a relative subfolder path (letters, numbers, spaces, _, ., -), with no leading/trailing slash or '..'.",
    };
  }

  return { ok: true, value };
}

/** Read the stored Save Location, defaulting to "" (Downloads root). */
export async function getSaveLocation(): Promise<string> {
  const stored = await chrome.storage.local.get(STORAGE_KEY);
  const value = stored[STORAGE_KEY];
  return typeof value === "string" ? value : "";
}

/** Persist a validated Save Location to local (unsynced) storage. */
export async function setSaveLocation(value: string): Promise<void> {
  await chrome.storage.local.set({ [STORAGE_KEY]: value });
}

/** Clear the stored Save Location back to the Downloads root default. */
export async function clearSaveLocation(): Promise<void> {
  await chrome.storage.local.remove(STORAGE_KEY);
}
