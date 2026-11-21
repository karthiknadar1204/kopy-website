"use client";

import Image from "next/image";
import type { Dispatch, HTMLAttributes, RefObject } from "react";
import { DemoSymbol, type DemoSymbolName } from "./demo-symbol";
import {
  shelfClips,
  type ShelfClip,
  type ShelfDemoAction,
  type ShelfDemoState,
  type ShelfFilter,
} from "@/lib/shelf-demo";
import styles from "./native-shelf.module.css";

type DragHandlers = Pick<
  HTMLAttributes<HTMLDivElement>,
  "onPointerDown" | "onPointerMove" | "onPointerUp" | "onPointerCancel"
>;
type Props = {
  state: ShelfDemoState;
  dispatch: Dispatch<ShelfDemoAction>;
  panelRef: RefObject<HTMLDivElement | null>;
  open: boolean;
  fileSaved: boolean;
  dragging: boolean;
  copy: (clip: ShelfClip) => void;
  importText: () => void;
  dragHandlers: (clip: ShelfClip) => DragHandlers;
};

const filters: { value: ShelfFilter; label: string; symbol: DemoSymbolName }[] =
  [
    { value: "all", label: "All", symbol: "all" },
    { value: "text", label: "Text", symbol: "text" },
    { value: "link", label: "Links", symbol: "link" },
    { value: "image", label: "Images", symbol: "image" },
    { value: "file", label: "Files", symbol: "folder" },
    { value: "color", label: "Colors", symbol: "color" },
  ];

export function ClipArtwork({
  clip,
  size,
}: {
  clip: ShelfClip;
  size?: "large";
}) {
  return (
    <span
      className={styles.artwork}
      data-kind={clip.kind}
      data-large={size === "large"}
      style={clip.kind === "color" ? { background: clip.value } : undefined}
    >
      {clip.kind === "image" ? (
        <Image
          draggable={false}
          src={clip.value}
          alt="Sample studio moodboard"
          width={100}
          height={72}
        />
      ) : clip.kind === "color" ? null : (
        <DemoSymbol
          name={
            clip.kind === "file" && clip.members.length > 1
              ? "stack"
              : clip.kind
          }
          size={size === "large" ? 36 : 23}
        />
      )}
    </span>
  );
}

