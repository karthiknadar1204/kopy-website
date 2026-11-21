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

Choose B. A repeats the previous page's headline-then-screenshot arrangement. B puts Kopy's recognisable shelf in the first screen and makes its edge interaction the memorable visual. Keep the underlying interface factual; the main shelf is a CSS crop of the existing fixture screenshot, with the full view available farther down the page. Stage annotations describe features rather than pretend to be interactive app controls.

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
