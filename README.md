# Kopy website

Next.js App Router website for Kopy’s account-free Mac clipboard and file shelf. It is a prelaunch preview: no signed public download or live payment is offered.

## Run and verify

```sh
pnpm install
pnpm dev
pnpm check
```

Node 22 and pnpm 10.26.2 are used in CI. `pnpm check` runs ESLint, TypeScript, meaningful configuration/content tests and a production build. The separate `Check public site` workflow runs daily at 03:17 UTC and can also be started manually. It checks deployed HTML, Markdown, sitemap, robots, canonical paths, internal links and preview noindex directives. Set the repository variable `SITE_URL` if the production host changes. GitHub Actions notifications depend on the owner’s notification settings; this workflow does not prove email delivery. It does not create a Codex automation.

## Configuration

Copy `.env.example` to `.env.local` only when needed. Do not add private payment keys to this app: hosted checkout requires only a public checkout URL.

- `SITE_URL`: canonical HTTPS origin. Defaults to `https://kopy-website.vercel.app`; localhost HTTP is accepted for development.
- `SITE_INDEXABLE`: defaults to false. Only set `true` after reviewing the production domain and publication decision. Preview pages return `noindex` in both metadata and headers.
- `DODO_TEST_CHECKOUT_URL`: an HTTPS URL on exactly `test.checkout.dodopayments.com`, with `/buy/<id>` or `/session/<id>`. Live hosts, credentials and other protocols are rejected. `/buy` labels test mode and gives no production entitlement.

Never place a private API key in `NEXT_PUBLIC_*`, browser code, the repository, or an app download. Apple setup, signing, notarisation and live payments are outside this preparation phase.

## Structure and content

- `app/`: public Next.js pages and machine-readable routes.
- `components/`: shared navigation, article rendering and native-style icons.
- `lib/content.ts`: the typed public content registry. Article HTML and Markdown use this same source. `lib/home.ts` supplies homepage copy to both renderings.
- `lib/site.ts`: origin validation, prelaunch settings and test-checkout allowlist.
- `public/images/`: the existing Kopy app icon and screenshots rendered from fixture content. No real clipboard history is included.
- `lib/demo.ts`: browser demo state, fixture content and guided tour.
- `tests/`: demo handoff/reset tests, checkout/origin boundaries and content/link consistency.

Public documents: home, privacy, support, terms, changelog, guides hub and two practical guides. `.md` routes are explicit rewrites to a public-only Markdown handler. HTML stays the default. Markdown has canonical HTML links and `noindex`; it is excluded from the sitemap. The registry produces `llms.txt` and `llms-full.txt`. There is no private-page export, client analytics, Google login or customer database. `/purchase-complete` is a noindex, generic checkout-return page: URL parameters never establish payment or licensing state.

## Design

The homepage puts an interactive, browser-local Kopy demonstration beside its main promise, followed by feature summaries, a dark file-stack showcase, a sourced Spotlight comparison and readable privacy/purchase information. Porcelain #fbfcfe, graphite #24282f, slate #626b79, coral #a84632, lilac #e9eaf5 and pale blue #edf2f7 preserve the app's identity. System typography and tactile keycaps suit the native Mac utility. Real app screenshots stay below the demo, including the complete light interface in an expandable view. The hero offers a finite file drag-and-drop walkthrough with pause/replay, and a hands-on mode with text copy/paste, file drag/drop and tap/keyboard alternatives. It never reads the system clipboard or real files, sends messages, or persists demo data. The tour shows picking up a file, hovering over the closed edge, dropping onto the shelf, retracting it, switching windows, reopening it and dragging the file into a draft. Hands-on shelves also slide closed on pointer exit, outside click or Escape without losing their sample contents. Reduced motion uses an explicit Next step control.

Mobile navigation uses the browser's automatic popover for Escape/outside-click dismissal and closes on selection. Comparison copy has one source in lib/home.ts and appears in both HTML and Markdown. It compares Spotlight's documented Clipboard workflow, includes Apple's source, and does not invent retention limits, reviews or performance claims.

See [design research and verification](docs/DESIGN-REFRESH.md) for the reference sites, composition decision and checks.

## Release boundaries

Store screenshots show Store behaviour. The Store build uses manual Command-V; optional automatic paste belongs to the direct build. File/image cards support drag-out; text uses copy/paste. macOS Tahoe 26 and later includes Spotlight clipboard history, so the guide describes that built-in option and explains Kopy’s different edge-shelf workflow.

The purchase/licence terms and offline allowance remain proposed until final release review. Keep website facts aligned with the signed app, Dodo product settings and privacy policy. The parent launch-preparation notes track external setup and unverified release gates.