export function NativeShelf({
  state,
  dispatch,
  panelRef,
  open,
  fileSaved,
  dragging,
  copy,
  importText,
  dragHandlers,
}: Props) {
  const clips = shelfClips(state, fileSaved);
  const all = shelfClips({ ...state, query: "", filter: "all" }, fileSaved);
  const view = state.view;
  const selected =
    view.kind === "preview" || view.kind === "editor"
      ? all.find((clip) => clip.id === view.id)
      : undefined;
  const back = () => dispatch({ kind: "view", value: { kind: "history" } });

  function row(clip: ShelfClip) {
    return (
      <div key={clip.id} className={styles.rowWrap}>
        <div
          className={styles.row}
          data-kind={clip.kind}
          onContextMenu={(event) => {
            event.preventDefault();
            dispatch({ kind: "menu", id: clip.id });
          }}
        >
          <div
            className={styles.rowBody}
            tabIndex={-1}
            {...(clip.kind === "file" || clip.kind === "image"
              ? dragHandlers(clip)
              : {})}
            data-demo-target={
              clip.id === "handoff-pdf" ? "shelf-file" : undefined
            }
          >
            <ClipArtwork clip={clip} />
            <button
              type="button"
              className={styles.itemText}
              data-drag-handle={
                clip.kind === "file" || clip.kind === "image"
                  ? "true"
                  : undefined
              }
              onClick={() =>
                clip.kind === "text" ||
                clip.kind === "link" ||
                clip.kind === "color"
                  ? copy(clip)
                  : dispatch({
                      kind: "view",
                      value: { kind: "preview", id: clip.id },
                    })
              }
            >
              <strong>{clip.title}</strong>
              <span>{clip.note || clip.detail}</span>
            </button>
          </div>
          {clip.kind === "file" && clip.members.length > 1 && (
            <button
              type="button"
              className={styles.iconButton}
              aria-label="Expand file stack"
              aria-expanded={state.expanded === clip.id}
              onClick={() => dispatch({ kind: "expand", id: clip.id })}
            >
              <DemoSymbol name="chevron" size={17} />
            </button>
          )}
          <button
            type="button"
            className={styles.iconButton}
            aria-label={`Preview ${clip.title}`}
            onClick={() =>
              dispatch({
                kind: "view",
                value: { kind: "preview", id: clip.id },
              })
            }
          >
            <DemoSymbol name="preview" size={17} />
          </button>
          <button
            type="button"
            className={styles.iconButton}
            data-menu-trigger
            aria-label={`Actions for ${clip.title}`}
            aria-expanded={state.menu === clip.id}
            onClick={() =>
              dispatch({
                kind: "menu",
                id: state.menu === clip.id ? null : clip.id,
              })
            }
          >
            <DemoSymbol name="more" size={18} />
          </button>
        </div>
        {state.expanded === clip.id && clip.kind === "file" && (
          <div className={styles.members}>
            {clip.members.map((name) => (
              <button
                type="button"
                key={name}
                onClick={() =>
                  dispatch({
                    kind: "view",
                    value: { kind: "preview", id: clip.id },
                  })
                }
              >
                <DemoSymbol name="file" size={18} />
                {name}
              </button>
            ))}
          </div>
        )}
        {state.menu === clip.id && (
          <div
            className={styles.menu}
            role="menu"
            aria-label={`Actions for ${clip.title}`}
          >
            <button
              role="menuitem"
              onClick={() => {
                copy(clip);
                dispatch({ kind: "menu", id: null });
              }}
            >
              Copy
            </button>
            <button
              role="menuitem"
              onClick={() =>
                dispatch({
                  kind: "view",
                  value: { kind: "preview", id: clip.id },
                })
              }
            >
              Preview
            </button>
            <button
              role="menuitem"
              onClick={() => dispatch({ kind: "pin", id: clip.id })}
            >
              {clip.pinned ? "Unpin" : "Pin"}
            </button>
            {clip.kind === "text" && (
              <button
                role="menuitem"
                onClick={() =>
                  dispatch({
                    kind: "view",
                    value: { kind: "editor", id: clip.id },
                  })
                }
              >
                Edit snippet
              </button>
            )}
            <button
              role="menuitem"
              className={styles.destructive}
              onClick={() => dispatch({ kind: "delete", id: clip.id })}
            >
              Delete
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      ref={panelRef}
      id="sample-shelf"
      className={styles.shelf}
      data-open={open}
      data-theme={state.theme}
      aria-label="Kopy shelf"
      aria-hidden={!open}
      inert={!open}
      onPointerDown={(event) => {
        if (
          state.menu &&
          event.target instanceof Element &&
          !event.target.closest('[role="menu"],[data-menu-trigger]')
        )
          dispatch({ kind: "menu", id: null });
      }}
    >
      <div className={styles.header}>
        {state.view.kind !== "history" && (
          <button
            type="button"
            className={styles.iconButton}
            aria-label="Back to history"
            onClick={back}
          >
            <DemoSymbol name="back" />
          </button>
        )}
        <span className={styles.mark}>
          <DemoSymbol name="copy" size={18} />
        </span>
        <strong>Kopy</strong>
        <div className={styles.tools}>
          <button
            type="button"
            className={styles.iconButton}
            aria-label="Import sample clipboard"
            onClick={importText}
          >
            <DemoSymbol name="copy" size={19} />
          </button>
          <button
            type="button"
            className={styles.iconButton}
            aria-label="Emoji"
            onClick={() => dispatch({ kind: "view", value: { kind: "emoji" } })}
          >
            <DemoSymbol name="emoji" size={20} />
          </button>
          <button
            type="button"
            className={styles.iconButton}
            aria-label="Settings"
            onClick={() =>
              dispatch({ kind: "view", value: { kind: "settings" } })
            }
          >
            <DemoSymbol name="settings" size={19} />
          </button>
        </div>
      </div>
      {state.view.kind === "history" ? (
        <>
          <div className={styles.search}>
            <DemoSymbol name="search" size={18} />
            <input
              aria-label="Search Kopy history"
              placeholder="Search history"
              value={state.query}
              onChange={(event) =>
                dispatch({ kind: "search", value: event.target.value })
              }
            />
            {state.query && (
              <button
                type="button"
                className={styles.iconButton}
                aria-label="Clear search"
                onClick={() => dispatch({ kind: "search", value: "" })}
              >
                <DemoSymbol name="close" size={14} />
              </button>
            )}
          </div>
          <div
            className={styles.filters}
            role="group"
            aria-label="Filter history"
          >
            {filters.map((filter) => (
              <button
                type="button"
                key={filter.value}
                aria-label={filter.label}
                aria-pressed={state.filter === filter.value}
                onClick={() =>
                  dispatch({ kind: "filter", value: filter.value })
                }
              >
                <DemoSymbol name={filter.symbol} size={20} />
                {state.filter === filter.value && <span>{filter.label}</span>}
              </button>
            ))}
            <button
              type="button"
              aria-label="History options"
              aria-expanded={state.menu === "history"}
              data-menu-trigger
              onClick={() =>
                dispatch({
                  kind: "menu",
                  id: state.menu === "history" ? null : "history",
                })
              }
            >
              <DemoSymbol name="more" size={20} />
            </button>
          </div>
          {state.menu === "history" && (
            <div
              className={`${styles.menu} ${styles.historyMenu}`}
              role="menu"
              aria-label="History options"
            >
              <span>Show history</span>
              <span>✓ All time</span>
              <button
                role="menuitem"
                onClick={() => dispatch({ kind: "clear" })}
              >
                Clear unpinned history
              </button>
            </div>
          )}
          {state.filter === "text" && (
            <button
              type="button"
              className={styles.newSnippet}
              onClick={() =>
                dispatch({ kind: "view", value: { kind: "editor", id: null } })
              }
            >
              <DemoSymbol name="plus" size={15} />
              New snippet
            </button>
          )}
          <div className={styles.history}>
            {clips.some((clip) => clip.pinned) && (
              <>
                <div className={styles.groupLabel}>
                  <span>
                    <DemoSymbol name="chevron" size={15} />
                    Pinned
                  </span>
                  <span>{clips.filter((clip) => clip.pinned).length}</span>
                </div>
                {clips.filter((clip) => clip.pinned).map(row)}
              </>
            )}
            {clips.some((clip) => !clip.pinned) && (
              <>
                <div className={styles.groupLabel}>
                  <span>Recent</span>
                  <span>{clips.filter((clip) => !clip.pinned).length}</span>
                </div>
                {clips.filter((clip) => !clip.pinned).map(row)}
              </>
            )}
            {!clips.length && (
              <div className={styles.empty}>
                <DemoSymbol name="search" size={30} />
                <strong>No matching items</strong>
                <span>Try another search or show all history.</span>
                <button
                  type="button"
                  onClick={() => {
                    dispatch({ kind: "search", value: "" });
                    dispatch({ kind: "filter", value: "all" });
                  }}
                >
                  Show all history
                </button>
              </div>
            )}
          </div>
        </>
      ) : state.view.kind === "preview" && selected ? (
        <div className={styles.preview}>
          <h3>Preview</h3>
          <div className={styles.previewTitle}>
            <ClipArtwork clip={selected} size="large" />
            <div>
              <strong>
                {selected.kind === "text" ? "Text" : selected.title}
              </strong>
              <span>{selected.detail}</span>
            </div>
          </div>
          {selected.note && <p className={styles.note}>{selected.note}</p>}
          {selected.kind === "image" ? (
            <Image
              className={styles.previewImage}
              draggable={false}
              src={selected.value}
              alt="Sample studio moodboard"
              width={600}
              height={400}
            />
          ) : selected.kind === "color" ? (
            <div
              className={styles.colorPreview}
              style={{ background: selected.value }}
            >
              {selected.value}
            </div>
          ) : selected.kind === "file" ? (
            <div className={styles.previewFiles}>
              {selected.members.map((name) => (
                <div key={name}>
                  <DemoSymbol name="file" size={28} />
                  {name}
                </div>
              ))}
            </div>
          ) : (
            <p className={styles.previewText}>{selected.value}</p>
          )}
          <button
            type="button"
            className={styles.primary}
            onClick={() => copy(selected)}
          >
            <DemoSymbol name="copy" size={18} />
            Copy
          </button>
        </div>
      ) : state.view.kind === "editor" ? (
        <form
          className={styles.editor}
          key={state.view.id ?? "new"}
          onSubmit={(event) => {
            event.preventDefault();
            const value = new FormData(event.currentTarget).get("snippet");
            if (typeof value === "string")
              dispatch({
                kind: "save-text",
                id: state.view.kind === "editor" ? state.view.id : null,
                value,
              });
          }}
        >
          <h3>{selected ? "Edit snippet" : "New snippet"}</h3>
          <label htmlFor="demo-snippet">Text</label>
          <textarea
            id="demo-snippet"
            name="snippet"
            defaultValue={selected?.kind === "text" ? selected.value : ""}
            placeholder="Write something worth keeping…"
            required
            maxLength={2000}
            autoFocus
          />
          <div>
            <button type="button" onClick={back}>
              Cancel
            </button>
            <button className={styles.primary} type="submit">
              Save snippet
            </button>
          </div>
        </form>
      ) : state.view.kind === "emoji" ? (
        <div className={styles.emoji}>
          <h3>Emoji</h3>
          <p>Choose one to copy into the sample draft.</p>
          <div>
            {[
              "😊",
              "✨",
              "❤️",
              "👍",
              "🎉",
              "👋",
              "🔥",
              "💡",
              "🚀",
              "✅",
              "🌿",
              "☀️",
              "📌",
              "💻",
              "🎨",
              "🫶",
            ].map((emoji) => (
              <button
                type="button"
                key={emoji}
                aria-label={`Copy ${emoji}`}
                onClick={() =>
                  copy({
                    id: "emoji",
                    kind: "text",
                    title: emoji,
                    value: emoji,
                    detail: "Just now",
                    pinned: false,
                    note: "",
                  })
                }
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className={styles.settings}>
          <h3>Settings</h3>
          <p>Appearance</p>
          <div role="group" aria-label="Shelf appearance">
            <button
              type="button"
              aria-pressed={state.theme === "light"}
              onClick={() => dispatch({ kind: "theme", value: "light" })}
            >
              Light
            </button>
            <button
              type="button"
              aria-pressed={state.theme === "dark"}
              onClick={() => dispatch({ kind: "theme", value: "dark" })}
            >
              Dark
            </button>
          </div>
          <p>Default shortcut</p>
          <strong>⌃ ⌥ V</strong>
          <p className={styles.settingsNote}>
            This website uses sample content. In the Mac app, Settings also
            controls capture, shelf position, shortcuts and privacy.
          </p>
        </div>
      )}
      {state.undo && (
        <div className={styles.undo}>
          <span>History updated</span>
          <button type="button" onClick={() => dispatch({ kind: "undo" })}>
            Undo
          </button>
        </div>
      )}
      {dragging && (
        <div className={styles.dropHint}>
          <DemoSymbol name="all" size={17} />
          Drop to add to Kopy
        </div>
      )}
      <span className={styles.dropAnchor} data-demo-target="shelf-drop" />
    </div>
  );
}
