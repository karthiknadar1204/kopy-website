# Kopy product presentation

November 21, 2026. This document describes the current website. Keep the prelaunch noindex setting, Dodo test-only checkout, legal pages and actual Mac screenshots intact.

## Direction and references

The product is the demonstration. Use a centred headline followed by a wide MacBook desktop, with a faithful Kopy shelf at its actual interface proportions. Give the interface enough room to explain itself. Keep supporting text, features, the Spotlight comparison and purchasing information outside it.

Primary references reviewed:

- [Cove](https://heycove.app/): the full homepage’s product-led progression, large desktop hero, full shelf and clipboard panels, feature sections, comparison, pricing, FAQ and support. Browser review covered the desktop/notch interaction, shelf/Vault controls, clipboard search, pricing and closing sections. The useful pattern is a detailed product surface with direct interaction, not a tiny illustrative substitute.
- [Aceternity MacBook Scroll](https://ui.aceternity.com/components/macbook-scroll): device silhouette, bezel, display and presentation scale. The component was reviewed in the browser and in its official documentation.
- [Aceternity Container Scroll](https://ui.aceternity.com/components/container-scroll-animation): a large product surface as the focal point. Do not add perspective during an active drag, which would complicate pointer geometry.
- Earlier product references include Dropover, Paste, CleanShot, Raycast, Craft and Screen Studio. Keep their useful emphasis on the product without copying assets, claims or content.

No competitor code, images, testimonials, logos, usage figures or marketing claims are included. The device shell, vector wallpaper and sample moodboard are local source assets; no new UI or animation dependency is required.

## Match the app

Kopy’s source and fixture screenshots are the visual authority:

- [ShelfView.swift](https://github.com/karthiknadar1204/kopy/blob/main/Sources/KopyApp/Interface/ShelfView.swift): header, actions, search, filters and history structure.
- [ShelfTheme.swift](https://github.com/karthiknadar1204/kopy/blob/main/Sources/KopyApp/Interface/ShelfTheme.swift): colours, typography, badge and corner radius.
- [ClipCard.swift](https://github.com/karthiknadar1204/kopy/blob/main/Sources/KopyApp/Interface/ClipCard.swift): row layout, artwork, metadata, preview and stack controls.
- The actual Store fixture screenshots retained in public/images provide the visible comparison.

The native dark surface is #191A1D, toolbar #222327, inset #2D2E33, line #3C3D43, ink #F7F3ED, muted #ACA9A5, accent #FFAB8C and highlight #48302C. Light appearance uses the corresponding native tokens. Keep the native system font, 18px title, 13px row text, 36px search field, 16px panel radius and 362px shelf width. The history scrolls when the available screen height is shorter. Preserve the full UI when adapting the presentation to smaller screens.

The website’s porcelain, graphite and coral identity remains. A large, quiet desktop scene is the central visual; avoid decorative animations or another miniature simulation beside it.

## Interactive scope

The hero begins with the populated shelf open and usable. Search, kind filters, pins, previews, stack expansion, snippet creation/editing, deletion and Undo operate on local fixtures. Appearance and emoji previews are available through the toolbar. Sample clipboard imports and copies stay inside the demo. Finder provides a PDF, moodboard and file stack. Mail is a sample draft, with no send action or network transport.

The file-handoff tour shows pickup, edge hover, collection, retraction, a window switch, reopening and dragging out. The same pointer-based geometry handles hands-on drags; it works through display scaling and inside the expanded modal. Active capture starts at pointer-down so a fast drag across the full desktop cannot lose the source. Cancellation preserves collected items. Keyboard and touch copy/paste controls provide alternatives to dragging.

The desktop scene uses a 1280×800 design surface scaled inside the device. Open full demo switches to a modal surface at the actual available viewport size. The same controller retains the sample history and draft. Modal focus, Escape and return-to-page behaviour need browser verification. Native controls remain readable in the expanded phone presentation. Reduced motion uses manual tour steps and removes animated transitions.

## Truth and release boundaries

This is a browser rendering of Kopy’s interface with sample data. It does not execute the SwiftUI app, access private clipboard history or files, request macOS permissions, send email, upload attachments, or persist visitor content. Original app screenshots remain below so visitors can inspect the native product itself. No Apple signing, App Store submission, live payments or indexing settings change in this task.

The Spotlight comparison still uses Apple’s documented Clipboard workflow and Kopy’s native capabilities. Avoid unverified retention limits or claims about every macOS app. Keep comparison copy shared between HTML and Markdown. Source: https://support.apple.com/guide/mac-help/mchl40d5b86b/mac .

## Verification

Use pnpm check for lint, strict types, behaviour tests and a production build. State tests cover the guided flow and drop destinations, history filtering, pinning, delete/Undo, identity-preserving snippet edits, distinct new snippets and deduplicated file imports. Browser QA must exercise the real interactive scene on desktop and mobile widths, including the expanded view and file transfers. Check the original screenshots and public routes after deployment. Capture the full desktop and expanded phone interface for review, and stop the local server when finished.

The November 21 browser check covered the 1470px desktop, 390px phone and 320px phone layouts. Search, image previews, pinning, deletion and Undo, stack expansion, snippet creation and editing, sample Mail paste, and appearance controls passed. The expanded desktop retained the sample state. Both the guided tour and a manual PDF drag completed the collection, close, window switch, reopen and delivery sequence. The delivered attachment remained visible in Mail. Escape returned to the website, both original screenshots loaded, and the browser reported no console errors or warnings. `pnpm check` passed all 19 tests, lint, types and the production build.
