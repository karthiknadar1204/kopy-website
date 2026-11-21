# Kopy website launch preparation

2026-11-21. Account-free Next.js website for the native macOS clipboard and file shelf. One-time proposed price: USD 2.99. Dodo hosted checkout and licence issuance. No customer accounts or database. No live payments, Apple membership/signing/submission or unsigned public downloads.

## Work list

- [x] Research buyer intent and write page briefs.
- [x] Build homepage, support, privacy, terms, changelog and guides.
- [x] Configure Dodo test-only commerce and verify safe redirect behaviour.
- [x] Assess both ScrollLaunch prompts, public content only.
- [x] Test production build, route responses, accessibility and responsive layout.
- [x] Deploy and inspect the preview.
- [x] Prepare monitoring, reporting and distribution drafts.

The user chose a preview URL. Keep preview pages noindex. Choose a production domain before enabling indexing, claiming canonical production URLs or verifying Search Console. GumCLI reports Google website search data, not Dodo revenue or App Store sales. Use Dodo reporting for payments and licences. Prepare distribution drafts; do not post them.

## Design direction

Use Kopy's actual app icon and fixture screenshots. A cool paper background, graphite text and the app's restrained coral accent frame a large product demonstration. System sans typography keeps the site close to the Mac utility; avoid fake testimonials, purchase counters or ornamental statistics. Use an interactive shelf demonstration only when clearly identified as a demonstration, with the actual app screenshot as the primary evidence.

## Verification record

Preview: https://kopy-website.vercel.app . Next.js production build, ESLint, strict typecheck and five boundary/content tests pass. All 24 public HTML/Markdown/discovery/buy/return/share-image HTTP checks pass on the deployed site. Desktop and 390px phone-width layouts were reviewed in Chrome. No known production dependency vulnerabilities were reported by pnpm audit.

Both failed and successful Dodo test payments were exercised through hosted checkout; their API states agreed. The user confirmed delivery of both the receipt and licence email. Native strict-release activation, persistence, deactivation and explicit remote revocation were exercised in an isolated test app. Refund testing is incomplete: Dodo returned INSUFFICIENT_WALLET_FUNDS, so no successful refund or automatic refund/revocation claim is made.

Vercel is linked to the user's GitHub repository. SITE_URL points to this temporary origin; SITE_INDEXABLE=false. The only commerce environment variable is a public TEST checkout URL. No private Dodo API key is hosted or committed. The public installer and live payments remain unavailable.

The daily site workflow was configured and its manual hosted smoke run passed. Failure email delivery depends on GitHub notification preferences and was not verified. Search Console/domain verification is deferred by the user's preview choice, and existing GumCLI authorization reported SCOPE_MISSING. Follow docs/SEO-OPERATIONS.md for the exact next steps. Google customer OAuth approval is inapplicable because the product has no login.

Distribution copy remains drafts. Apple signing/submission, live sales, the final domain/indexing decision and successful refund testing remain release gates.
