"use client";

import {
  useEffect,
  useLayoutEffect,
  useCallback,
  useReducer,
  useRef,
  useState,
  useSyncExternalStore,
  type PointerEvent,
  type RefObject,
} from "react";
import { Icon } from "./icon";
import {
  demoDisclosure,
  demoFileDrop,
  demoReducer,
  demoWorkspace,
  initialDemo,
  sampleFile,
  sampleText,
  tour,
  type DemoTarget,
  type DemoPoint,
  type DragOrigin,
  type TourStep,
} from "@/lib/demo";
import styles from "./hero-demo.module.css";

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

function FileArtwork({ target }: { target?: DemoTarget }) {
  return (
    <span
      className={styles.fileArtwork}
      aria-hidden="true"
      data-file-artwork
      data-demo-target={target}
    >
      <span>
        Studio
        <br />
        notes.
      </span>
      <span>PDF</span>
    </span>
  );
}

function GuidedPointer({
  stage,
  step,
}: {
  stage: RefObject<HTMLDivElement | null>;
  step: TourStep;
}) {
  const pointer = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    const desktop = stage.current;
    const cursor = pointer.current;
    if (!desktop || !cursor) return;
    function position() {
      const target = desktop?.querySelector(
        `[data-demo-target="${step.target}"]`,
      );
      if (!target || !desktop || !cursor) return;
      const bounds = desktop.getBoundingClientRect();
      const destination = target.getBoundingClientRect();
      cursor.style.transform = `translate(${destination.left - bounds.left + destination.width / 2}px, ${destination.top - bounds.top + destination.height / 2}px)`;
      cursor.dataset.positioned = "true";
    }
    position();
    const observer = new ResizeObserver(position);
    observer.observe(desktop);
    return () => observer.disconnect();
  }, [stage, step.target]);
  return (
    <div
      ref={pointer}
      className={styles.cursor}
      aria-hidden="true"
      data-carrying={step.carrying ?? "none"}
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
      {step.carrying && (
        <div className={styles.carriedFile}>
          <FileArtwork />
          <span>{sampleFile}</span>
          <b>+</b>
        </div>
      )}
    </div>
  );
}

