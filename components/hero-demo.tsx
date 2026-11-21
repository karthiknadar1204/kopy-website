"use client";

import {
  useEffect,
  useReducer,
  useState,
  useSyncExternalStore,
  type DragEvent,
} from "react";
import { Icon } from "./icon";
import {
  demoDisclosure,
  demoReducer,
  demoWorkspace,
  initialDemo,
  sampleFile,
  sampleText,
  tour,
} from "@/lib/demo";
import styles from "./hero-demo.module.css";

const fileType = "application/x-kopy-demo-file";
const motionQuery = "(prefers-reduced-motion: reduce)";
function subscribeMotion(onChange: () => void) {
  const query = window.matchMedia(motionQuery);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
}
function reducedMotionSnapshot() {
  return window.matchMedia(motionQuery).matches;
}
function serverMotionSnapshot() {
  return false;
}

function FileArtwork() {
  return (
    <span className={styles.fileArtwork} aria-hidden="true">
      <span>
        Studio
        <br />
        notes.
      </span>
      <span>PDF</span>
    </span>
  );
}

export function HeroDemo() {
  const [state, dispatch] = useReducer(demoReducer, initialDemo);
  const [dragging, setDragging] = useState(false);
  const reducedMotion = useSyncExternalStore(
    subscribeMotion,
    reducedMotionSnapshot,
    serverMotionSnapshot,
  );
  const workspace = demoWorkspace(state);
  const interactive = state.kind === "try";
  const step = state.kind === "watch" ? tour[state.step] : null;
  const playing = state.kind === "watch" && state.playback === "playing";
  const complete = state.kind === "watch" && state.playback === "complete";

  useEffect(() => {
    if (!playing || reducedMotion || !step) return;
    const timer = window.setTimeout(
      () => dispatch({ kind: "advance" }),
      step.duration,
    );
    return () => window.clearTimeout(timer);
  }, [playing, reducedMotion, step]);

  useEffect(() => {
    function pauseWhenHidden() {
      if (document.hidden) dispatch({ kind: "pause" });
    }
    document.addEventListener("visibilitychange", pauseWhenHidden);
    return () =>
      document.removeEventListener("visibilitychange", pauseWhenHidden);
  }, []);

  function startDrag(event: DragEvent<HTMLElement>) {
    event.dataTransfer.setData(fileType, "studio-notes");
    event.dataTransfer.effectAllowed = "copy";
    setDragging(true);
  }
  function allowSampleDrop(event: DragEvent<HTMLElement>) {
    if (event.dataTransfer.types.includes(fileType)) {
      event.preventDefault();
      event.dataTransfer.dropEffect = "copy";
    }
  }
  function dropSample(
    event: DragEvent<HTMLElement>,
    destination: "shelf" | "message",
  ) {
    if (event.dataTransfer.getData(fileType) !== "studio-notes") return;
    event.preventDefault();
    event.stopPropagation();
    setDragging(false);
    dispatch({ kind: destination === "shelf" ? "save-file" : "attach-file" });
  }
  function reset() {
    setDragging(false);
    dispatch({ kind: "reset" });
  }

  return (
    <section
      className={styles.demo}
      aria-label="Interactive Kopy demo"
      id="interactive-demo"
    >
      <div className={styles.heading}>
        <span>
          <Icon name="shelf" size={19} /> A little room for your next move.
        </span>
        <span className={styles.sampleLabel}>Interactive demo</span>
      </div>
      <div className={styles.modes} aria-label="Demo mode">
        <button
          type="button"
          aria-pressed={!interactive}
          onClick={() => {
            setDragging(false);
            dispatch({ kind: "watch", manual: reducedMotion });
          }}
        >
          <svg
            width="13"
            height="14"
            viewBox="0 0 13 14"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M2 1.5 11.5 7 2 12.5Z" />
          </svg>
          Watch demo
        </button>
        <button
          type="button"
          aria-pressed={interactive}
          onClick={() => {
            setDragging(false);
            dispatch({ kind: "try" });
          }}
        >
          Try it yourself
        </button>
      </div>

      <div className={styles.desktop} data-dragging={dragging}>
        <div className={styles.menuBar} aria-hidden="true">
          <span>●</span>
          <strong>{workspace.window === "notes" ? "Notes" : "Message"}</strong>
          <span>Sample desktop</span>
        </div>
        <div
          className={styles.workspace}
          inert={!interactive}
          onKeyDown={(event) => {
            if (event.key === "Escape") dispatch({ kind: "close-shelf" });
          }}
        >
          <div
            className={styles.windowTabs}
            role="group"
            aria-label="Sample windows"
          >
            <button
              type="button"
              aria-pressed={workspace.window === "notes"}
              onClick={() =>
                dispatch({ kind: "switch-window", window: "notes" })
              }
            >
              Notes
            </button>
            <button
              type="button"
              aria-pressed={workspace.window === "message"}
              onClick={() =>
                dispatch({ kind: "switch-window", window: "message" })
              }
            >
              Message
            </button>
          </div>
          <div className={styles.appWindow} data-window={workspace.window}>
            <div className={styles.windowChrome}>
              <span className={styles.lights} aria-hidden="true">
                <i />
                <i />
                <i />
              </span>
              <span>
                {workspace.window === "notes"
                  ? "A few useful things"
                  : "A new draft"}
              </span>
            </div>
            {workspace.window === "notes" ? (
              <div className={styles.notes}>
                <span className={styles.documentLabel}>Studio notebook</span>
                <p className={styles.noteText}>{sampleText}</p>
                <button
                  type="button"
                  className={styles.copyButton}
                  onClick={() => dispatch({ kind: "copy-text" })}
                >
                  <Icon name="shelf" size={16} />
                  {workspace.textSaved ? "Copy again" : "Copy text"}
                </button>
                <div
                  className={styles.sourceFile}
                  draggable={interactive}
                  onDragStart={startDrag}
                  onDragEnd={() => setDragging(false)}
                >
                  <FileArtwork />
                  <div>
                    <strong>{sampleFile}</strong>
                    <span>Drag to the left edge, or</span>
                    <button
                      type="button"
                      onClick={() => dispatch({ kind: "save-file" })}
                    >
                      Add file to shelf
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div
                className={styles.message}
                onDragOver={allowSampleDrop}
                onDrop={(event) => dropSample(event, "message")}
                data-drop-target={dragging}
              >
                <div className={styles.recipient}>
                  <span>To</span>
                  <strong>The studio</strong>
                  <span>Draft only</span>
                </div>
                <div className={styles.draft}>
                  {workspace.pasted ? (
                    <p className={styles.pasted} data-testid="pasted-sample">
                      {sampleText}
                    </p>
                  ) : (
                    <p className={styles.placeholder}>
                      Something worth sharing…
                    </p>
                  )}
                  {workspace.attached && (
                    <div
                      className={styles.attachment}
                      data-testid="attached-sample"
                    >
                      <FileArtwork />
                      <span>
                        <strong>{sampleFile}</strong>
                        <small>Sample attachment</small>
                      </span>
                      <span aria-hidden="true">✓</span>
                    </div>
                  )}
                  {dragging && (
                    <span className={styles.dropHint}>
                      Drop the sample file here
                    </span>
                  )}
                </div>
                <div className={styles.draftActions}>
                  <button
                    type="button"
                    className={styles.copyButton}
                    disabled={!workspace.clipboardText || workspace.pasted}
                    onClick={() => dispatch({ kind: "paste" })}
                  >
                    {workspace.pasted ? "Text pasted ✓" : "Paste sample"}
                  </button>
                  <span>Nothing is sent.</span>
                </div>
              </div>
            )}
          </div>

          <div
            className={styles.edgeZone}
            onDragOver={allowSampleDrop}
            onDrop={(event) => dropSample(event, "shelf")}
          >
            <button
              type="button"
              className={styles.edgeHandle}
              aria-label="Open Kopy shelf"
              aria-expanded={workspace.shelfOpen}
              aria-controls="sample-shelf"
              onMouseEnter={() => {
                if (!workspace.shelfOpen) dispatch({ kind: "open-shelf" });
              }}
              onClick={() => dispatch({ kind: "open-shelf" })}
            >
              <span />
            </button>
          </div>

          {workspace.shelfOpen && (
            <div
              id="sample-shelf"
              className={styles.shelf}
              aria-label="Sample Kopy shelf"
              onDragOver={allowSampleDrop}
              onDrop={(event) => dropSample(event, "shelf")}
            >
              <div className={styles.shelfHeader}>
                <span>
                  <Icon name="shelf" size={19} /> Kopy
                </span>
                <button
                  type="button"
                  aria-label="Hide sample shelf"
                  onClick={() => dispatch({ kind: "close-shelf" })}
                >
                  ×
                </button>
              </div>
              <div className={styles.shelfSearch}>
                <Icon name="search" size={14} /> Your useful things
              </div>
              <div className={styles.shelfLabel}>
                Recent{" "}
                <span>
                  {Number(workspace.textSaved) + Number(workspace.fileSaved)}
                </span>
              </div>
              {workspace.textSaved && (
                <button
                  type="button"
                  className={styles.snippet}
                  onClick={() => dispatch({ kind: "select-text" })}
                >
                  <span className={styles.textIcon}>
                    <Icon name="text" size={18} />
                  </span>
                  <span>
                    <strong>{sampleText}</strong>
                    <small>Click to copy</small>
                  </span>
                </button>
              )}
              {workspace.fileSaved && (
                <div
                  className={styles.shelfFile}
                  draggable={interactive}
                  onDragStart={startDrag}
                  onDragEnd={() => setDragging(false)}
                >
                  <FileArtwork />
                  <div>
                    <strong>{sampleFile}</strong>
                    <small>Drag into Message</small>
                    <button
                      type="button"
                      disabled={
                        workspace.window !== "message" || workspace.attached
                      }
                      onClick={() => dispatch({ kind: "attach-file" })}
                    >
                      {workspace.attached ? "Attached ✓" : "Attach file"}
                    </button>
                  </div>
                </div>
              )}
              {!workspace.textSaved && !workspace.fileSaved && (
                <p className={styles.emptyShelf}>
                  A place for your next handoff.
                  <span>Copy the note, or drop the sample file here.</span>
                </p>
              )}
              <p className={styles.shelfFoot}>Text copies. Files drag.</p>
            </div>
          )}
        </div>
        {state.kind === "watch" &&
          state.playback !== "ready" &&
          !reducedMotion && (
            <div
              className={styles.cursor}
              data-target={step?.target}
              aria-hidden="true"
            >
              <svg width="25" height="30" viewBox="0 0 25 30">
                <path
                  d="m3 2 18 15-9 1-4 9Z"
                  fill="#24282f"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
              </svg>
              <span>You</span>
            </div>
          )}
      </div>

      <div className={styles.guide}>
        <div className={styles.guideHeading}>
          <span>
            {interactive
              ? "Your turn"
              : complete
                ? "That’s Kopy."
                : "A small handoff"}
          </span>
          <div className={styles.playback}>
            {state.kind === "watch" &&
              state.playback !== "ready" &&
              !complete && (
                <button
                  type="button"
                  onClick={() =>
                    dispatch({
                      kind: reducedMotion
                        ? "advance"
                        : playing
                          ? "pause"
                          : "resume",
                    })
                  }
                >
                  {reducedMotion ? "Next step" : playing ? "Pause" : "Resume"}
                </button>
              )}
            {complete && (
              <button
                type="button"
                onClick={() =>
                  dispatch({ kind: "watch", manual: reducedMotion })
                }
              >
                Replay
              </button>
            )}
            {interactive && (
              <button type="button" onClick={reset}>
                Reset
              </button>
            )}
          </div>
        </div>
        <p className={styles.instruction} role="status">
          {interactive
            ? workspace.hint
            : complete
              ? "Now try it yourself. Copy the note, or move a file between windows."
              : step?.caption}
        </p>
        <div className={styles.progress} aria-hidden="true">
          {["Collect", "Open shelf", "Switch", "Use"].map((label, index) => (
            <span
              key={label}
              data-done={
                index === 0
                  ? workspace.textSaved || workspace.fileSaved
                  : index === 1
                    ? workspace.shelfVisited
                    : index === 2
                      ? workspace.destinationVisited
                      : workspace.pasted || workspace.attached
              }
            >
              {label}
            </span>
          ))}
        </div>
      </div>
      <p className={styles.disclosure}>{demoDisclosure}</p>
      <noscript>
        <p className={styles.disclosure}>
          Enable JavaScript to play. The real app screenshots and guides are
          below.
        </p>
      </noscript>
    </section>
  );
}
