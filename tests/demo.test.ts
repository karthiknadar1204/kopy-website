import assert from "node:assert/strict";
import test from "node:test";
import {
  demoReducer,
  demoWorkspace,
  initialDemo,
  tour,
  type DemoState,
  type DemoAction,
} from "../lib/demo";

function run(actions: DemoAction[], initial: DemoState = initialDemo) {
  return actions.reduce(demoReducer, initial);
}

test("the guided tour copies a note, carries the shelf across windows and pastes it", () => {
  let state = demoReducer(initialDemo, { kind: "watch", manual: false });
  for (let index = 0; index < tour.length; index++)
    state = demoReducer(state, { kind: "advance" });
  assert.equal(state.kind, "watch");
  if (state.kind === "watch") assert.equal(state.playback, "complete");
  assert.equal(demoWorkspace(state).window, "message");
  assert.equal(demoWorkspace(state).pasted, true);
  assert.equal(demoWorkspace(state).shelfOpen, false);
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
  const copied = demoReducer(manual, { kind: "advance" });
  assert.equal(demoWorkspace(copied).textSaved, true);
  assert.equal(demoWorkspace(manual).textSaved, false);
  const replay = demoReducer(copied, { kind: "watch", manual: false });
  assert.equal(demoWorkspace(replay).textSaved, false);
  assert.equal(demoWorkspace(replay).pasted, false);
  assert.deepEqual(demoReducer(replay, { kind: "reset" }), initialDemo);
});
