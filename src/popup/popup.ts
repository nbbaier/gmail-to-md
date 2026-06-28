/**
 * Popup entry point.
 *
 * Exposes the two delivery modes from the PRD: Save Markdown and Copy Markdown.
 * These actions are present but not yet wired to real export behavior; later
 * slices connect them to the Export Document pipeline.
 */

export {};

function setStatus(message: string): void {
  const status = document.getElementById("status");
  if (status) {
    status.textContent = message;
  }
}

document.getElementById("save")?.addEventListener("click", () => {
  setStatus("Save Markdown is not wired up yet.");
});

document.getElementById("copy")?.addEventListener("click", () => {
  setStatus("Copy Markdown is not wired up yet.");
});
