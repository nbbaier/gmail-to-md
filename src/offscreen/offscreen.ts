/**
 * Offscreen document for the Copy delivery mode (PRD): an MV3 service worker
 * has no clipboard access, so Copy writes through this scoped offscreen
 * document instead.
 */

export {};

interface CopyToClipboardMessage {
  target: "offscreen";
  text: string;
  type: "copy-to-clipboard";
}

function isCopyToClipboardMessage(
  message: unknown
): message is CopyToClipboardMessage {
  return (
    typeof message === "object" &&
    message !== null &&
    (message as { target?: unknown }).target === "offscreen" &&
    (message as { type?: unknown }).type === "copy-to-clipboard"
  );
}

chrome.runtime.onMessage.addListener(
  (message: unknown, _sender, sendResponse) => {
    if (!isCopyToClipboardMessage(message)) {
      return;
    }

    try {
      writeToClipboard(message.text);
      sendResponse({ ok: true });
    } catch (error) {
      sendResponse({
        ok: false,
        error: error instanceof Error ? error.message : String(error),
      });
    }
    return false;
  }
);

/**
 * Offscreen documents never receive window focus, which makes
 * `navigator.clipboard.writeText` throw "Document is not focused." Use the
 * legacy `execCommand("copy")` path via a selectable textarea instead — it
 * does not require focus.
 */
function writeToClipboard(text: string): void {
  const buffer = document.getElementById(
    "clipboard-buffer"
  ) as HTMLTextAreaElement | null;
  if (!buffer) {
    throw new Error("Offscreen clipboard buffer is missing.");
  }

  buffer.value = text;
  buffer.select();
  const copied = document.execCommand("copy");
  buffer.value = "";

  if (!copied) {
    throw new Error("execCommand('copy') was rejected by the browser.");
  }
}
