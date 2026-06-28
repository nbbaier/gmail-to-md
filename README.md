# Gmail Message Export

A personal Chrome Manifest V3 extension that exports the selected Gmail message
as a clean local Markdown document. It reads only Gmail's rendered DOM and keeps
message content local — no Gmail API, OAuth, or network endpoints.

This is the project scaffold. The Export Document pipeline and Gmail extraction
are added in later slices.

## Requirements

- [Bun](https://bun.sh) (used for package management, scripts, tests, and the build)
- Google Chrome

## Setup

```sh
bun install
```

## Scripts

| Script           | Description                                            |
| ---------------- | ------------------------------------------------------ |
| `bun run build`  | Build the unpacked extension into `dist/`              |
| `bun run dev`    | Build and rebuild on source changes                    |
| `bun run check`  | Run Ultracite (lint + format), type checking, and tests |
| `bun run typecheck` | Type-check with `tsc --noEmit`                      |
| `bun run lint`   | Lint with Ultracite (`ultracite check`)                |
| `bun run format` | Lint-fix and format with Ultracite (`ultracite fix`)   |
| `bun test`       | Run unit tests                                         |

Linting and formatting use [Ultracite](https://ultracite.ai) on top of Biome;
the shared config lives in `biome.jsonc` and extends `ultracite/biome/core`.

## Loading in Chrome

1. Run `bun run build`.
2. Open `chrome://extensions`.
3. Enable **Developer mode**.
4. Click **Load unpacked** and select the `dist/` directory.

## Project layout

```
src/
  manifest.ts            Typed Manifest V3 definition (least-privilege)
  background/            Service worker
  popup/                 Popup shell (Save / Copy actions)
  options/               Options shell (Save Location)
build.ts                 Bun.build orchestration
tests/                   Bun unit tests
```

## Permissions

The manifest follows the least-privilege direction from the PRD: `activeTab`
plus `scripting` so the Gmail extractor is injected only after a user action,
with no broad always-on Gmail host permissions. `storage`, `downloads`, and
`offscreen` back settings, Save, and Copy respectively.