export function HeroDemo() {
  const [state, dispatch] = useReducer(demoReducer, initialDemo);
  const [drag, setDrag] = useState<{
    origin: DragOrigin;
    point: DemoPoint;
  } | null>(null);
  const dragOrigin = drag?.origin ?? null;
  const dragSession = useRef<{
    origin: DragOrigin;
    start: DemoPoint;
    active: boolean;
    source: HTMLElement;
    pointerId: number;
  } | null>(null);
  const stage = useRef<HTMLDivElement>(null);
  const shelf = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cancelClose = useCallback(() => {
    if (closeTimer.current !== null) clearTimeout(closeTimer.current);
    closeTimer.current = null;
  }, []);
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
  const carrying = interactive ? dragOrigin : step?.carrying;

  useEffect(() => cancelClose, [cancelClose, interactive]);
  useEffect(() => {
    if (dragOrigin) cancelClose();
  }, [dragOrigin, cancelClose]);

  function scheduleClose(afterDrag = false) {
    cancelClose();
    if (!interactive || (dragSession.current && !afterDrag)) return;
    closeTimer.current = setTimeout(
      () => dispatch({ kind: "close-shelf" }),
      350,
    );
  }

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

  function startDrag(event: PointerEvent<HTMLElement>, origin: DragOrigin) {
    if (
      event.button !== 0 ||
      (event.target instanceof Element && event.target.closest("button"))
    )
      return;
    cancelClose();
    event.preventDefault();
    event.currentTarget.focus({ preventScroll: true });
    event.currentTarget.setPointerCapture(event.pointerId);
    dragSession.current = {
      origin,
      start: { x: event.clientX, y: event.clientY },
      active: false,
      source: event.currentTarget,
      pointerId: event.pointerId,
    };
  }
  function moveDrag(event: PointerEvent<HTMLElement>) {
    const session = dragSession.current;
    const desktop = stage.current;
    if (!session || !desktop) return;
    if (
      !session.active &&
      Math.hypot(
        event.clientX - session.start.x,
        event.clientY - session.start.y,
      ) < 5
    )
      return;
    session.active = true;
    cancelClose();
    const bounds = desktop.getBoundingClientRect();
    setDrag({
      origin: session.origin,
      point: { x: event.clientX - bounds.left, y: event.clientY - bounds.top },
    });
    const edge = desktop
      .querySelector("[data-edge-zone]")
      ?.getBoundingClientRect();
    if (
      edge &&
      event.clientX >= edge.left &&
      event.clientX <= edge.right &&
      event.clientY >= edge.top &&
      event.clientY <= edge.bottom
    )
      dispatch({ kind: "open-shelf" });
  }
  function releaseDrag() {
    const session = dragSession.current;
    dragSession.current = null;
    setDrag(null);
    if (session?.source.hasPointerCapture(session.pointerId))
      session.source.releasePointerCapture(session.pointerId);
    return session;
  }
  function finishDrag(event: PointerEvent<HTMLElement>) {
    const session = releaseDrag();
    if (!session?.active) return;
    const desktop = stage.current;
    const edge = desktop
      ?.querySelector("[data-edge-zone]")
      ?.getBoundingClientRect();
    if (!edge) return;
    const action = demoFileDrop({
      origin: session.origin,
      point: { x: event.clientX, y: event.clientY },
      edge,
      shelf: workspace.shelfOpen
        ? (shelf.current?.getBoundingClientRect() ?? null)
        : null,
      destination:
        desktop
          ?.querySelector('[data-window="message"]')
          ?.getBoundingClientRect() ?? null,
    });
    dispatch(action);
    if (action.kind !== "save-file") scheduleClose(true);
  }
  function cancelDrag() {
    const session = releaseDrag();
    if (!session?.active) return;
    dispatch({ kind: "cancel-drag" });
    scheduleClose(true);
  }
  function reset() {
    cancelClose();
    releaseDrag();
    dispatch({ kind: "reset" });
  }

  function framePhoneDemo() {
    if (window.matchMedia("(max-width: 650px)").matches)
      stage.current?.scrollIntoView({
        block: "start",
        behavior: reducedMotion ? "instant" : "smooth",
      });
  }
  function watchDemo() {
    cancelClose();
    releaseDrag();
    dispatch({ kind: "watch", manual: reducedMotion });
    framePhoneDemo();
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
        <button type="button" aria-pressed={!interactive} onClick={watchDemo}>
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
            cancelClose();
            releaseDrag();
            dispatch({ kind: "try" });
            framePhoneDemo();
          }}
        >
          Try it yourself
        </button>
      </div>

      <div
        ref={stage}
        className={styles.desktop}
        data-dragging={Boolean(carrying)}
        data-carried={carrying ?? "none"}
      >
        <div className={styles.menuBar} aria-hidden="true">
          <span>●</span>
          <strong>{workspace.window === "notes" ? "Notes" : "Message"}</strong>
          <span>Sample desktop</span>
        </div>
        <div
          className={styles.workspace}
          inert={!interactive}
          onPointerDownCapture={(event) => {
            if (
              workspace.shelfOpen &&
              event.target instanceof Element &&
              !event.target.closest("[data-shelf-region]")
            ) {
              cancelClose();
              dispatch({ kind: "close-shelf" });
            }
          }}
          onKeyDown={(event) => {
            if (event.key === "Escape") {
              cancelDrag();
              dispatch({ kind: "close-shelf" });
            }
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
              data-demo-target="message"
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
                <span className={styles.documentLabel}>
                  Ready for your next window
                </span>
                <div
                  className={styles.sourceFile}
                  tabIndex={interactive ? 0 : -1}
                  aria-label="Drag Studio notes.pdf to the shelf"
                  onPointerDown={(event) => startDrag(event, "source")}
                  onPointerMove={moveDrag}
                  onPointerUp={finishDrag}
                  onPointerCancel={cancelDrag}
                >
                  <FileArtwork target="source-file" />
                  <div>
                    <strong>{sampleFile}</strong>
                    <span>Drag this file to the left edge.</span>
                    <button
                      type="button"
                      onClick={() => dispatch({ kind: "save-file" })}
                    >
                      Add file to shelf
                    </button>
                  </div>
                </div>
                <div className={styles.sampleNote}>
                  <p className={styles.noteText}>{sampleText}</p>
                  <button
                    type="button"
                    className={styles.copyButton}
                    onClick={() => dispatch({ kind: "copy-text" })}
                  >
                    <Icon name="shelf" size={16} />
                    {workspace.textSaved ? "Copy again" : "Copy text"}
                  </button>
                </div>
              </div>
            ) : (
              <div className={styles.message}>
                <div className={styles.recipient}>
                  <span>To</span>
                  <strong>The studio</strong>
                  <span>Draft only</span>
                </div>
                <div className={styles.draft}>
                  <span
                    className={styles.dropAnchor}
                    data-demo-target="draft"
                  />
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
                  {carrying === "shelf" && (
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

          <span className={styles.outsideAnchor} data-demo-target="outside" />
          <div
            className={styles.shelfRegion}
            data-shelf-region
            onPointerEnter={cancelClose}
            onPointerLeave={() => scheduleClose()}
          >
            <div className={styles.edgeZone} data-edge-zone>
              <button
                type="button"
                className={styles.edgeHandle}
                data-demo-target="edge"
                aria-label="Open Kopy shelf"
                aria-expanded={workspace.shelfOpen}
                aria-controls="sample-shelf"
                onPointerEnter={(event) => {
                  cancelClose();
                  if (event.pointerType === "mouse" && !workspace.shelfOpen)
                    dispatch({ kind: "open-shelf" });
                }}
                onClick={() => dispatch({ kind: "open-shelf" })}
              >
                <span />
              </button>
            </div>

            <div
              ref={shelf}
              id="sample-shelf"
              className={styles.shelf}
              aria-label="Sample Kopy shelf"
              data-open={workspace.shelfOpen}
              aria-hidden={!workspace.shelfOpen}
              inert={!workspace.shelfOpen}
            >
              <div className={styles.shelfHeader}>
                <span>
                  <Icon name="shelf" size={19} /> Kopy
                </span>
                <button
                  type="button"
                  aria-label="Close shelf"
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
                  tabIndex={interactive ? 0 : -1}
                  aria-label="Drag Studio notes.pdf from the shelf"
                  onPointerDown={(event) => startDrag(event, "shelf")}
                  onPointerMove={moveDrag}
                  onPointerUp={finishDrag}
                  onPointerCancel={cancelDrag}
                >
                  <FileArtwork target="shelf-file" />
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
              <span
                className={styles.shelfDropAnchor}
                data-demo-target="shelf-drop"
              />
            </div>
          </div>
          {!workspace.shelfOpen && workspace.fileSaved && (
            <span className={styles.closedNotice}>
              Shelf closed. Your file is kept.
            </span>
          )}
        </div>
        {drag && (
          <div
            className={styles.liveDrag}
            style={{
              transform: `translate(${drag.point.x}px, ${drag.point.y}px)`,
            }}
            data-origin={drag.origin}
            aria-hidden="true"
          >
            <div className={styles.carriedFile}>
              <FileArtwork />
              <span>{sampleFile}</span>
              <b>+</b>
            </div>
          </div>
        )}
        {state.kind === "watch" &&
          state.playback !== "ready" &&
          !reducedMotion &&
          step && <GuidedPointer stage={stage} step={step} />}
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
              <button type="button" onClick={watchDemo}>
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
              ? "Your turn: collect, close, switch windows, reopen and drop."
              : step?.caption}
        </p>
        <div className={styles.progress} aria-hidden="true">
          {["Collect", "Close", "Switch", "Drop"].map((label, index) => (
            <span
              key={label}
              data-done={
                index === 0
                  ? workspace.textSaved || workspace.fileSaved
                  : index === 1
                    ? workspace.shelfRetracted
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
