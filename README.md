# Kopy website

Next.js App Router website for Kopy’s account-free Mac clipboard and file shelf. It is a prelaunch preview: no signed public download or live payment is offered.

## Run and verify

```sh
pnpm install
pnpm dev
pnpm check
```

Node 22 and pnpm 10.26.2 are used in CI. `pnpm check` runs ESLint, TypeScript, meaningful configuration/content tests and a production build. The separate manual `Check public site` workflow checks deployed HTML, Markdown, sitemap, robots and image routes. It does not create a recurring schedule or a Codex automation.

## Configuration

Copy `.env.example` to `.env.local` only when needed. Do not add private payment keys to this app: hosted checkout requires only a public checkout URL.

- `SITE_URL`: canonical HTTPS origin. Defaults to `https://kopy-website.vercel.app`; localhost HTTP is accepted for development.
- `SITE_INDEXABLE`: defaults to false. Only set `true` after reviewing the production domain and publication decision. Preview pages return `noindex` in both metadata and headers.
- `DODO_TEST_CHECKOUT_URL`: an HTTPS URL on exactly `test.checkout.dodopayments.com`, with `/buy/<id>` or `/session/<id>`. Live hosts, credentials and other protocols are rejected. `/buy` labels test mode and gives no production entitlement.

Never place a private API key in `NEXT_PUBLIC_*`, browser code, the repository, or an app download. Apple setup, signing, notarisation and live payments are outside this preparation phase.

## Structure and content

- `app/`: public Next.js pages and machine-readable routes.
- `components/`: shared navigation, article rendering and native-style icons.
- `lib/content.ts`: the typed public content registry. Article HTML and Markdown use this same source.
- `lib/site.ts`: origin validation, prelaunch settings and test-checkout allowlist.
- `public/images/`: the existing Kopy app icon and screenshots rendered from fixture content. No real clipboard history is included.
- `tests/`: checkout/origin boundary tests and content/link consistency.

Public documents: home, privacy, support, terms, changelog, guides hub and two practical guides. `.md` routes are explicit rewrites to a public-only Markdown handler. HTML stays the default. Markdown has canonical HTML links and `noindex`; it is excluded from the sitemap. The registry produces `llms.txt` and `llms-full.txt`. There is no private-page export, client analytics, Google login or customer database.

## Design

The site is a quiet frame around actual Kopy views. Cool paper `#f5f7f8`, graphite `#262d31`, slate `#65717a`, blue-grey `#e8eef2`, restrained coral `#a84632` and white `#ffffff` form the palette. System typography is intentional for a native Mac utility; the large, left-aligned headline sits beside a thin edge handle, and the actual product screenshot dominates the first scroll. Feature rows replace a repeated marketing-card grid. Legal and guide pages use a readable single column.

The first design pass considered a simulated draggable shelf and a screenshot-led page. The screenshot-led direction won because it explains the actual product without shipping a browser imitation that could misrepresent native behaviour. No testimonials, user counters, performance numbers or review scores are invented.

## Release boundaries

Store screenshots show Store behaviour. The Store build uses manual Command-V; optional automatic paste belongs to the direct build. File/image cards support drag-out; text uses copy/paste. macOS Tahoe 26 and later includes Spotlight clipboard history, so the guide describes that built-in option and explains Kopy’s different edge-shelf workflow.

The purchase/licence terms and offline allowance remain proposed until final release review. Keep website facts aligned with the signed app, Dodo product settings and privacy policy. The parent launch-preparation notes track external setup and unverified release gates.
