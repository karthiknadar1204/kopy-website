export const sampleText = "The details are the design.";
export const sampleFile = "Studio notes.pdf";
export const demoDisclosure =
  "A browser demo with sample content. Your clipboard and files stay untouched.";

type Workspace = {
  window: "notes" | "message";
  shelfOpen: boolean;
  shelfVisited: boolean;
  shelfRetracted: boolean;
  destinationVisited: boolean;
  textSaved: boolean;
  fileSaved: boolean;
  clipboardText: boolean;
  pasted: boolean;
  attached: boolean;
  hint: string;
};

export type TryAction =
  | { kind: "copy-text" }
  | { kind: "open-shelf" }
  | { kind: "close-shelf" }
  | { kind: "switch-window"; window: Workspace["window"] }
  | { kind: "select-text" }
  | { kind: "save-file" }
  | { kind: "attach-file" }
  | { kind: "cancel-drag" }
  | { kind: "paste" };

function freshWorkspace(): Workspace {
  return {
    window: "notes",
    shelfOpen: false,
    shelfVisited: false,
    shelfRetracted: false,
    destinationVisited: false,
    textSaved: false,
    fileSaved: false,
    clipboardText: false,
    pasted: false,
    attached: false,
    hint: "Drag the PDF to the left edge. Close the shelf, switch to Message, then reopen it and drag the file out.",
  };
}

function interact(workspace: Workspace, action: TryAction): Workspace {
  switch (action.kind) {
    case "copy-text":
      return {
        ...workspace,
        textSaved: true,
        clipboardText: true,
        hint: "Copied. Open Kopy using the little handle on the left edge.",
      };
    case "open-shelf":
      if (workspace.shelfOpen) return workspace;
      return {
        ...workspace,
        shelfOpen: true,
        shelfVisited: true,
        hint: workspace.fileSaved
          ? "Your file is still here. Drag it into Message, or move away to close the shelf."
          : "Drop the sample PDF here, or copy the note. Move away to close the shelf.",
      };
    case "close-shelf":
      if (!workspace.shelfOpen) return workspace;
      return {
        ...workspace,
        shelfOpen: false,
        shelfRetracted: workspace.shelfRetracted || workspace.shelfOpen,
        hint: workspace.fileSaved
          ? "Shelf closed. Your file stays saved. Switch to Message, then return to the left edge."
          : "Shelf closed. Return to the left edge whenever you need it.",
      };
    case "switch-window":
      return {
        ...workspace,
        window: action.window,
        destinationVisited:
          workspace.destinationVisited || action.window === "message",
        hint:
          action.window === "notes"
            ? "Drag the PDF to the edge, or try copying the note."
            : "A new window. Reopen Kopy at the left edge, then drag your saved file into this draft.",
      };
    case "select-text":
      return workspace.textSaved
        ? {
            ...workspace,
            clipboardText: true,
            shelfOpen: false,
            hint: "Text ready. Choose Message, then Paste sample.",
          }
        : workspace;
    case "save-file":
      return {
        ...workspace,
        fileSaved: true,
        shelfOpen: true,
        shelfVisited: true,
        hint: "File collected. Move away or close the shelf. Your file will stay there while you switch windows.",
      };
    case "attach-file":
      return workspace.fileSaved && workspace.window === "message"
        ? {
            ...workspace,
            attached: true,
            shelfOpen: false,
            shelfRetracted: true,
            hint: workspace.pasted
              ? "Text and file, together in your next window. That’s the handoff."
              : "File dropped into the draft. The shelf closes and your saved file stays available.",
          }
        : workspace;
    case "cancel-drag":
      return {
        ...workspace,
        hint: workspace.fileSaved
          ? "Drag cancelled. Your file is still on the shelf."
          : "Drag cancelled. Nothing was added. Try dragging the PDF onto the shelf.",
      };
    case "paste":
      return workspace.clipboardText && workspace.window === "message"
        ? {
            ...workspace,
            pasted: true,
            shelfOpen: false,
            hint: workspace.attached
              ? "Text and file, together in your next window. That’s the handoff."
              : "There it is. Now try moving the sample file from Notes via the shelf.",
          }
        : workspace;
    default: {
      const exhaustive: never = action;
      return exhaustive;
    }
  }
}

export type DemoTarget =
  | "source-file"
  | "edge"
  | "shelf-drop"
  | "shelf-file"
  | "outside"
  | "message"
  | "draft";
export type DragOrigin = "source" | "shelf";
export type DemoPoint = { x: number; y: number };
type DemoBounds = DemoPoint & { width: number; height: number };

export function demoFileDrop({
  origin,
  point,
  edge,
  shelf,
  destination,
}: {
  origin: DragOrigin;
  point: DemoPoint;
  edge: DemoBounds;
  shelf: DemoBounds | null;
  destination: DemoBounds | null;
}): TryAction {
  function contains(bounds: DemoBounds | null) {
    return (
      bounds !== null &&
      point.x >= bounds.x &&
      point.x <= bounds.x + bounds.width &&
      point.y >= bounds.y &&
      point.y <= bounds.y + bounds.height
    );
  }
  if (contains(edge) || contains(shelf)) return { kind: "save-file" };
  if (origin === "shelf" && contains(destination))
    return { kind: "attach-file" };
  return { kind: "cancel-drag" };
}

