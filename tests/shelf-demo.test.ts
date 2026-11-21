import assert from "node:assert/strict";
import test from "node:test";
import {
  initialShelfDemo,
  shelfClips,
  shelfDemoReducer,
} from "../lib/shelf-demo";

test("native-style history combines kind filters with text and metadata search", () => {
  let state = shelfDemoReducer(initialShelfDemo, {
    kind: "search",
    value: "  STUDIO  ",
  });
  assert.ok(
    shelfClips(state, false).some((clip) => clip.id === "studio-quote"),
  );
  state = shelfDemoReducer(state, { kind: "filter", value: "image" });
  assert.deepEqual(
    shelfClips(state, false).map((clip) => clip.id),
    ["studio-image"],
  );
  state = shelfDemoReducer(state, { kind: "search", value: "no such item" });
  assert.equal(shelfClips(state, false).length, 0);
});

test("clearing retains pinned items and Undo restores the original history", () => {
  let state = shelfDemoReducer(initialShelfDemo, {
    kind: "pin",
    id: "design-link",
  });
  const before = state.clips;
  state = shelfDemoReducer(state, { kind: "clear" });
  assert.deepEqual(
    state.clips.map((clip) => clip.id),
    ["studio-quote", "design-link"],
  );
  state = shelfDemoReducer(state, { kind: "undo" });
  assert.deepEqual(state.clips, before);
  state = shelfDemoReducer(state, { kind: "delete", id: "studio-image" });
  assert.equal(
    state.clips.some((clip) => clip.id === "studio-image"),
    false,
  );
  assert.deepEqual(shelfDemoReducer(state, { kind: "undo" }).clips, before);
});

test("editing a snippet keeps its identity and pin without creating duplicates", () => {
  const state = shelfDemoReducer(initialShelfDemo, {
    kind: "save-text",
    id: "studio-quote",
    value: "Keep the useful things close.",
  });
  assert.equal(state.clips.length, initialShelfDemo.clips.length);
  assert.equal(
    state.clips.filter((clip) => clip.id === "studio-quote").length,
    1,
  );
  assert.equal(state.clips[0].pinned, true);
  assert.equal(state.clips[0].title, "Keep the useful things close.");
  assert.equal(state.filter, "text");
  assert.deepEqual(
    shelfDemoReducer(state, { kind: "save-text", id: null, value: "  " }),
    state,
  );
});

test("a collected PDF appears once, supports search and is kept separate from fixture editing", () => {
  const state = shelfDemoReducer(initialShelfDemo, {
    kind: "search",
    value: "Studio notes.pdf",
  });
  assert.equal(shelfClips(state, false).length, 0);
  assert.equal(shelfClips(state, true).length, 1);
  assert.equal(shelfClips(state, true)[0].id, "handoff-pdf");
  assert.equal(
    initialShelfDemo.clips.some((clip) => clip.id === "handoff-pdf"),
    false,
  );
});

test("reset restores sample content, appearance, menus and the main history view", () => {
  let state = shelfDemoReducer(initialShelfDemo, {
    kind: "theme",
    value: "light",
  });
  state = shelfDemoReducer(state, {
    kind: "view",
    value: { kind: "preview", id: "studio-image" },
  });
  state = shelfDemoReducer(state, { kind: "delete", id: "studio-color" });
  assert.deepEqual(
    shelfDemoReducer(state, { kind: "reset" }),
    initialShelfDemo,
  );
});

test("new snippets remain separate and importing the same file never duplicates its history row", () => {
  let state = shelfDemoReducer(initialShelfDemo, {
    kind: "save-text",
    id: null,
    value: "First saved snippet",
  });
  state = shelfDemoReducer(state, {
    kind: "save-text",
    id: null,
    value: "Second saved snippet",
  });
  assert.equal(
    state.clips.filter((clip) => clip.id.startsWith("written-snippet-")).length,
    2,
  );
  const file = {
    id: "imported",
    kind: "file",
    title: "Notes.pdf",
    detail: "Just now",
    pinned: false,
    note: "",
    members: ["Notes.pdf"],
  } satisfies import("../lib/shelf-demo").ShelfClip;
  state = shelfDemoReducer(state, { kind: "import-clip", clip: file });
  state = shelfDemoReducer(state, { kind: "pin", id: file.id });
  state = shelfDemoReducer(state, { kind: "import-clip", clip: file });
  assert.equal(state.clips.filter((clip) => clip.id === file.id).length, 1);
  assert.equal(state.clips[0].pinned, true);
});
