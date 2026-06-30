/**
 * Options page entry point.
 *
 * Renders the single Save Location field (PRD): an optional subfolder under
 * Chrome's configured Downloads directory, stored in local (unsynced)
 * extension storage. The field can be viewed, edited, validated, saved, and
 * cleared back to the Downloads root default.
 */
import {
  clearSaveLocation,
  getSaveLocation,
  setSaveLocation,
  validateSaveLocation,
} from "../settings/save-location.ts";

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
  input.value = await getSaveLocation();
}

document
  .getElementById("settings")
  ?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const input = getInput();
    if (!input) {
      return;
    }
    const result = validateSaveLocation(input.value);
    if (!result.ok) {
      setStatus(result.error ?? "Invalid Save Location.");
      return;
    }
    await setSaveLocation(result.value);
    input.value = result.value;
    setStatus("Saved.");
  });

document.getElementById("clear")?.addEventListener("click", () => {
  clearSaveLocation()
    .then(() => {
      const input = getInput();
      if (input) {
        input.value = "";
      }
      setStatus("Cleared. Saving at the Downloads root.");
    })
    .catch((error: unknown) => {
      console.error(error);
      setStatus("Failed to clear Save Location.");
    });
});

load().catch((error: unknown) => {
  console.error(error);
});
