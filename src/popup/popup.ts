/**
 * Popup entry point.
 *
 * Wires the two delivery modes from the PRD: Save Markdown and Copy Markdown.
 * Both build the same Export Document and route it to the background service
 * worker, which delivers it via `chrome.downloads` or the offscreen clipboard
 * document respectively.
 *
 * This slice (#4/#5) proves Save and Copy delivery end to end; it stands in a
 * fixture `GmailMessage` rather than extracting from Gmail's DOM. Real
 * extraction of the Selected Message lands in #6.
 */
import type {
  ExportMessage,
  ExportMessageResponse,
} from "../background/messages.ts";
import { generateExportDocument } from "../export/document.ts";
import type { GmailMessage } from "../export/message.ts";

// TODO(#6): replace with the real Selected Message extracted from Gmail's DOM.
const FIXTURE_MESSAGE: GmailMessage = {
  subject: "Sample Gmail Message",
  from: "sender@example.com",
  to: ["recipient@example.com"],
  cc: [],
  date: new Date().toISOString(),
  bodyHtml: "<p>This is a placeholder message body.</p>",
  attachments: [],
  sourceUrl: "https://mail.google.com/mail/u/0/#inbox",
};

function setStatus(text: string): void {
  const status = document.getElementById("status");
  if (status) {
    status.textContent = text;
  }
}

async function deliver(
  type: ExportMessage["type"],
  pendingText: string,
  successText: string
): Promise<void> {
  setStatus(pendingText);
  const exportDocument = generateExportDocument(FIXTURE_MESSAGE);
  const request: ExportMessage = { type, document: exportDocument };
  const response = (await chrome.runtime.sendMessage(
    request
  )) as ExportMessageResponse;
  setStatus(response?.ok ? successText : (response?.error ?? "Export failed."));
}

document.getElementById("save")?.addEventListener("click", () => {
  deliver("save-export-document", "Saving…", "Saved.").catch(
    (error: unknown) => {
      setStatus(error instanceof Error ? error.message : "Save failed.");
    }
  );
});

document.getElementById("copy")?.addEventListener("click", () => {
  deliver("copy-export-document", "Copying…", "Copied.").catch(
    (error: unknown) => {
      setStatus(error instanceof Error ? error.message : "Copy failed.");
    }
  );
});
