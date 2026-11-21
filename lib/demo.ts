export const sampleText = "The details are the design.";
export const sampleFile = "Studio notes.pdf";
export const demoDisclosure =
  "A browser demo with sample content. Your clipboard and files stay untouched.";

type Workspace = {
  window: "notes" | "message";
  shelfOpen: boolean;
  shelfVisited: boolean;
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
  | { kind: "paste" };

function freshWorkspace(): Workspace {
  return {
    window: "notes",
    shelfOpen: false,
    shelfVisited: false,
    destinationVisited: false,
    textSaved: false,
    fileSaved: false,
    clipboardText: false,
    pasted: false,
    attached: false,
    hint: "Start with Copy text. Or drag the sample file to the left edge.",
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
      return {
        ...workspace,
        shelfOpen: true,
        shelfVisited: true,
        hint: "Your shelf stays here when you switch windows. Choose Message above.",
      };
    case "close-shelf":
      return { ...workspace, shelfOpen: false };
    case "switch-window":
      return {
        ...workspace,
        window: action.window,
        destinationVisited:
          workspace.destinationVisited || action.window === "message",
        hint:
          action.window === "notes"
            ? "Copy the note, or add the sample file to your shelf."
            : "Choose text from the shelf and paste it. Files can be dragged into the draft.",
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
        hint: "File on the shelf. Choose Message, then drag it in or use Attach file.",
      };
    case "attach-file":
      return workspace.fileSaved && workspace.window === "message"
        ? {
            ...workspace,
            attached: true,
            shelfOpen: false,
            hint: workspace.pasted
              ? "Text and file, together in your next window. That’s the handoff."
              : "File attached to the sample draft. Try copying the note, too.",
          }
        : workspace;
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

type TourStep = {
  caption: string;
  target: "copy" | "edge" | "message" | "snippet" | "paste";
  action: TryAction | null;
  duration: number;
};

export const tour: readonly TourStep[] = [
  {
    caption: "A note in one window. Somewhere to use it next.",
    target: "copy",
    action: null,
    duration: 1100,
  },
  {
    caption: "Copy something worth keeping.",
    target: "copy",
    action: { kind: "copy-text" },
    duration: 1400,
  },
  {
    caption: "Move to the edge of your screen.",
    target: "edge",
    action: null,
    duration: 800,
  },
  {
    caption: "Your useful things are right here.",
    target: "edge",
    action: { kind: "open-shelf" },
    duration: 1500,
  },
  {
    caption: "Find your next window.",
    target: "message",
    action: null,
    duration: 800,
  },
  {
    caption: "The shelf comes with you.",
    target: "message",
    action: { kind: "switch-window", window: "message" },
    duration: 1400,
  },
  {
    caption: "Pick the words you want to reuse.",
    target: "snippet",
    action: null,
    duration: 800,
  },
  {
    caption: "Ready to paste.",
    target: "snippet",
    action: { kind: "select-text" },
    duration: 1100,
  },
  {
    caption: "Put them in your next window.",
    target: "paste",
    action: null,
    duration: 800,
  },
  {
    caption: "A small handoff. A little less friction.",
    target: "paste",
    action: { kind: "paste" },
    duration: 1700,
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
