/**
 * Options page entry point.
 *
 * For the scaffold slice this renders a single Save Location field and persists
 * it to Chrome local storage. Validation of the subfolder value is added in a
 * later slice alongside the Save pipeline.
 */

export {};

const STORAGE_KEY = "saveLocation";

function setStatus(message: string): void {
  const status = document.getElementById("status");
  if (status) {
    status.textContent = message;
  }
}

function getInput(): HTMLInputElement | null {
  return document.getElementById("save-location") as HTMLInputElement | null;
}

async function load(): Promise<void> {
  const input = getInput();
  if (!input) {
    return;
  }
  const stored = await chrome.storage.local.get(STORAGE_KEY);
  const value = stored[STORAGE_KEY];
  input.value = typeof value === "string" ? value : "";
}

document
  .getElementById("settings")
  ?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const input = getInput();
    if (!input) {
      return;
    }
    await chrome.storage.local.set({ [STORAGE_KEY]: input.value.trim() });
    setStatus("Saved.");
  });

load().catch((error: unknown) => {
  console.error(error);
});
