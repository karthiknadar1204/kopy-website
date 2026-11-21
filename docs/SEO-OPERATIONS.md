# Kopy search and release operations

Updated 2026-11-21. Current origin: https://kopy-website.vercel.app . This is an intentionally noindex preview. There are no claimed rankings, indexed pages, search clicks or live sales.

## What exists now

The homepage explains the clipboard/file shelf, actual fixture screenshots, supported macOS, planned USD 2.99 licence and release status. Support, privacy, terms, changelog, guides hub and two distinct task guides have server-rendered HTML, titles, descriptions, canonical links and incoming links. SoftwareApplication metadata contains factual product fields without fabricated reviews or a live purchase offer. The share image, robots and sitemap resolve. The sitemap contains canonical HTML content, not Markdown alternates, checkout state or drafts.

Both ScrollLaunch documents were assessed:

- https://scrolllaunch.com/prompts/ai-readable-site.md : HTML and `.md` use an explicit public-only registry. `llms.txt`, `llms-full.txt` and `ai.txt` expose public content only. Alternate Markdown responses carry noindex and canonical HTML references. Content negotiation on the same HTML URL was intentionally omitted: explicit alternates avoid a second representation in the HTML CDN cache. Ordinary HTML requests remain HTML. These files are not ranking boosts or a promise that AI services will cite Kopy.
- https://scrolllaunch.com/prompts/ai-citation-data-pages.md : no eligible original dataset exists yet. Do not manufacture research pages or convert test sales/fixture counts into public statistics. Revisit only after a real publishable study with method, date and denominators exists.

The first pages to review after indexing are the homepage and `/guides/clipboard-history-on-mac`. The file shelf guide answers a separate intent at `/guides/move-files-between-mac-apps`. Keyword themes come from qualitative searches, not paid volume estimates. The guide acknowledges Apple's built-in history on macOS Tahoe 26 and later, rather than pretending that feature never exists.

## Verify each website change

From the website repository:

```sh
pnpm check
CHECK_SITE_URL=https://kopy-website.vercel.app pnpm exec tsx scripts/check-live-site.ts
```

The second command checks 24 routes, noindex on preview HTML, content types, canonical origins, sitemap membership and internal destinations. Open changed pages on desktop and at phone width too. Check the real checkout destination and release availability text. Never put a private Dodo API key into this repository, hosting environment or browser bundle: the website only needs a public hosted test-checkout URL.

CI checks every main push and pull request. The public-site check runs daily at 03:17 UTC / 08:47 Asia/Kolkata, with manual dispatch as well. A hosted smoke run passed on November 21: https://github.com/karthiknadar1204/kopy-website/actions/runs/44870589904 . The schedule itself has not yet reached its first daily run. In GitHub notification settings, enable Actions failure notifications for this repository if email alerts are wanted; delivery is not proven just because a workflow exists. No Codex recurring automation was created.

## Turn the preview into an indexed launch later

1. Choose the final domain and connect it in Vercel. Confirm HTTPS and the preferred host. Set `SITE_URL` to that exact origin in the site's environments. Replace the preview links in native `KopyLinks`, Store listing URLs, Dodo checkout return URLs and these operational notes.
2. Keep `SITE_INDEXABLE=false` until public release is authorised. Finish consumer terms/refund policy, signed distribution and final testing first. At the launch decision, explicitly set `SITE_INDEXABLE=true` and deploy. Check the final HTML robots metadata and response header again. Keep `.md` alternates and checkout/result pages noindex. Update the daily checker’s public-HTML indexing expectation as part of that launch change; it currently deliberately asserts preview noindex.
3. In Google Search Console, add the final Domain property, copy its TXT verification record into that domain's DNS, then Verify. A URL-prefix property can use its supplied alternate verification method when DNS is unavailable. Do not claim ownership of a domain you have not selected.
4. Submit the final `/sitemap.xml`. Inspect the homepage and both guide URLs. Use Test live URL and, when appropriate, one Request indexing for a new or substantially revised page. These actions do not guarantee indexing.
5. Repair the operator's GumCLI profile and read the exact property. Google sign-in approval for Kopy's customers is not needed: Kopy has no customer login. A Desktop OAuth client for the operator's Search Console reporting is a separate tool permission.

