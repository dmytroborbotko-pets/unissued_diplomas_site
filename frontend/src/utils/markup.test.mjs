import { test } from "node:test";
import assert from "node:assert/strict";
import { toBlocks } from "./markup.js";

test("toBlocks: paragraphs, highlighted runs and links", () => {
  assert.deepEqual(toBlocks("a **b** c\n\n[d](https://x.y) e"), [
    { type: "paragraph", children: [{ type: "text", text: "a " }, { type: "text", text: "b", bold: true }, { type: "text", text: " c" }] },
    { type: "paragraph", children: [{ type: "link", url: "https://x.y", children: [{ type: "text", text: "d" }] }, { type: "text", text: " e" }] },
  ]);
  assert.deepEqual(toBlocks("line 1\nline 2"), [{ type: "paragraph", children: [{ type: "text", text: "line 1\nline 2" }] }]);
});
