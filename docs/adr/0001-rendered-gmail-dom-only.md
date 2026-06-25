# Use Gmail's rendered DOM as the extraction source

For the MVP, the extension extracts the Selected Message from Gmail's rendered DOM only. It does not use the Gmail API, OAuth, undocumented network endpoints, or "Show original" parsing, because the tool should stay local, lightweight, least-privilege, and personal while avoiding account-level authorization flows.

## Considered Options

- Rendered Gmail DOM extraction
- Gmail API with OAuth
- Undocumented Gmail network endpoints
- "Show original" or raw message parsing

## Consequences

This keeps the extension simple and privacy-preserving, but makes extraction dependent on Gmail's UI structure. The extractor boundary around `GmailMessage` is intended to keep that fragility isolated so the decision can be revisited if real usage shows the DOM is not reliable enough.
