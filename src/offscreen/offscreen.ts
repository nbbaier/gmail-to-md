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

    navigator.clipboard.writeText(message.text).then(
      () => sendResponse({ ok: true }),
      (error: unknown) =>
        sendResponse({
          ok: false,
          error: error instanceof Error ? error.message : String(error),
        })
    );
    return true;
  }
);
