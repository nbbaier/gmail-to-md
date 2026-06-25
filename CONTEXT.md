# Gmail Message Export

This context describes the Gmail content selected by a user for export as a local Markdown document.

## Language

**Exportable Message**:
An ordinary received or sent email displayed by Gmail, regardless of the mailbox, label, or search view used to reach it. Drafts, compose windows, Chat items, and confidential-mode messages are outside this boundary.
_Avoid_: Email, Gmail item

**Selected Message**:
The Exportable Message identified either by the sole checked row in a Gmail message list or by the sole expanded message in an open Gmail conversation. If the current view identifies zero or multiple messages, there is no Selected Message.
_Avoid_: Current message, open email

**Export Document**:
A local Markdown representation of one Selected Message, including its subject, sender, To and CC recipients, sent date, Gmail source URL, Message Body, and any Attachment References.
_Avoid_: Export, download, Markdown message

**Save**:
Deliver the Export Document as a local `.md` file.
_Avoid_: Download, file export

**Save Location**:
An optional subfolder within Chrome's configured Downloads directory. With no configured Save Location, files are saved at the root of that directory.
_Avoid_: Output path, arbitrary folder

**Copy**:
Deliver the exact contents of the Export Document to the system clipboard.
_Avoid_: Copy message, copy body

**Source URL**:
The clean Gmail URL for the conversation displaying the Selected Message. It may reopen the conversation without expanding that exact message.
_Avoid_: Message permalink, canonical URL

**Message Body**:
The content contained within the Selected Message, including signatures, unsubscribe links, quoted replies, and forwarded-message blocks. Gmail controls and other interface chrome are not part of the Message Body.
_Avoid_: Email content, message page

**Message Image**:
A meaningful image contained in the Message Body. Tracking pixels and attached files are not Message Images.
_Avoid_: Attachment, embedded asset

**Attachment Reference**:
The visible filename of a file attached to the Selected Message. An Attachment Reference does not include the file's contents or a download link.
_Avoid_: Attachment, attachment download

## MVP Constraints

- The extractor reads only Gmail's rendered DOM. The MVP does not use the Gmail API, OAuth, Gmail network endpoints, or "Show original" parsing.
- This constraint is intentionally reversible if real usage shows that rendered DOM extraction cannot support the desired workflow.
