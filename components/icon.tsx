export function Icon({ name, size = 24 }: { name: string; size?: number }) {
  const paths =
    name === "search" ? (
      <>
        <circle cx="10.5" cy="10.5" r="6.5" />
        <path d="m15.5 15.5 5 5" />
      </>
    ) : name === "undo" ? (
      <>
        <path d="M7 7H3V3M3 7a9 9 0 1 1-1 8" />
      </>
    ) : name === "text" ? (
      <>
        <path d="M4 5h16M12 5v15M8 20h8" />
      </>
    ) : name === "lock" ? (
      <>
        <rect x="5" y="10" width="14" height="11" rx="3" />
        <path d="M8 10V7a4 4 0 0 1 8 0v3M12 14v3" />
      </>
    ) : (
      <>
        <rect x="3" y="5" width="14" height="14" rx="3" />
        <path d="M17 9h4v13H7v-3M7 10h6M7 14h4" />
      </>
    );
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths}
    </svg>
  );
}
