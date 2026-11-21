import { home, features, comparison } from "./home";
import { demoDisclosure } from "./demo";
export { features } from "./home";

export type ContentBlock =
  | { kind: "paragraph"; text: string }
  | { kind: "heading"; text: string }
  | { kind: "list"; items: string[] }
  | { kind: "steps"; items: string[] }
  | {
      kind: "links";
      links: { label: string; href: string; description: string }[];
    };

export type PublicDocument = {
  path: string;
  title: string;
  description: string;
  updated: string;
  category: "product" | "help" | "guide" | "legal";
  blocks: ContentBlock[];
};

const updated = "2026-11-21";
export const documents: PublicDocument[] = [
  {
    path: "/",
    title: "Kopy — Clipboard history and a file shelf for Mac",
    description:
      "Keep copied text, links, screenshots and files close. Kopy is a native Mac clipboard shelf with search, snippets and persistent Undo. One-time purchase planned at $2.99.",
    updated,
    category: "product",
    blocks: [
      { kind: "paragraph", text: home.availability },
      { kind: "paragraph", text: home.description },
      { kind: "paragraph", text: home.note },
      { kind: "heading", text: "Try the interactive demo" },
      {
        kind: "paragraph",
        text:
          "Explore Kopy’s shelf inside an interactive Mac desktop: search, filter, pin, preview, write snippets, or watch files move between Finder and Mail. " +
          demoDisclosure,
      },
      { kind: "heading", text: home.featuresTitle.join(" ") },
      { kind: "paragraph", text: home.featuresIntroduction },
      ...features.flatMap((feature): ContentBlock[] => [
        { kind: "heading", text: feature.title },
        { kind: "paragraph", text: feature.text },
      ]),
      { kind: "heading", text: home.workflowTitle.join(" ") },
      {
        kind: "steps",
        items: home.workflowSteps.map((step) => `${step.title} ${step.text}`),
      },
      { kind: "heading", text: comparison.title },
      { kind: "paragraph", text: comparison.introduction },
      ...comparison.rows.map((row): ContentBlock => ({
        kind: "paragraph",
        text: `${row.task}. Spotlight Clipboard: ${row.spotlight}. Kopy: ${row.kopy}.`,
      })),
      { kind: "paragraph", text: comparison.conclusion },
      { kind: "paragraph", text: comparison.note },
      {
        kind: "links",
        links: [
          {
            ...comparison.source,
            description: "Apple’s documented search, copy and clear workflow.",
          },
        ],
      },
      { kind: "heading", text: home.privacyTitle.join(" ") },
      { kind: "paragraph", text: home.privacy },
      { kind: "heading", text: home.faqTitle },
      ...home.faqs.flatMap((faq): ContentBlock[] => [
        { kind: "heading", text: faq.question },
        { kind: "paragraph", text: faq.answer },
      ]),
      { kind: "heading", text: home.closingTitle },
      { kind: "paragraph", text: home.closing },
      {
        kind: "links",
        links: [
          {
            label: "How to use clipboard history on Mac",
            href: "/guides/clipboard-history-on-mac",
            description: "Save, find and reuse copied items.",
          },
          {
            label: "Move files between Mac apps",
            href: "/guides/move-files-between-mac-apps",
            description:
              "Use a temporary file shelf and understand file references.",
          },
          {
            label: "Support",
            href: "/support",
            description: "Setup, permissions and troubleshooting.",
          },
          {
            label: "Privacy policy",
            href: "/privacy",
            description: "Storage, permissions, purchases and deletion.",
          },
        ],
      },
    ],
  },
  {
    path: "/privacy",
    title: "Kopy privacy policy",
    description:
      "How Kopy handles clipboard history, local storage, licences, website visits, permissions and deletion.",
    updated,
    category: "legal",
    blocks: [
      {
        kind: "paragraph",
        text: "Kopy is a clipboard history and file shelf for macOS, developed by Karthik Nadar. This policy covers the app and this prelaunch website. For privacy questions, email karthiknadar1204@gmail.com. Do not include clipboard contents or private files in a public issue.",
      },
      { kind: "heading", text: "Clipboard history and local storage" },
      {
        kind: "paragraph",
        text: "When you enable automatic capture, Kopy saves supported copied text, links, images and file references on this Mac, along with the notes, pins and preferences you choose. The Store build starts with capture paused. Manual imports and file drops are explicit actions and remain available while capture is paused.",
      },
      {
        kind: "paragraph",
        text: "History is stored in an encrypted local SQLite database. Its key is stored in the Mac’s Keychain. Preferences, recent emoji and file-transfer metadata are local. Original files remain in their original locations. Kopy may retain encrypted contents for supported files supplied by another app through a file promise.",
      },
      {
        kind: "paragraph",
        text: "Kopy skips clipboard formats marked concealed, transient or sensitive by their source app. This depends on those apps supplying the markers. Ordinary copied text can still contain passwords or private information; pause automatic capture before copying anything you do not want retained.",
      },
      { kind: "heading", text: "Network activity and purchases" },
      {
        kind: "paragraph",
        text: "Kopy has no customer account, cloud sync, analytics SDK or advertising SDK. Clipboard history and search are processed on your Mac. Dropping a supported image URL requests that image from its host, which receives the URL and normal connection information such as your IP address. That request uses an ephemeral session without cookies or stored credentials, rejects redirects and limits response size.",
      },
      {
        kind: "paragraph",
        text: "Direct-download activation sends the entered licence key and the generic installation name ‘Kopy on Mac’ to Dodo Payments. Validation and deactivation send the key and activation-instance identifier. Dodo also receives normal connection information such as your IP address. Credentials and the validation date are kept in a separate Keychain item. No clipboard contents, notes, searches or file contents accompany licence requests. A validated licence can work for up to 30 days during a connection failure; an explicit invalid or revoked result locks access. Successful deactivation removes licence credentials without deleting history or its encryption key. Current checkout testing uses Dodo’s test environment; live purchasing is not enabled. The Mac App Store build contains no Dodo activation or validation.",
      },
      {
        kind: "paragraph",
        text: "Opening a saved link or support page opens your browser. The Store build receives updates through the Mac App Store. The direct build can use Sparkle with a configured update host; that host receives normal connection metadata. Sparkle system profiling is disabled.",
      },
      { kind: "heading", text: "Retention, deletion and Undo" },
      {
        kind: "paragraph",
        text: "You can choose a history limit and automatic cleanup interval. Pinned items and items with notes are protected from automatic cleanup and bulk clearing; delete them individually when you want them removed. Kopy keeps the last 20 manual delete or clear actions for Undo across app launches and Mac restarts. Recovery records are encrypted in the same local database; restoring an action removes its recovery record, and newer actions replace the oldest after the limit.",
      },
      {
        kind: "paragraph",
        text: "Transfers can create readable temporary files for the destination app. Expired transfer sessions are cleaned after 24 hours when Kopy runs. A session still used by the current clipboard transfer remains until the clipboard changes and cleanup runs again. Exported Downloads files, copies in other apps and macOS backups must be managed separately. Deleting history is not a promise of forensic erasure from storage, snapshots or backups.",
      },
      { kind: "heading", text: "Permissions and choices" },
      {
        kind: "paragraph",
        text: "Automatic reading follows macOS clipboard permissions. The direct build offers optional automatic paste, which needs macOS event-posting permission. Without it, use manual Command-V. The Store build does not request Accessibility access. File access comes from files you choose, copy or drop; image exports use Downloads. Launch at login is optional.",
      },
      { kind: "heading", text: "This website" },
      {
        kind: "paragraph",
        text: "This site does not run client analytics, advertising, signup forms or a mailing list. The hosting provider processes normal request information, including IP addresses, for delivery and security. Following a Dodo checkout link opens Dodo’s site and its policies apply. Contacting support sends the information you choose to include to the support email provider. This site does not set account or analytics cookies.",
      },
      {
        kind: "paragraph",
        text: "We update this policy when data handling changes. Its updated date reflects a content revision, not each deployment. Purchase records may be retained by Dodo for its payment, accounting and legal obligations; contact support about purchase-data requests.",
      },
      {
        kind: "links",
        links: [
          {
            label: "Dodo Payments privacy policy",
            href: "https://dodopayments.com/privacy-policy",
            description: "Checkout, receipts and licence delivery.",
          },
          {
            label: "Vercel privacy policy",
            href: "https://vercel.com/legal/privacy-policy",
            description: "Website hosting and request processing.",
          },
        ],
      },
    ],
  },
  {
    path: "/support",
    title: "Kopy support",
    description:
      "Get help with Kopy’s clipboard history, licence activation, file shelf, permissions, filters and persistent Undo.",
    updated,
    category: "help",
    blocks: [
      {
        kind: "paragraph",
        text: "Need a hand? Email karthiknadar1204@gmail.com. Include your Kopy version, macOS version, whether you use the direct or Store build, and the steps that went wrong. Keep private clipboard contents, licence keys and file paths out of public reports.",
      },
      { kind: "heading", text: "Open the shelf" },
      {
        kind: "paragraph",
        text: "Move the pointer to the configured screen edge, choose Show Shelf from the menu bar, or use the shortcut shown in Settings. The default is Control-Option-V. Settings lets you choose the edge, display and shortcut.",
      },
      { kind: "heading", text: "Enable or pause capture" },
      {
        kind: "paragraph",
        text: "In Settings → Behavior, change Pause automatic capture. The Mac App Store build starts paused. Import clipboard and file drops still work while paused. If macOS blocks automatic capture, review the app’s clipboard permission in System Settings.",
      },
      { kind: "heading", text: "Paste text and drag files" },
      {
        kind: "paragraph",
        text: "Select a saved card, return to the destination and press Command-V. The direct build also offers Allow automatic paste under Settings → System. File and image cards can be dragged to compatible apps. Saved text uses copy/paste; it is not a draggable file. An original file must remain available and authorised. If it moved or was removed, drop it onto Kopy again.",
      },
      { kind: "heading", text: "Activate the direct download" },
      {
        kind: "paragraph",
        text: "Use the licence from your Dodo purchase email. Paste it into Kopy’s activation screen. The planned personal licence allows one active Mac; deactivate the old installation before moving to another Mac. Initial activation needs a connection. The proposed offline allowance is 30 days after a successful validation. Test-mode keys are only for the test build, and do not represent a live purchase.",
      },
      {
        kind: "paragraph",
        text: "If an activation fails, check that the full key was pasted, reconnect and try again. If you reached the installation allowance or lost the purchase email, contact support using the purchase email address. Do not post your key in a public issue. A licensing error does not delete clipboard history.",
      },
      { kind: "heading", text: "Undo a delete or clear" },
      {
        kind: "paragraph",
        text: "Click Undo in the recovery bar, use the history controls, or press Command-Z while the history area has focus. Kopy keeps the last 20 manual delete or clear actions across relaunches. Text fields keep their own typing Undo. Recovery does not replace the current clipboard or erase newer history.",
      },
      { kind: "heading", text: "Remove a time filter" },
      {
        kind: "paragraph",
        text: "Choose Show all time to remove a time filter. Clear shown history is a separate action with confirmation. Pins and notes protect items from bulk clearing, so delete protected items individually.",
      },
      {
        kind: "links",
        links: [
          {
            label: "Clipboard history guide",
            href: "/guides/clipboard-history-on-mac",
            description: "A practical first workflow.",
          },
          {
            label: "File shelf guide",
            href: "/guides/move-files-between-mac-apps",
            description: "Move files with fewer window switches.",
          },
          {
            label: "Report an issue",
            href: "https://github.com/karthiknadar1204/kopy/issues",
            description: "Public reports must not contain private content.",
          },
        ],
      },
    ],
  },
  {
    path: "/terms",
    title: "Kopy purchase and licence terms",
    description:
      "Prelaunch purchase information and proposed personal licence terms for Kopy’s direct Mac download.",
    updated,
    category: "legal",
    blocks: [
      {
        kind: "paragraph",
        text: "Kopy is currently in prelaunch testing. There is no public signed download or live payment offer on this website. Test checkout is explicitly labelled and does not grant a production licence. These terms describe the planned direct-download offer and will be reviewed before sales open.",
      },
      { kind: "heading", text: "One-time personal purchase" },
      {
        kind: "paragraph",
        text: "The planned base price is $2.99 USD for a non-expiring personal licence. Applicable taxes and currency adjustments will be shown at checkout. The proposed licence permits one active Mac at a time and can be moved by deactivating the old installation. It is not a subscription. We do not promise a fixed support lifetime, every future major upgrade or perpetual service availability.",
      },
      { kind: "heading", text: "Delivery and activation" },
      {
        kind: "paragraph",
        text: "Dodo Payments will process the direct purchase and deliver its receipt and licence by email. Downloading the installer does not itself grant a licence. Activation requires a connection; the proposed offline allowance is up to 30 days following successful validation. Do not share or resell your personal key. The Mac App Store version uses Apple’s purchase mechanism and does not require a Dodo key.",
      },
      { kind: "heading", text: "Refunds and support" },
      {
        kind: "paragraph",
        text: "For purchase, licence or refund questions, contact karthiknadar1204@gmail.com using the purchase email address. Any refund policy will be displayed with the live offer before purchasing begins. Nothing in these terms removes mandatory consumer rights. A completed refund can revoke the associated direct-download licence.",
      },
      { kind: "heading", text: "Your content and original files" },
      {
        kind: "paragraph",
        text: "Keep backups of important material. Kopy is a convenience shelf, not a backup service. File references depend on their original files remaining available and authorised. You retain responsibility for what you copy, store or transfer and for respecting the rights of others. Licence changes do not authorise us to delete your clipboard history.",
      },
      {
        kind: "links",
        links: [
          {
            label: "Privacy policy",
            href: "/privacy",
            description: "How app and website information is handled.",
          },
          {
            label: "Support",
            href: "/support",
            description: "Help with installation and day-to-day use.",
          },
        ],
      },
    ],
  },
  {
    path: "/changelog",
    title: "Kopy changelog",
    description:
      "Release status and preparation notes for Kopy, the native Mac clipboard and file shelf.",
    updated,
    category: "help",
    blocks: [
      { kind: "heading", text: "November 21, 2026 · Prelaunch preparation" },
      {
        kind: "paragraph",
        text: "The public website and Dodo test-mode licensing are being prepared. No production download or live payment has been released through this site. Apple signing, notarisation and submission remain pending.",
      },
      { kind: "heading", text: "Already in the app" },
      {
        kind: "list",
        items: [
          "Searchable clipboard history with kind and time filters, pins and notes.",
          "A file shelf with native drag in/out and stacks.",
          "Text snippets with editing in place.",
          "Persistent Undo for the last 20 manual delete or clear actions.",
          "Custom screen placement and shortcuts.",
          "Separate direct and sandboxed Store build paths.",
        ],
      },
      {
        kind: "paragraph",
        text: "Release notes will be added here when a distributable version is ready. The screenshots on this site use fixture content from the app’s Store screenshot renderer.",
      },
    ],
  },
  {
    path: "/guides",
    title: "Practical Mac guides",
    description:
      "Understand clipboard history and move files between apps with Kopy’s practical Mac workflow guides.",
    updated,
    category: "guide",
    blocks: [
      {
        kind: "paragraph",
        text: "Small workflows for the things between tasks. These guides explain what Kopy does, where macOS permissions matter and what stays on your Mac.",
      },
      {
        kind: "links",
        links: [
          {
            label: "How to use clipboard history on Mac",
            href: "/guides/clipboard-history-on-mac",
            description: "Save, find and reuse copied text, links and images.",
          },
          {
            label: "Move files between Mac apps with a shelf",
            href: "/guides/move-files-between-mac-apps",
            description:
              "Collect a file or a stack, then drag it into the next app.",
          },
        ],
      },
    ],
  },
  {
    path: "/guides/clipboard-history-on-mac",
    title: "How to use clipboard history on Mac with Kopy",
    description:
      "A practical guide to saving copied items, searching them, reusing text and recovering deleted history in Kopy for Mac.",
    updated,
    category: "guide",
    blocks: [
      {
        kind: "paragraph",
        text: "Kopy keeps a searchable local history of supported copied items after you enable capture. You can return to an earlier piece of text, link or image without copying it from the original app again. It cannot recover clipboard content from before it was running and authorised to capture it.",
      },
      { kind: "heading", text: "Check the built-in option first" },
      {
        kind: "paragraph",
        text: "On macOS Tahoe 26 and later, Spotlight offers clipboard history. Apple explains how to enable and search it in the guides linked below. Kopy offers a different workflow: an edge shelf alongside file stacks, editable snippets, notes and persistent manual-delete Undo. If Spotlight already covers your needs, you may not need another utility.",
      },
      { kind: "heading", text: "Save and reuse a copied item" },
      {
        kind: "steps",
        items: [
          "Open Kopy and enable clipboard history. In the Store build it starts paused; use the empty-state action or Settings → Behavior.",
          "Copy harmless example text in another app. Avoid passwords and sensitive content while learning the workflow.",
          "Open the shelf using the configured edge, the menu bar or Control-Option-V.",
          "Search a few words from the copied text. Use Text, Links or another kind filter to narrow the result.",
          "Select the card. Return to your destination and press Command-V. Optional automatic paste is available in the direct build after you grant the relevant macOS permission.",
        ],
      },
      { kind: "heading", text: "Keep useful items close" },
      {
        kind: "paragraph",
        text: "Pin a frequently used item or add a note to make it easier to recognise. Pins and notes protect items from automatic cleanup and bulk clearing. In Text, you can also write a snippet directly and edit that saved snippet without creating a duplicate.",
      },
      { kind: "heading", text: "Filter without losing history" },
      {
        kind: "paragraph",
        text: "The history controls can show the last hour, six hours or 24 hours. A filter changes what is visible; it does not delete other items. Choose Show all time to remove it. Clear shown history is a separate action with a confirmation.",
      },
      { kind: "heading", text: "Recover an accidental delete" },
      {
        kind: "paragraph",
        text: "Use Undo in the recovery bar or history controls. The last 20 manual delete or clear actions survive quitting and reopening Kopy. This is a bounded recovery history, not a backup of everything you ever copied. An item removed by automatic cleanup is not the same as a manual delete action.",
      },
      { kind: "heading", text: "Keep sensitive copying out" },
      {
        kind: "paragraph",
        text: "Pause automatic capture before copying material you do not want saved. Kopy recognises some source-app sensitivity markers, but ordinary copied text can still contain secrets. History stays encrypted locally; readable temporary transfer files and copies pasted into other apps have their own lifecycles.",
      },
      {
        kind: "links",
        links: [
          {
            label: "Apple: Search your clipboard history",
            href: "https://support.apple.com/guide/mac-help/search-your-clipboard-history-mchl40d5b86b/mac",
            description:
              "The built-in Spotlight workflow on supported macOS releases.",
          },
          {
            label: "Kopy support",
            href: "/support",
            description: "Permissions and troubleshooting.",
          },
          {
            label: "Privacy policy",
            href: "/privacy",
            description: "Retention and deletion details.",
          },
          {
            label: "Explore Kopy",
            href: "/",
            description: "See the clipboard and file shelf.",
          },
        ],
      },
    ],
  },
  {
    path: "/guides/move-files-between-mac-apps",
    title: "Move files between Mac apps with a temporary shelf",
    description:
      "Use Kopy to set down Finder files, group a stack and drag files or images into another Mac app without confusing them with text snippets.",
    updated,
    category: "guide",
    blocks: [
      {
        kind: "paragraph",
        text: "A temporary shelf gives you somewhere to put files while you move to the destination window. In Kopy, you can drop a file onto the shelf, change apps, and drag it out when you are ready. A file card usually references its original file; it is not a backup copy.",
      },
      { kind: "heading", text: "Carry a file to another app" },
      {
        kind: "steps",
        items: [
          "Choose a disposable file in Finder to practise. Start dragging it toward Kopy’s configured screen edge.",
          "Wait for the shelf to open, then release inside it. If you want to cancel the drag, press Escape while still holding it and then release.",
          "Move to the destination app and open Kopy from its edge or shortcut.",
          "Drag the file card into a destination that accepts that file type, such as a Finder folder or a compatible attachment area.",
        ],
      },
      { kind: "heading", text: "Group files into a stack" },
      {
        kind: "paragraph",
        text: "Drop file cards together to form a stack. Open the stack to inspect its members. Drag the stack grip to carry the group, or open its preview and select individual members for a smaller transfer. The destination app still decides which file types it accepts.",
      },
      { kind: "heading", text: "Images and text behave differently" },
      {
        kind: "paragraph",
        text: "File and image cards have native drag-out behaviour. Saved text, links and colour values use copy/paste. To reuse saved text in a chat composer, select its card and paste with Command-V rather than expecting a file attachment. A chat app may reject a file type even when Finder accepts it.",
      },
      { kind: "heading", text: "When an original file is missing" },
      {
        kind: "paragraph",
        text: "If the file moved, was deleted or is no longer authorised, Kopy may be unable to transfer its reference. Find the current file in Finder and drop it onto the shelf again. Supported files supplied as promises by another app can have encrypted retained contents; this differs from an ordinary original-file reference.",
      },
      { kind: "heading", text: "After the transfer" },
      {
        kind: "paragraph",
        text: "Kopy can stage a readable temporary file when a destination needs one. Expired staging sessions are cleaned when Kopy runs. Files you export to Downloads or copy into another app remain there until managed in that destination. Undo in Kopy does not reverse a transfer performed by another app.",
      },
      {
        kind: "links",
        links: [
          {
            label: "Clipboard history guide",
            href: "/guides/clipboard-history-on-mac",
            description: "Save and reuse text.",
          },
          {
            label: "Support",
            href: "/support",
            description: "Report a reproducible transfer issue.",
          },
          {
            label: "Explore Kopy",
            href: "/",
            description: "See the native shelf.",
          },
        ],
      },
    ],
  },
];

export function documentAt(path: string): PublicDocument | undefined {
  return documents.find((document) => document.path === path);
}

export function markdownPath(path: string): string {
  return path === "/" ? "/index.md" : `${path}.md`;
}

export function documentMarkdown(
  document: PublicDocument,
  origin: URL,
): string {
  const url = new URL(document.path, origin).href;
  const body = document.blocks
    .map((block) => {
      switch (block.kind) {
        case "paragraph":
          return block.text;
        case "heading":
          return `## ${block.text}`;
        case "list":
          return block.items.map((item) => `- ${item}`).join("\n");
        case "steps":
          return block.items
            .map((item, index) => `${index + 1}. ${item}`)
            .join("\n");
        case "links":
          return block.links
            .map(
              (link) =>
                `- [${link.label}](${new URL(link.href, origin).href}): ${link.description}`,
            )
            .join("\n");
        default: {
          const exhaustive: never = block;
          return exhaustive;
        }
      }
    })
    .join("\n\n");
  return `# ${document.title}\n\n> ${document.description}\n\nCanonical: ${url}\nLast updated: ${document.updated}\n\n${body}\n`;
}
