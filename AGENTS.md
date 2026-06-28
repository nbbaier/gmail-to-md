This is a Chrome Manifest V3 extension authored in plain TypeScript (no framework) and built with `Bun.build()` — see `build.ts`. It is not a server app; there is no `Bun.serve()`, dev server, or HMR.

## Bun

Default to Bun instead of Node.js.

- `bun <file>` instead of `node <file>` or `ts-node <file>`
- `bun test` instead of `jest` or `vitest`
- `bun install` / `bun run <script>` / `bunx <pkg>` instead of the npm/yarn/pnpm/npx equivalents
- Prefer `Bun.file`, `Bun.write`, and `Bun.Glob` over `node:fs` where practical (the build uses `node:fs` only for `watch`/`rm`).
- Bun automatically loads `.env`; don't use `dotenv`.

## Testing

Use `bun test` (`bun:test`). Tests live in `tests/`.

```ts
import { test, expect } from "bun:test";

test("hello world", () => {
  expect(1).toBe(1);
});
```

- Write assertions inside `it()` / `test()` blocks.
- Use async/await, not done callbacks.
- No `.only` or `.skip` in committed code.
- Keep suites reasonably flat — avoid deep `describe` nesting.

## Linting & formatting (Ultracite on Biome)

This project uses [Ultracite](https://ultracite.ai) on the Biome backend. Config is `biome.jsonc` (extends `ultracite/biome/core`).

- Fix: `bunx ultracite fix`
- Check: `bunx ultracite check`
- `bun run check` runs lint + `tsc --noEmit` + tests. Run it before committing.

Most formatting and common issues are auto-fixed by Biome. Spend your attention on what it can't check: business-logic correctness, meaningful naming, edge cases, and accessibility.

## Code standards

Write code that is accessible, type-safe, and maintainable. Prefer clarity over brevity.

**Type safety**
- Explicit types for function params/returns when they aid clarity.
- Prefer `unknown` over `any`; use `as const` for literals; prefer narrowing over assertions.
- Name constants instead of using magic numbers.

**Modern JS/TS**
- `const` by default, `let` only when reassigned, never `var`.
- Optional chaining (`?.`), nullish coalescing (`??`), template literals, destructuring.
- Prefer `for...of` over `.forEach()` / indexed loops.

**Async**
- Always `await` promises in async functions; prefer async/await over chains.
- Handle errors with meaningful try-catch; don't use async functions as Promise executors.

**Error handling & organization**
- Throw `Error` objects with descriptive messages, not strings.
- Prefer early returns over nested conditionals; extract complex conditions into named booleans.
- Keep functions focused; remove `console.log`/`debugger` from shipped code (intentional `console.info`/`error` diagnostics are fine).

**HTML / accessibility** (popup and options pages are plain HTML)
- Meaningful `alt` text, proper heading hierarchy, labels for inputs.
- Use semantic elements (`<button>`, `<nav>`) over divs with roles.
- Add `rel="noopener"` with `target="_blank"`.

**Security & performance**
- Avoid `dangerouslySetInnerHTML`-style raw HTML injection, `eval()`, and direct `document.cookie` writes; sanitize any content derived from Gmail's DOM.
- Top-level regex literals, not regex created inside loops.
- Prefer specific imports over namespace imports; avoid barrel files.
