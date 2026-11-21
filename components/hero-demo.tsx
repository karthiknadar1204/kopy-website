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
import Image from "next/image";
import { NativeShelf, ClipArtwork } from "./native-shelf";
import { DemoSymbol } from "./demo-symbol";
import {
  initialShelfDemo,
  initialShelfClips,
  shelfDemoReducer,
  samplePdf,
  sampleImage,
  sampleStack,
  type ShelfClip,
} from "@/lib/shelf-demo";
import {
  demoDisclosure,
  demoFileDrop,
  demoReducer,
  demoWorkspace,
  initialDemo,
  sampleFile,
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
      const scale = bounds.width / desktop.offsetWidth;
      cursor.style.transform = `translate(${(destination.left - bounds.left + destination.width / 2) / scale}px, ${(destination.top - bounds.top + destination.height / 2) / scale}px)`;
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
  const [state, dispatch] = useReducer(demoReducer, initialDemo, (initial) =>
    demoReducer(demoReducer(initial, { kind: "try" }), { kind: "open-shelf" }),
  );
  const [shelfState, shelfDispatch] = useReducer(
    shelfDemoReducer,
    initialShelfDemo,
  );
  const [clipboard, setClipboard] = useState<ShelfClip | null>(null);
  const [draft, setDraft] = useState<{ text: string; attachments: string[] }>({
    text: "",
    attachments: [],
  });
  const [notice, setNotice] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [drag, setDrag] = useState<{
    origin: DragOrigin;
    point: DemoPoint;
    clip: ShelfClip;
  } | null>(null);
  const dragSession = useRef<{
    origin: DragOrigin;
    clip: ShelfClip;
    start: DemoPoint;
    active: boolean;
    source: HTMLElement;
    pointerId: number;
  } | null>(null);
  const stage = useRef<HTMLDivElement>(null);
  const viewport = useRef<HTMLDivElement>(null);
  const shelf = useRef<HTMLDivElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
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
  const carrying = interactive ? drag?.origin : step?.carrying;
  const attachmentNames = interactive
    ? draft.attachments
    : workspace.attached
      ? [sampleFile]
      : [];
  const cancelClose = useCallback(() => {
    if (closeTimer.current !== null) clearTimeout(closeTimer.current);
    closeTimer.current = null;
  }, []);

  useEffect(() => cancelClose, [cancelClose, interactive, expanded]);
  useEffect(() => {
    if (!playing || reducedMotion || !step) return;
    const timer = setTimeout(
      () => dispatch({ kind: "advance" }),
      step.duration,
    );
    return () => clearTimeout(timer);
  }, [playing, reducedMotion, step]);
  useEffect(() => {
    function pauseHidden() {
      if (document.hidden) dispatch({ kind: "pause" });
    }
    document.addEventListener("visibilitychange", pauseHidden);
    return () => document.removeEventListener("visibilitychange", pauseHidden);
  }, []);
  useLayoutEffect(() => {
    const element = viewport.current;
    if (!element) return;
    function resize() {
      if (!element) return;
      element.style.setProperty(
        "--desktop-scale",
        String(expanded ? 1 : element.clientWidth / 1280),
      );
      element.style.setProperty(
        "--shelf-height",
        `${Math.min(650, (expanded ? element.clientHeight : 800) - 100)}px`,
      );
    }
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(element);
    return () => observer.disconnect();
  }, [expanded]);
  useEffect(() => {
    if (expanded) dialog.current?.showModal();
  }, [expanded]);

  function scheduleClose(afterDrag = false) {
    cancelClose();
    if (!interactive || (dragSession.current && !afterDrag)) return;
    const focused = document.activeElement;
    if (
      (focused instanceof HTMLInputElement ||
        focused instanceof HTMLTextAreaElement) &&
      shelf.current?.contains(focused)
    )
      return;
    closeTimer.current = setTimeout(
      () => dispatch({ kind: "close-shelf" }),
      350,
    );
  }
  function releaseDrag() {
    const session = dragSession.current;
    dragSession.current = null;
    setDrag(null);
    if (session?.source.hasPointerCapture(session.pointerId))
      session.source.releasePointerCapture(session.pointerId);
    return session;
  }
  function startDrag(
    event: PointerEvent<HTMLElement>,
    origin: DragOrigin,
    clip: ShelfClip = samplePdf,
  ) {
    if (
      event.button !== 0 ||
      (event.target instanceof Element &&
        event.target.closest("button:not([data-drag-handle])"))
    )
      return;
    cancelClose();
    setNotice(null);
    event.preventDefault();
    event.currentTarget.focus({ preventScroll: true });
    event.currentTarget.setPointerCapture(event.pointerId);
    dragSession.current = {
      origin,
      clip,
      start: { x: event.clientX, y: event.clientY },
      active: false,
      source: event.currentTarget,
      pointerId: event.pointerId,
    };
  }
  function moveDrag(event: PointerEvent<HTMLElement>) {
    const session = dragSession.current;
    const desktop = stage.current;
    if (!session || !desktop || session.pointerId !== event.pointerId) return;
    if (
      !session.active &&
      Math.hypot(
        event.clientX - session.start.x,
        event.clientY - session.start.y,
      ) < 5
    )
      return;
    if (!session.active) {
      session.source.setPointerCapture(session.pointerId);
      session.source.focus({ preventScroll: true });
    }
    session.active = true;
    event.preventDefault();
    cancelClose();
    const bounds = desktop.getBoundingClientRect();
    const scale = bounds.width / desktop.offsetWidth;
    setDrag({
      origin: session.origin,
      clip: session.clip,
      point: {
        x: (event.clientX - bounds.left) / scale,
        y: (event.clientY - bounds.top) / scale,
      },
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
  function appendAttachment(clip: ShelfClip) {
    const names = clip.kind === "file" ? clip.members : [clip.title];
    setDraft((current) => ({
      ...current,
      attachments: [...new Set([...current.attachments, ...names])],
    }));
  }
  function finishDrag(event: PointerEvent<HTMLElement>) {
    const session = releaseDrag();
    if (!session) return;
    if (!session.active) {
      if (session.origin === "shelf")
        shelfDispatch({
          kind: "view",
          value: { kind: "preview", id: session.clip.id },
        });
      return;
    }
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
    if (action.kind === "save-file") {
      if (session.clip.id === samplePdf.id) dispatch(action);
      shelfDispatch({ kind: "import-clip", clip: session.clip });
      shelfDispatch({ kind: "view", value: { kind: "history" } });
      shelfDispatch({ kind: "search", value: "" });
      shelfDispatch({ kind: "filter", value: "all" });
      setNotice(
        `${session.clip.title} is on your shelf. Move away to close it, then switch to Mail.`,
      );
    } else if (action.kind === "attach-file") {
      appendAttachment(session.clip);
      dispatch(action);
      dispatch({ kind: "close-shelf" });
      setNotice(
        `${session.clip.title} arrived in the draft. Your shelf is out of the way.`,
      );
    } else {
      dispatch(action);
      setNotice(
        session.origin === "shelf"
          ? "Drag cancelled. Your item is still on the shelf."
          : "Drag cancelled. Nothing was added.",
      );
    }
    if (action.kind !== "save-file") scheduleClose(true);
  }
  function cancelDrag() {
    const session = releaseDrag();
    if (!session?.active) return;
    dispatch({ kind: "cancel-drag" });
    setNotice("Drag cancelled. Your saved items stay on the shelf.");
    scheduleClose(true);
  }
  function copyClip(clip: ShelfClip) {
    setClipboard(clip);
    dispatch({ kind: "copy-text" });
    dispatch({ kind: "select-text" });
    setNotice(
      `${clip.kind === "text" ? "Text" : clip.title} copied in this demo. Switch to Mail and choose Paste.`,
    );
  }
  function pasteSample() {
    if (!clipboard) return;
    if (clipboard.kind === "file" || clipboard.kind === "image")
      appendAttachment(clipboard);
    else
      setDraft((current) => ({
        ...current,
        text: [current.text, clipboard.value].filter(Boolean).join("\n"),
      }));
    dispatch({ kind: "paste" });
    setNotice("Pasted into the sample draft. Nothing is sent or uploaded.");
  }
  function reset() {
    cancelClose();
    releaseDrag();
    setClipboard(null);
    setDraft({ text: "", attachments: [] });
    setNotice(null);
    shelfDispatch({ kind: "reset" });
    dispatch({ kind: "try" });
    dispatch({ kind: "open-shelf" });
  }
  function watchDemo() {
    cancelClose();
    releaseDrag();
    setNotice(null);
    setDraft({ text: "", attachments: [] });
    shelfDispatch({ kind: "reset" });
    dispatch({ kind: "watch", manual: reducedMotion });
    if (window.matchMedia("(max-width: 650px)").matches) setExpanded(true);
    else
      viewport.current?.scrollIntoView({
        block: "center",
        behavior: reducedMotion ? "instant" : "smooth",
      });
  }
  function tryDemo() {
    reset();
    if (window.matchMedia("(max-width: 650px)").matches) setExpanded(true);
  }
  function switchWindow(window: "notes" | "message") {
    dispatch({ kind: "switch-window", window });
    setNotice(null);
  }
  const dragHandlers = (clip: ShelfClip) => ({
    onPointerDown: (event: PointerEvent<HTMLDivElement>) =>
      startDrag(event, "shelf", clip),
    onPointerMove: moveDrag,
    onPointerUp: finishDrag,
    onPointerCancel: cancelDrag,
  });

  const desktop = (
    <>
      <div className={styles.macbook}>
        <div className={styles.bezel}>
          <div ref={viewport} className={styles.viewport}>
            <div
              ref={stage}
              className={styles.desktop}
              data-carried={carrying ?? "none"}
            >
              <div className={styles.menuBar} aria-hidden="true">
                <span className={styles.apple}></span>
                <strong>
                  {workspace.window === "notes" ? "Finder" : "Mail"}
                </strong>
                <span>File</span>
                <span>Edit</span>
                <span>View</span>
                <span>Window</span>
                <span>Help</span>
                <div className={styles.notch} />
                <span className={styles.menuRight}>⌁ ▰ &nbsp; Sat 9:41</span>
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
                {workspace.window === "notes" ? (
                  <div className={styles.finder} data-window="notes">
                    <div className={styles.windowChrome}>
                      <span className={styles.lights} aria-hidden="true">
                        <i />
                        <i />
                        <i />
                      </span>
                      <DemoSymbol name="back" size={17} />
                      <strong>Studio</strong>
                      <span className={styles.windowSearch}>
                        <DemoSymbol name="search" size={18} />
                      </span>
                    </div>
                    <aside className={styles.finderSidebar}>
                      <span>Favourites</span>
                      <p>◷ &nbsp; Recents</p>
                      <p>⌂ &nbsp; Applications</p>
                      <p className={styles.sidebarActive}>▣ &nbsp; Desktop</p>
                      <p>▤ &nbsp; Documents</p>
                      <p>↓ &nbsp; Downloads</p>
                      <span>Locations</span>
                      <p>▰ &nbsp; Macintosh HD</p>
                    </aside>
                    <div className={styles.finderMain}>
                      <div className={styles.finderPath}>
                        Desktop <span>›</span> Studio
                      </div>
                      <div className={styles.finderFiles}>
                        <div
                          className={styles.sourceFile}
                          tabIndex={-1}
                          onPointerDown={(event) => startDrag(event, "source")}
                          onPointerMove={moveDrag}
                          onPointerUp={finishDrag}
                          onPointerCancel={cancelDrag}
                        >
                          <FileArtwork target="source-file" />
                          <strong>{sampleFile}</strong>
                          <span>PDF document · 248 KB</span>
                        </div>
                        <div
                          className={styles.finderTile}
                          tabIndex={-1}
                          onPointerDown={(event) => startDrag(event, "source", sampleImage)}
                          onPointerMove={moveDrag}
                          onPointerUp={finishDrag}
                          onPointerCancel={cancelDrag}
                        >
                          <Image
                            draggable={false}
                            src="/images/studio-moodboard.svg"
                            alt=""
                            width={110}
                            height={76}
                          />
                          <strong>Moodboard.png</strong>
                          <span>PNG image · 1.2 MB</span>
                        </div>
                        <div
                          className={styles.finderTile}
                          tabIndex={-1}
                          onPointerDown={(event) => startDrag(event, "source", sampleStack)}
                          onPointerMove={moveDrag}
                          onPointerUp={finishDrag}
                          onPointerCancel={cancelDrag}
                        >
                          <span className={styles.folderIcon}>
                            <DemoSymbol name="folder" size={56} />
                          </span>
                          <strong>Brand notes</strong>
                          <span>2 items</span>
                        </div>
                      </div>
                      <div className={styles.finderBottom}>
                        3 items{" "}
                        <span>Drag Studio notes.pdf to Kopy’s left edge</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className={styles.mail} data-window="message">
                    <div className={styles.windowChrome}>
                      <span className={styles.lights} aria-hidden="true">
                        <i />
                        <i />
                        <i />
                      </span>
                      <strong>New Message</strong>
                      <span className={styles.windowSearch}>
                        <DemoSymbol name="mail" size={19} />
                      </span>
                    </div>
                    <aside className={styles.mailSidebar}>
                      <strong>Mailboxes</strong>
                      <p>
                        All Inboxes <span>3</span>
                      </p>
                      <p className={styles.sidebarActive}>
                        Drafts <span>1</span>
                      </p>
                      <p>Sent</p>
                      <p>Archive</p>
                      <p>Trash</p>
                      <div>
                        <DemoSymbol name="mail" size={22} />
                        <span>Studio</span>
                      </div>
                    </aside>
                    <div className={styles.compose}>
                      <div className={styles.recipient}>
                        <span>To:</span>
                        <strong>The studio</strong>
                        <small>Sample draft</small>
                      </div>
                      <div className={styles.subject}>
                        <span>Subject:</span>
                        <strong>A few things for the project</strong>
                      </div>
                      <div className={styles.draft}>
                        <p>Hey team,</p>
                        {draft.text ? (
                          <p
                            data-testid="pasted-sample"
                            className={styles.pasted}
                          >
                            {draft.text}
                          </p>
                        ) : (
                          <p className={styles.placeholder}>
                            Here’s what I’ve been working on.
                          </p>
                        )}
                        <div
                          data-demo-target="draft"
                          className={styles.dropAnchor}
                        />
                        {attachmentNames.map((name) => (
                          <div
                            key={name}
                            className={styles.attachment}
                            data-testid="attached-sample"
                          >
                            <DemoSymbol
                              name={name.endsWith("png") ? "image" : "file"}
                              size={29}
                            />
                            <span>
                              <strong>{name}</strong>
                              <small>Sample attachment</small>
                            </span>
                            <span>✓</span>
                          </div>
                        ))}
                        {carrying === "shelf" && (
                          <div className={styles.dropHint}>
                            Drop into this draft
                          </div>
                        )}
                        <p className={styles.signature}>
                          Thanks,
                          <br />
                          The studio
                        </p>
                      </div>
                      <div className={styles.composeActions}>
                        <button
                          type="button"
                          disabled={!clipboard}
                          onClick={pasteSample}
                        >
                          <DemoSymbol name="copy" size={16} />
                          Paste
                        </button>
                        <span>Demo only. Nothing is sent.</span>
                      </div>
                    </div>
                  </div>
                )}
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
                        if (event.pointerType === "mouse")
                          dispatch({ kind: "open-shelf" });
                      }}
                      onClick={() => dispatch({ kind: "open-shelf" })}
                    >
                      <span />
                    </button>
                  </div>
                  <NativeShelf
                    state={shelfState}
                    dispatch={shelfDispatch}
                    panelRef={shelf}
                    open={workspace.shelfOpen}
                    fileSaved={!interactive && workspace.fileSaved}
                    dragging={carrying === "source"}
                    copy={copyClip}
                    importText={() => {
                      copyClip(initialShelfClips[0]);
                      dispatch({ kind: "open-shelf" });
                    }}
                    dragHandlers={dragHandlers}
                  />
                </div>
                <span
                  className={styles.outsideAnchor}
                  data-demo-target="outside"
                />
                <div className={styles.dock}>
                  <button
                    type="button"
                    aria-label="Show Finder"
                    aria-pressed={workspace.window === "notes"}
                    onClick={() => switchWindow("notes")}
                  >
                    <span className={styles.finderDock}>
                      <DemoSymbol name="finder" size={33} />
                    </span>
                    <small>Finder</small>
                  </button>
                  <button
                    type="button"
                    data-demo-target="message"
                    aria-label="Show Mail"
                    aria-pressed={workspace.window === "message"}
                    onClick={() => switchWindow("message")}
                  >
                    <span className={styles.mailDock}>
                      <DemoSymbol name="mail" size={33} />
                    </span>
                    <small>Mail</small>
                  </button>
                  <span className={styles.dockDivider} />
                  <button
                    type="button"
                    aria-label="Toggle Kopy shelf"
                    aria-pressed={workspace.shelfOpen}
                    onClick={() =>
                      dispatch({
                        kind: workspace.shelfOpen
                          ? "close-shelf"
                          : "open-shelf",
                      })
                    }
                  >
                    <Image
                      src="/images/kopy-icon.png"
                      alt=""
                      width={48}
                      height={48}
                    />
                    <small>Kopy</small>
                  </button>
                </div>
              </div>
              {drag && (
                <div
                  className={styles.liveDrag}
                  style={{
                    transform: `translate(${drag.point.x}px,${drag.point.y}px)`,
                  }}
                  aria-hidden="true"
                >
                  <div className={styles.carriedFile}>
                    <ClipArtwork clip={drag.clip} />
                    <span>{drag.clip.title}</span>
                    <b>+</b>
                  </div>
                </div>
              )}
              {state.kind === "watch" &&
                state.playback !== "ready" &&
                !reducedMotion &&
                step && <GuidedPointer stage={stage} step={step} />}
            </div>
          </div>
        </div>
        <div className={styles.laptopBase} aria-hidden="true">
          <span />
        </div>
      </div>
      <div className={styles.controls}>
        <div className={styles.modes} aria-label="Demo mode">
          <button type="button" aria-pressed={!interactive} onClick={watchDemo}>
            <DemoSymbol name="play" size={15} />
            Watch demo
          </button>
          <button type="button" aria-pressed={interactive} onClick={tryDemo}>
            Try it yourself
          </button>
        </div>
        <div className={styles.utilityControls}>
          {playing && !reducedMotion && (
            <button type="button" onClick={() => dispatch({ kind: "pause" })}>
              Pause
            </button>
          )}
          {state.kind === "watch" &&
            state.playback === "paused" &&
            !reducedMotion && (
              <button
                type="button"
                onClick={() => dispatch({ kind: "resume" })}
              >
                Resume
              </button>
            )}
          {state.kind === "watch" &&
            (reducedMotion || state.playback === "paused") &&
            state.playback !== "complete" && (
              <button
                type="button"
                onClick={() => dispatch({ kind: "advance" })}
              >
                Next step
              </button>
            )}
          {complete && (
            <button type="button" onClick={watchDemo}>
              Replay
            </button>
          )}
          {interactive && (
            <>
              <button
                type="button"
                onClick={() => dispatch({ kind: "close-shelf" })}
              >
                Close shelf
              </button>
              <button type="button" onClick={reset}>
                Reset
              </button>
            </>
          )}
          {!expanded && (
            <button
              type="button"
              className={styles.expandButton}
              onClick={() => {
                cancelClose();
                releaseDrag();
                dispatch({ kind: "open-shelf" });
                setExpanded(true);
              }}
            >
              <DemoSymbol name="expand" size={16} />
              Open full demo
            </button>
          )}
        </div>
      </div>
      <p className={styles.instruction} role="status">
        {interactive
          ? (notice ??
            "This is Kopy’s shelf. Search, filter, preview or pin an item. Drag the PDF from Finder to the edge, then into Mail.")
          : complete
            ? "Collected. Kept. Dropped into your next window. Now try the shelf yourself."
            : step?.caption}
      </p>
      <p className={styles.disclosure}>
        {demoDisclosure} <a href="#see-kopy">See original app screenshots</a>
      </p>
    </>
  );

  return (
    <section
      className={styles.demo}
      id="interactive-demo"
      aria-label="Interactive Kopy desktop demo"
    >
      {expanded ? (
        <>
          <div className={styles.desktopPlaceholder} />
          <dialog
            ref={dialog}
            className={styles.dialog}
            onClose={() => {
              cancelClose();
              setExpanded(false);
            }}
          >
            <div className={styles.dialogHeader}>
              <span>
                <Image
                  src="/images/kopy-icon.png"
                  alt=""
                  width={24}
                  height={24}
                />
                Kopy · Interactive desktop
              </span>
              <button
                type="button"
                aria-label="Return to website"
                onClick={() => dialog.current?.close()}
              >
                <DemoSymbol name="close" size={18} />
                Close
              </button>
            </div>
            <div className={styles.expandedContent}>{desktop}</div>
          </dialog>
        </>
      ) : (
        desktop
      )}
    </section>
  );
}
