# Kopy website refresh

November 21, 2026. Scope: public website presentation and a sourced comparison with Spotlight Clipboard. Preserve the noindex preview, test-only purchase flow, public content registry and legal disclosures.

## References and synthesis

Reviewed public product material for Dropover, Paste, CleanShot, Raycast, Craft, Screen Studio and Linear. Browser visual review covered Dropover, Paste and CleanShot in the preceding research pass, plus Craft, Screen Studio and Raycast in this pass. Linear's public content was available through web search, but its browser URL redirected into an existing workspace; that private workspace was not inspected for design research.

- https://dropoverapp.com/ — explain the handoff with the product itself.
- https://pasteapp.io/ — keep the core promise readable and show real copied content.
- https://cleanshot.com/ — clear hierarchy and substantial product demonstrations.
- https://www.raycast.com/ — restrained navigation and tactile native controls.
- https://www.craft.do/ — treat the product as a place for a person's work, with a distinct visual composition.
- https://screen.studio/ — frame actual software views as the main visual evidence.
- https://linear.app/ — public product storytelling and focused feature progression.

No competitor assets, testimonials, user counts, badges, copy or source code are reused.

## Direction before implementation

Considered two compositions:

A. Centred headline over a broad screenshot.

    navigation
       headline
       actions
    wide app screenshot

B. Copy alongside an edge-shelf demonstration.

    floating navigation
    promise + actions | actual shelf on a desktop stage
    compact workflow benefits
    full file-stack demonstration
    Spotlight comparison
    privacy, questions and purchase information

Choose B. A repeats the previous page's headline-then-screenshot arrangement. B puts Kopy's recognisable shelf in the first screen and makes its edge interaction the memorable visual. The first refresh used a crop of a fixture screenshot; the interactive hero update below replaces that crop while retaining real screenshots farther down the page.

Palette: porcelain #fbfcfe, graphite #24282f, slate #626b79, coral #a84632, lilac #e9eaf5 and pale blue #edf2f7. Keep coral from the app icon rather than adopting a reference site's accent. Type: the system sans family, with deliberate display sizing and relaxed body text suitable for a native Mac product. Left-aligned copy, varied section sizes, quiet borders, one substantial product stage. Avoid repeated decorative badges, invented metrics, stock illustrations and automatic animations. Keep reduced-motion behaviour and visible keyboard focus.

## Comparison evidence

Apple's published workflow covers searching recent copies, copying an item, pasting into a destination and clearing history. Its macOS 26 guide documents Command-Space followed by Command-4. Do not claim that Macs only retain a single clipboard item. Do not infer that a missing feature in that guide means all macOS apps lack it. Compare Spotlight's Clipboard view specifically, and label undocumented controls accordingly. Do not make retention-time claims that vary by macOS update.

Source: https://support.apple.com/guide/mac-help/mchl40d5b86b/mac . The macOS 26 version was also checked through Apple's indexed guide. Kopy claims use the native app's existing features and prior test evidence: editable snippets, pinned/noted items, file stacks and the last 20 manual delete/clear actions surviving restart. Do not call this unlimited permanent storage or a backup.

Keep comparison content in one typed source shared by the visible homepage and its public Markdown representation. No new comparison URL is needed for this small section.

## Verification

The production build, ESLint, strict TypeScript checks and all five existing boundary/content tests pass. Browser QA used the production server with the existing CSP unchanged. Phone widths of 320px and 390px, a 768px tablet and the normal desktop viewport were checked. The comparison fits without horizontal page scrolling.

Verified native-popover Escape and outside-click dismissal, closing on a navigation selection, keyboard skip-to-main focus, opening/closing the complete screenshot, and opening/closing FAQ answers. The purchase page still exposes only the test checkout; policy and guide pages remain readable. Production browser logs showed no new errors during the check.

Polish fixes include mobile access to all navigation links, explicit home-to-main anchors, persistent navigation while reading, larger tap targets and using the ordered list's own numbers so assistive technology does not announce duplicate step numbers. The full image remains available rather than making the cropped hero the only product evidence.

Screenshots and live deployment checks are delivered with the task. Search indexing and live purchasing remain unchanged from the prelaunch setup.