export type TourStep = {
  caption: string;
  target: DemoTarget;
  carrying: DragOrigin | null;
  action: TryAction | null;
  duration: number;
};

export const tour: readonly TourStep[] = [
  {
    caption: "Take a file from the window you’re working in.",
    target: "source-file",
    carrying: null,
    action: null,
    duration: 1100,
  },
  {
    caption: "Pick it up and keep holding.",
    target: "source-file",
    carrying: "source",
    action: null,
    duration: 800,
  },
  {
    caption: "Drag it to the little handle at the edge.",
    target: "edge",
    carrying: "source",
    action: null,
    duration: 1000,
  },
  {
    caption: "Keep holding. The shelf slides open.",
    target: "edge",
    carrying: "source",
    action: { kind: "open-shelf" },
    duration: 900,
  },
  {
    caption: "Move the file onto the shelf…",
    target: "shelf-drop",
    carrying: "source",
    action: null,
    duration: 900,
  },
  {
    caption: "…then let go. It’s collected, ready for later.",
    target: "shelf-file",
    carrying: null,
    action: { kind: "save-file" },
    duration: 1500,
  },
  {
    caption: "Move away from the shelf.",
    target: "outside",
    carrying: null,
    action: null,
    duration: 900,
  },
  {
    caption: "It slides closed. Your file stays on the shelf.",
    target: "outside",
    carrying: null,
    action: { kind: "close-shelf" },
    duration: 1600,
  },
  {
    caption: "Find your next window.",
    target: "message",
    carrying: null,
    action: null,
    duration: 800,
  },
  {
    caption: "A new window. The same little handle at the edge.",
    target: "message",
    carrying: null,
    action: { kind: "switch-window", window: "message" },
    duration: 1300,
  },
  {
    caption: "Return to the edge when you need your file.",
    target: "edge",
    carrying: null,
    action: null,
    duration: 900,
  },
  {
    caption: "Your file is still right here.",
    target: "edge",
    carrying: null,
    action: { kind: "open-shelf" },
    duration: 1400,
  },
  {
    caption: "Find the file you set down earlier.",
    target: "shelf-file",
    carrying: null,
    action: null,
    duration: 800,
  },
  {
    caption: "Pick it up from the shelf.",
    target: "shelf-file",
    carrying: "shelf",
    action: null,
    duration: 800,
  },
  {
    caption: "Keep holding and drag it into your next window.",
    target: "draft",
    carrying: "shelf",
    action: null,
    duration: 1400,
  },
  {
    caption: "Drop it. The file arrives, and the shelf gets out of your way.",
    target: "draft",
    carrying: null,
    action: { kind: "attach-file" },
    duration: 1800,
  },
];

export type DemoState =
  | {
      kind: "watch";
      step: number;
      playback: "ready" | "playing" | "paused" | "complete";
    }
  | { kind: "try"; workspace: Workspace };

export type DemoAction =
  | { kind: "watch"; manual: boolean }
  | { kind: "try" }
  | { kind: "pause" }
  | { kind: "resume" }
  | { kind: "advance" }
  | { kind: "reset" }
  | TryAction;

export const initialDemo: DemoState = {
  kind: "watch",
  step: 0,
  playback: "ready",
};

export function demoWorkspace(state: DemoState): Workspace {
  if (state.kind === "try") return state.workspace;
  return tour
    .slice(0, state.step + 1)
    .reduce(
      (workspace, step) =>
        step.action ? interact(workspace, step.action) : workspace,
      freshWorkspace(),
    );
}

export function demoReducer(state: DemoState, action: DemoAction): DemoState {
  switch (action.kind) {
    case "watch":
      return {
        kind: "watch",
        step: 0,
        playback: action.manual ? "paused" : "playing",
      };
    case "try":
      return { kind: "try", workspace: freshWorkspace() };
    case "reset":
      return state.kind === "try"
        ? { kind: "try", workspace: freshWorkspace() }
        : initialDemo;
    case "pause":
      return state.kind === "watch" && state.playback === "playing"
        ? { ...state, playback: "paused" }
        : state;
    case "resume":
      return state.kind === "watch" && state.playback === "paused"
        ? { ...state, playback: "playing" }
        : state;
    case "advance":
      if (
        state.kind !== "watch" ||
        state.playback === "ready" ||
        state.playback === "complete"
      )
        return state;
      return state.step < tour.length - 1
        ? { ...state, step: state.step + 1 }
        : { ...state, playback: "complete" };
    default:
      return state.kind === "try"
        ? { ...state, workspace: interact(state.workspace, action) }
        : state;
  }
}
