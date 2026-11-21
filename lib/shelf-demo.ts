import { sampleFile, sampleText } from "./demo";

export type ClipKind = "text" | "link" | "image" | "file" | "color";
export type ShelfFilter = "all" | ClipKind;
export type ShelfClip = {
  id: string;
  title: string;
  detail: string;
  pinned: boolean;
  note: string;
} & (
  | { kind: "text"; value: string }
  | { kind: "link"; value: string }
  | { kind: "image"; value: string }
  | { kind: "color"; value: string }
  | { kind: "file"; members: string[] }
);

export const samplePdf: ShelfClip = {
  id: "handoff-pdf",
  kind: "file",
  title: sampleFile,
  detail: "Just now",
  pinned: false,
  note: "Ready for the studio",
  members: [sampleFile],
};
export const sampleImage: ShelfClip = {
  id: "studio-image",
  kind: "image",
  title: "Studio moodboard.png",
  value: "/images/studio-moodboard.svg",
  detail: "1600 × 1000 · 18 min. ago",
  pinned: false,
  note: "",
};
export const sampleStack: ShelfClip = {
  id: "studio-stack",
  kind: "file",
  title: "2 items",
  members: ["Brand notes.pdf", "Moodboard.png"],
  detail: "12 min. ago",
  pinned: false,
  note: "",
};
export const initialShelfClips: ShelfClip[] = [
  {
    id: "studio-quote",
    kind: "text",
    title: sampleText,
    value: sampleText,
    detail: "Studio notes",
    note: "Studio notes",
    pinned: true,
  },
  {
    id: "design-link",
    kind: "link",
    title: "Apple Design",
    value: "https://developer.apple.com/design/",
    detail: "developer.apple.com",
    pinned: false,
    note: "",
  },
  {
    id: "studio-color",
    kind: "color",
    title: "#D68B71",
    value: "#D68B71",
    detail: "2 min. ago",
    pinned: false,
    note: "",
  },
  sampleStack,
  sampleImage,
  {
    id: "handoff-note",
    kind: "text",
    title: "Polish the handoff, then test with a fresh pair of eyes.",
    value: "Polish the handoff, then test with a fresh pair of eyes.",
    detail: "25 min. ago",
    pinned: false,
    note: "",
  },
];

export type ShelfDemoState = {
  nextSnippet: number;
  clips: ShelfClip[];
  query: string;
  filter: ShelfFilter;
  view:
    | { kind: "history" }
    | { kind: "preview"; id: string }
    | { kind: "editor"; id: string | null }
    | { kind: "emoji" }
    | { kind: "settings" };
  menu: string | null;
  expanded: string | null;
  undo: ShelfClip[] | null;
  theme: "dark" | "light";
};
export const initialShelfDemo: ShelfDemoState = {
  nextSnippet: 1,
  clips: initialShelfClips,
  query: "",
  filter: "all",
  view: { kind: "history" },
  menu: null,
  expanded: null,
  undo: null,
  theme: "dark",
};

export type ShelfDemoAction =
  | { kind: "search"; value: string }
  | { kind: "filter"; value: ShelfFilter }
  | { kind: "view"; value: ShelfDemoState["view"] }
  | { kind: "menu"; id: string | null }
  | { kind: "expand"; id: string }
  | { kind: "pin"; id: string }
  | { kind: "delete"; id: string }
  | { kind: "clear" }
  | { kind: "undo" }
  | { kind: "save-text"; id: string | null; value: string }
  | { kind: "import-clip"; clip: ShelfClip }
  | { kind: "theme"; value: ShelfDemoState["theme"] }
  | { kind: "reset" };

export function shelfClips(state: ShelfDemoState, fileSaved: boolean) {
  const clips =
    fileSaved && !state.clips.some((clip) => clip.id === samplePdf.id)
      ? [samplePdf, ...state.clips]
      : state.clips;
  const query = state.query.trim().toLocaleLowerCase();
  return clips.filter(
    (clip) =>
      (state.filter === "all" || clip.kind === state.filter) &&
      `${clip.title} ${clip.detail} ${clip.note} ${clip.kind === "file" ? clip.members.join(" ") : clip.value}`
        .toLocaleLowerCase()
        .includes(query),
  );
}

export function shelfDemoReducer(
  state: ShelfDemoState,
  action: ShelfDemoAction,
): ShelfDemoState {
  switch (action.kind) {
    case "search":
      return { ...state, query: action.value, menu: null };
    case "filter":
      return {
        ...state,
        filter: action.value,
        view: { kind: "history" },
        menu: null,
      };
    case "view":
      return { ...state, view: action.value, menu: null };
    case "menu":
      return { ...state, menu: action.id };
    case "expand":
      return {
        ...state,
        expanded: state.expanded === action.id ? null : action.id,
      };
    case "pin":
      return {
        ...state,
        menu: null,
        clips: state.clips.map((clip) =>
          clip.id === action.id ? { ...clip, pinned: !clip.pinned } : clip,
        ),
      };
    case "delete":
      return {
        ...state,
        menu: null,
        undo: state.clips,
        clips: state.clips.filter((clip) => clip.id !== action.id),
      };
    case "clear":
      return {
        ...state,
        menu: null,
        undo: state.clips,
        clips: state.clips.filter((clip) => clip.pinned),
      };
    case "undo":
      return state.undo ? { ...state, clips: state.undo, undo: null } : state;
    case "theme":
      return { ...state, theme: action.value };
    case "reset":
      return initialShelfDemo;
    case "import-clip": {
      const existing = state.clips.find((clip) => clip.id === action.clip.id);
      const clip = {
        ...action.clip,
        pinned: existing?.pinned ?? action.clip.pinned,
        note: existing?.note ?? action.clip.note,
      };
      return {
        ...state,
        clips: [clip, ...state.clips.filter((item) => item.id !== clip.id)],
        query: "",
        filter: "all",
        view: { kind: "history" },
      };
    }
    case "save-text": {
      const value = action.value.trim();
      if (!value) return state;
      const existing = state.clips.find(
        (clip) => clip.id === action.id && clip.kind === "text",
      );
      const clip: ShelfClip = {
        id: existing?.id ?? `written-snippet-${state.nextSnippet}`,
        kind: "text",
        title: value,
        value,
        detail: "Just now",
        pinned: existing?.pinned ?? false,
        note: existing?.note ?? "",
      };
      return {
        ...state,
        nextSnippet: existing ? state.nextSnippet : state.nextSnippet + 1,
        clips: [clip, ...state.clips.filter((item) => item.id !== clip.id)],
        filter: "text",
        query: "",
        view: { kind: "history" },
      };
    }
    default: {
      const exhaustive: never = action;
      return exhaustive;
    }
  }
}
