import Link from "next/link";
export default function NotFound() {
  return (
    <main id="main" tabIndex={-1} className="not-found wrap">
      <p className="availability">Page not found</p>
      <h1>This shelf is empty.</h1>
      <p>The page may have moved, or the address may be incorrect.</p>
      <Link className="button button-primary" href="/">
        Go to Kopy home
      </Link>
      <Link className="text-link" href="/support">
        Get support
      </Link>
    </main>
  );
}
