import assert from "node:assert/strict";
import test from "node:test";
import {
  demoReducer,
  demoFileDrop,
  demoWorkspace,
  initialDemo,
  tour,
  type DemoState,
  type DemoAction,
} from "../lib/demo";

function run(actions: DemoAction[], initial: DemoState = initialDemo) {
  return actions.reduce(demoReducer, initial);
}

test("the guided file tour collects, retracts, switches, reopens and drops", () => {
  let state = demoReducer(initialDemo, { kind: "watch", manual: false });
  let sawClosedFile = false;
  let sawReopenedFile = false;
  for (let index = 0; index < tour.length; index++) {
    const workspace = demoWorkspace(state);
    if (workspace.fileSaved && !workspace.shelfOpen && !workspace.attached)
      sawClosedFile = true;
    if (sawClosedFile && workspace.shelfOpen && workspace.fileSaved)
      sawReopenedFile = true;
    state = demoReducer(state, { kind: "advance" });
  }
  assert.equal(state.kind, "watch");
  if (state.kind === "watch") assert.equal(state.playback, "complete");
  assert.equal(demoWorkspace(state).window, "message");
  assert.equal(demoWorkspace(state).attached, true);
  assert.equal(demoWorkspace(state).shelfOpen, false);
  assert.equal(sawClosedFile, true);
  assert.equal(sawReopenedFile, true);
});

test("hands-on text selection reuses one saved snippet across windows", () => {
  const state = run([
    { kind: "try" },
    { kind: "copy-text" },
    { kind: "copy-text" },
    { kind: "open-shelf" },
    { kind: "switch-window", window: "message" },
  ]);
  assert.equal(demoWorkspace(state).shelfOpen, true);
  assert.equal(demoWorkspace(state).textSaved, true);
  const pasted = run([{ kind: "select-text" }, { kind: "paste" }], state);
  assert.equal(demoWorkspace(pasted).pasted, true);
  assert.equal(demoWorkspace(pasted).shelfOpen, false);
});

test("files require a shelf handoff before attachment and can accompany pasted text", () => {
  const emptyMessage = run([
    { kind: "try" },
    { kind: "switch-window", window: "message" },
    { kind: "attach-file" },
    { kind: "paste" },
  ]);
  assert.equal(demoWorkspace(emptyMessage).attached, false);
  assert.equal(demoWorkspace(emptyMessage).pasted, false);
  const attached = run(
    [
      { kind: "save-file" },
      { kind: "attach-file" },
      { kind: "copy-text" },
      { kind: "paste" },
    ],
    emptyMessage,
  );
  assert.equal(demoWorkspace(attached).attached, true);
  assert.equal(demoWorkspace(attached).pasted, true);
  assert.equal(demoWorkspace(attached).fileSaved, true);
});

test("switching to hands-on mode ignores a late tour tick and reset removes all sample changes", () => {
  const state = run([
    { kind: "watch", manual: false },
    { kind: "advance" },
    { kind: "try" },
  ]);
  assert.deepEqual(demoReducer(state, { kind: "advance" }), state);
  const changed = run(
    [
      { kind: "copy-text" },
      { kind: "save-file" },
      { kind: "switch-window", window: "message" },
      { kind: "paste" },
      { kind: "attach-file" },
    ],
    state,
  );
  assert.deepEqual(demoReducer(changed, { kind: "reset" }), state);
});

test("reduced-motion mode waits for explicit steps and replay starts from a clean desktop", () => {
  const manual = demoReducer(initialDemo, { kind: "watch", manual: true });
  if (manual.kind === "watch") assert.equal(manual.playback, "paused");
  let collected = manual;
  for (let index = 0; index < 5; index++)
    collected = demoReducer(collected, { kind: "advance" });
  assert.equal(demoWorkspace(collected).fileSaved, true);
  assert.equal(demoWorkspace(manual).fileSaved, false);
  const replay = demoReducer(collected, { kind: "watch", manual: false });
  assert.equal(demoWorkspace(replay).textSaved, false);
  assert.equal(demoWorkspace(replay).pasted, false);
  assert.deepEqual(demoReducer(replay, { kind: "reset" }), initialDemo);
});

test("closing and reopening preserves collected files until the destination drop", () => {
  const closed = run([
    { kind: "try" },
    { kind: "save-file" },
    { kind: "close-shelf" },
    { kind: "switch-window", window: "message" },
  ]);
  assert.equal(demoWorkspace(closed).shelfOpen, false);
  assert.equal(demoWorkspace(closed).fileSaved, true);
  assert.equal(demoWorkspace(closed).attached, false);
  assert.equal(demoWorkspace(closed).shelfRetracted, true);
  const reopened = run([{ kind: "open-shelf" }], closed);
  assert.equal(demoWorkspace(reopened).shelfOpen, true);
  const dropped = run([{ kind: "attach-file" }], reopened);
  assert.equal(demoWorkspace(dropped).attached, true);
  assert.equal(demoWorkspace(dropped).shelfOpen, false);
  assert.equal(demoWorkspace(dropped).fileSaved, true);
});

test("cancelling a drag adds nothing and preserves an existing shelf file", () => {
  const empty = run([
    { kind: "try" },
    { kind: "open-shelf" },
    { kind: "cancel-drag" },
    { kind: "close-shelf" },
  ]);
  assert.equal(demoWorkspace(empty).fileSaved, false);
  const saved = run([{ kind: "save-file" }, { kind: "cancel-drag" }], empty);
  assert.equal(demoWorkspace(saved).fileSaved, true);
  assert.equal(demoWorkspace(saved).attached, false);
});

test("file drop destinations accept the edge, an open shelf and an outbound draft, and reject other releases", () => {
  const edge = { x: 0, y: 60, width: 44, height: 250 };
  const shelf = { x: 9, y: 65, width: 220, height: 230 };
  const destination = { x: 60, y: 70, width: 420, height: 260 };
  assert.equal(
    demoFileDrop({
      origin: "source",
      point: { x: 20, y: 180 },
      edge,
      shelf: null,
      destination: null,
    }).kind,
    "save-file",
  );
  assert.equal(
    demoFileDrop({
      origin: "source",
      point: { x: 170, y: 180 },
      edge,
      shelf,
      destination: null,
    }).kind,
    "save-file",
  );
  assert.equal(
    demoFileDrop({
      origin: "source",
      point: { x: 170, y: 180 },
      edge,
      shelf: null,
      destination: null,
    }).kind,
    "cancel-drag",
  );
  assert.equal(
    demoFileDrop({
      origin: "shelf",
      point: { x: 350, y: 180 },
      edge,
      shelf,
      destination,
    }).kind,
    "attach-file",
  );
  assert.equal(
    demoFileDrop({
      origin: "source",
      point: { x: 350, y: 180 },
      edge,
      shelf,
      destination,
    }).kind,
    "cancel-drag",
  );
  assert.equal(
    demoFileDrop({
      origin: "shelf",
      point: { x: 500, y: 180 },
      edge,
      shelf,
      destination,
    }).kind,
    "cancel-drag",
  );
});
