import type { ReactNode } from "react";

export type DemoSymbolName =
  | "copy"
  | "search"
  | "text"
  | "link"
  | "image"
  | "file"
  | "folder"
  | "color"
  | "stack"
  | "all"
  | "more"
  | "preview"
  | "chevron"
  | "back"
  | "close"
  | "pin"
  | "emoji"
  | "settings"
  | "plus"
  | "mail"
  | "finder"
  | "expand"
  | "play";

const paths = {
  copy: (
    <>
      <rect x="8" y="8" width="12" height="13" rx="2" />
      <path d="M16 8V3H3v14h5M11 12h6M11 15h4" />
    </>
  ),
  search: (
    <>
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="m15.5 15.5 5 5" />
    </>
  ),
  text: <path d="M4 5h16M4 10h12M4 15h16M4 20h10" />,
  link: (
    <>
      <path d="m10 14 4-4M9 17l-1 1a4 4 0 0 1-6-6l4-4a4 4 0 0 1 6 0M15 7l1-1a4 4 0 0 1 6 6l-4 4a4 4 0 0 1-6 0" />
    </>
  ),
  image: (
    <>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <circle cx="8" cy="9" r="1.5" />
      <path d="m4 18 6-6 4 4 3-3 4 4" />
    </>
  ),
  file: (
    <>
      <path d="M5 3h9l5 5v13H5ZM14 3v6h5M8 13h8M8 17h6" />
    </>
  ),
  folder: <path d="M3 6h7l2 3h9v12H3ZM3 6V4h6l2 2" />,
  color: (
    <>
      <path d="M21 11c0 5-3 3-5 4s1 6-4 6A10 10 0 1 1 21 11Z" />
      <path d="M7 7h.1M12 5h.1M17 8h.1M6 13h.1" strokeWidth="3" />
    </>
  ),
  stack: <path d="m3 8 9-5 9 5-9 5ZM3 13l9 5 9-5M3 18l9 5 9-5" />,
  all: (
    <>
      <path d="M4 5h16l2 11v4H2v-4ZM2 15h6l2 3h4l2-3h6" />
    </>
  ),
  more: (
    <>
      <circle cx="4" cy="12" r="1" />
      <circle cx="12" cy="12" r="1" />
      <circle cx="20" cy="12" r="1" />
    </>
  ),
  preview: <path d="M4 4h6M4 4v6M4 4l6 6M20 20h-6M20 20v-6M20 20l-6-6" />,
  chevron: <path d="m6 9 6 6 6-6" />,
  back: <path d="m15 5-7 7 7 7" />,
  close: <path d="m6 6 12 12M6 18 18 6" />,
  pin: <path d="m9 3 9 9-3 1-2 5-3-3-6 6M8 4l12 12M10 8l-4 5 5 5" />,
  emoji: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M8 9h.1M16 9h.1M7 14q5 7 10 0" />
    </>
  ),
  settings: (
    <>
      <path d="m10 2-1 3-3 1-3-1-2 4 2 2v3l-2 2 2 4 3-1 3 1 1 3h4l1-3 3-1 3 1 2-4-2-2v-3l2-2-2-4-3 1-3-1-1-3Z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  plus: <path d="M12 4v16M4 12h16" />,
  mail: (
    <>
      <rect x="2" y="4" width="20" height="16" rx="3" />
      <path d="m3 6 9 7 9-7" />
    </>
  ),
  finder: (
    <>
      <rect x="2" y="2" width="20" height="20" rx="4" />
      <path d="M13 2 10 13h4v9M7 8v2M17 8v2M6 16q6 5 12 0" />
    </>
  ),
  expand: <path d="M9 3H3v6M15 3h6v6M3 15v6h6M21 15v6h-6" />,
  play: <path d="m8 4 13 8-13 8Z" />,
} satisfies Record<DemoSymbolName, ReactNode>;

export function DemoSymbol({
  name,
  size = 20,
}: {
  name: DemoSymbolName;
  size?: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.65"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  );
}