## Interactive hero

The follow-up brief calls for a working browser demonstration with Watch demo and Try it yourself, while preserving the actual app screenshots below it. Reviewed the public interactive-demo material at [Navattic](https://www.navattic.com/) and [Arcade](https://www.arcade.software/lp/product-demo-video), plus [Dropover's shelf presentation](https://dropoverapp.com/). Borrow the pattern of a short, self-directed product journey; do not embed their services or reuse their assets.

Keep the existing palette, system type and split hero. The memorable element is now a miniature desktop: Notes, Message and Kopy's edge shelf. Avoid an autoplay video, a second large screenshot in the same hero, and a separate tour modal that would hide the page's context. Watch runs once after a visitor starts it, points at the relevant controls, and supports pause, resume and replay. Reduced-motion preferences remove moving effects and replace automatic steps with Next step. The tour pauses when the browser tab is hidden.

Hands-on mode uses a local reducer shared with the guided tour's actions. Visitors copy a sample note, open the shelf, switch windows, choose the snippet and paste. They can also drag the sample PDF onto the edge, switch windows and drag it into the draft. Explicit Add file to shelf and Attach file controls provide touch and keyboard alternatives. Escape closes the shelf. Reset clears the demo, and switching away from Watch cancels its pending timer. Text uses copy/paste; file cards use drag/drop, matching Kopy's native behaviour.

The desktop, file artwork and windows are HTML/CSS fixtures, clearly labelled as a browser demo. It never calls the Clipboard API, reads local files, uploads attachments, sends messages, requests permissions, or stores visitor data. The dark native screenshot and expandable full light screenshot remain the product evidence below the simulation. The homepage Markdown also describes the demo and its sample-only boundary.

Verification: all ten tests, ESLint, strict TypeScript and the production build pass. The five new state-flow tests cover the guided handoff, text reuse, file prerequisites, reset, stale tour actions after switching mode, and manual reduced-motion stepping. Production-browser QA covers watch/pause/resume/replay, switching to hands-on mode, text copy/paste, real browser file drags in both directions, button alternatives, Escape and keyboard activation. Layout checks cover 320px, 390px, 768px and the normal desktop viewport. Both real screenshots still load and expand. Browser error logs are empty. Reduced-motion state transitions are covered by tests; the Mac's accessibility preference was not changed for QA.

Polish fixes from the browser pass: give the sample window enough height to avoid clipping its file controls, remove a duplicate play prompt, prevent accidental text selection when dragging file rows, and keep progress completed after the shelf closes. Screenshot artifacts are delivered with the task. The noindex preview and Dodo test-only purchase boundary remain in place.

## Full shelf interaction correction

The initial interactive hero explained text copy/paste but did not show the defining file handoff or demonstrate closing and reopening. Replace the default tour with a full file journey: pick up the PDF, hold it over the edge, watch the empty shelf open, release it into the shelf, move away, see the shelf retract, switch windows, reopen, pick the file back up, drag it into the draft and release. The guided pointer carries the same file artwork as the source; its positions come from the actual target elements rather than breakpoint-specific coordinates.

Keep the shelf mounted while its transform, opacity and visibility animate. Closing preserves the sample contents. In hands-on mode, pointer exit retracts the shelf after a short delay, outside clicks and Escape close it, and hovering over the edge reopens it. A held sample file keeps it available while the pointer is pressed. Explicit close and attach controls provide keyboard and touch alternatives. The same local-only privacy boundary remains.

The sample file is a local illustration, so hands-on dragging uses pointer capture and a file preview rather than the browser’s external file-transfer API. A shared geometric destination check accepts the edge, the open shelf and an outbound draft; other releases cancel. Hovering at the edge opens the shelf, and closing is suspended during a held drag. Cancellation adds nothing and retains already collected files. On phones, starting either mode brings the desktop stage into view so the file journey and captions are visible together.

State tests now cover the complete retract/reopen journey, geometric drop destinations and cancellation in addition to the original text, reset and configuration checks. Verify the revised interaction on the production build and deployed preview, including desktop file dragging and mobile close/reopen controls. Screenshots accompany the change; no native app code, public indexing or live-payment settings change.
