/**
 * Build the unpacked Manifest V3 extension into `dist/`.
 *
 * - Bundles the TypeScript entry points (popup, options, service worker) with
 *   `Bun.build()`, preserving their `src/` directory structure.
 * - Copies static assets (HTML, CSS) alongside their bundles.
 * - Writes `manifest.json` from the typed manifest source.
 *
 * Pass `--watch` to rebuild on source changes.
 */

import { watch } from "node:fs";
import { rm } from "node:fs/promises";
import { join, relative } from "node:path";
import { manifest } from "./src/manifest.js";

const SRC = "src";
const OUT = "dist";

const ENTRYPOINTS = [
  "src/popup/popup.ts",
  "src/options/options.ts",
  "src/background/service-worker.ts",
];

async function build(): Promise<void> {
  await rm(OUT, { recursive: true, force: true });

  const result = await Bun.build({
    entrypoints: ENTRYPOINTS,
    outdir: OUT,
    root: SRC,
    target: "browser",
    format: "esm",
    minify: false,
    naming: "[dir]/[name].[ext]",
  });

  if (!result.success) {
    for (const log of result.logs) {
      console.error(log);
    }
    throw new AggregateError(result.logs, "Bundle failed");
  }

  await copyStaticAssets();
  await writeManifest();

  console.info(`[gmail-to-md] built ${OUT}/`);
}

async function copyStaticAssets(): Promise<void> {
  const glob = new Bun.Glob("**/*.{html,css}");
  for await (const file of glob.scan({ cwd: SRC })) {
    const from = join(SRC, file);
    const to = join(OUT, file);
    await Bun.write(to, Bun.file(from));
  }
}

async function writeManifest(): Promise<void> {
  await Bun.write(
    join(OUT, "manifest.json"),
    `${JSON.stringify(manifest, null, 2)}\n`
  );
}

await build();

if (process.argv.includes("--watch")) {
  console.info("[gmail-to-md] watching for changes…");
  let queued = false;
  watch(SRC, { recursive: true }, (_event, filename) => {
    if (queued) {
      return;
    }
    queued = true;
    queueMicrotask(async () => {
      queued = false;
      try {
        await build();
        console.info(
          `[gmail-to-md] rebuilt (${filename ? relative(SRC, filename) : "change"})`
        );
      } catch (error) {
        console.error(error);
      }
    });
  });
}