## GumCLI: exact read-only reporting sequence

GumCLI 2.3.3 is already installed on this Mac. During preparation, `sites.list` failed with `SCOPE_MISSING` for `webmasters.readonly`. That means access failed; it does not mean Google returned zero queries. Reauthorize only the reporting service, then verify the intended property appears:

```sh
gum --version
gum --profile seo auth login --service searchconsole
gum --profile seo read searchconsole.sites.list --output json
```

After the final property is verified, replace the example property and URL below. Choose a final data window; do not run these example-domain queries literally:

```sh
gum --profile seo read searchconsole.searchanalytics.query \
  --args '{"siteUrl":"sc-domain:YOUR_DOMAIN","body":{"startDate":"2026-10-18","endDate":"2026-11-14","type":"web","dataState":"final","dimensions":["page","query"],"rowLimit":1000}}' \
  --output json

gum --profile seo read searchconsole.urlInspection.index.inspect \
  --args '{"body":{"siteUrl":"sc-domain:YOUR_DOMAIN","inspectionUrl":"https://YOUR_DOMAIN/"}}' \
  --output json
```

Use the latest 28 finalised days and the previous 28, keeping search type, geography and device filters comparable. Repeat the performance query with dimensions omitted for property totals, `["page"]` for pages and `["query"]` for terms. Page through more than 1,000 grouped rows with `startRow`; Google can omit rare queries. The reusable skill's report script can collect both windows:

```sh
python3 /Users/karthiknadar/.codex/skills/launch-app-seo/scripts/search_console_report.py \
  --profile seo --site-url sc-domain:YOUR_DOMAIN \
  --inspect https://YOUR_DOMAIN/
```

Keep reports private. The URL Inspection API returns Google's stored crawl result; use Search Console's UI for a live test or a normal indexing request. Read-only Search Console does not provide general market keyword volumes, ad research, backlinks, revenue, App Store rankings or automatic content changes. Keyword Planner needs separate Google Ads API/developer-token setup; no ad buying or Ads access was configured here.

## Decide what to improve

- No indexing: inspect fetch, canonical, noindex/robots, sitemap and incoming links first. Do not publish more pages to compensate for a fetch problem.
- Impressions but few clicks: inspect the actual query and search results, intent, position, title and description. A low click rate at a low position is not automatically a bad title.
- Relevant terms around positions 8–30: improve the matching page with a clearer answer, current screenshots and useful internal links. Avoid a second near-duplicate page for the same answer.
- Clicks but weak purchase interest: check offer clarity, platform requirements, demo, release availability and checkout. Search Console alone cannot identify visitor-to-purchase conversion.
- No query rows in a successful response: inspect property totals and page data, then stored indexing results. New sites can take time; an authorization error is a different condition.

Review indexing during week one, early signals around day 14 and finalised 28-day comparisons when available. These are review intervals, not ranking deadlines. Improve one evidence-backed page per review; don't require a low-value article every day.

## Purchases, backlinks and distribution

Dodo's dashboard/API is the source for payment status, refunds, delivered grants and activation seats. The native app validates access. A checkout return URL never proves payment. The site intentionally has no customer database, client analytics or visitor-to-purchase attribution. GumCLI measures website search visibility after a verified production property exists; it cannot reconcile revenue.

A backlink is another website linking to a useful Kopy page. Earn relevant links through an original guide, a real product listing, a reviewer or helpful community participation. Do not buy link packages, fabricate reviews or mass-post clones of articles. Track a small sheet of publication URL, linked Kopy page, date and purpose; keep internal links between relevant guides and product pages useful to readers.

Unpublished X/Medium/directory drafts are in `docs/LAUNCH-DRAFTS.md`. Publish only after authorisation and release readiness. Link to the relevant final page, use campaign tags on external campaign links if useful, and keep sitemap/canonical URLs clean. No posts, emails to prospects or directory submissions were sent in this pass.
