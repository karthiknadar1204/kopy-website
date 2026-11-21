export const home = {
  availability: "Made for Mac. Coming soon.",
  title: ["Keep it close.", "Keep going."],
  description:
    "The file for your next window. The words you use every day. Kopy keeps your useful things on a little shelf at the edge of your Mac.",
  note: "Planned one-time purchase. No account. No subscription.",
  shortcutCaption: "Your shelf, one shortcut away.",
  featuresLabel: "The little things, handled",
  featuresTitle: ["A place for everything", "between apps."],
  featuresIntroduction:
    "Kopy sits at the edge of your screen, ready for the small handoffs that fill your day.",
  workflowLabel: "A simple handoff",
  workflowTitle: ["Set it down.", "Pick it up elsewhere."],
  workflowSteps: [
    {
      title: "Bring it to the edge.",
      text: "Drop a Finder file or image onto the shelf.",
    },
    {
      title: "Find your next window.",
      text: "Your shelf stays within reach as you switch apps.",
    },
    {
      title: "Take it with you.",
      text: "Drag files and images out, or copy and paste saved text.",
    },
  ],
  detailCaption: "Preview the details. Move just what you need.",
  privacyTitle: ["Useful things.", "Kept on your Mac."],
  privacy:
    "Your clipboard history is encrypted locally. No cloud sync, no account to create, and no advertising SDK. Licence checks and the image downloads you request are explained in our privacy policy.",
  faqLabel: "Before you get Kopy",
  faqTitle: "A few useful details.",
  faqs: [
    {
      question: "Can I download Kopy today?",
      answer:
        "Not yet. This is a prelaunch preview. Signing and final release checks are still pending. The test checkout is for integration testing, not a live purchase.",
    },
    {
      question: "Is it a subscription?",
      answer:
        "No. The planned direct-download price is $2.99 USD, paid once, with applicable taxes shown at checkout. One active Mac, transferable by deactivating the old installation.",
    },
    {
      question: "Do I need an account?",
      answer:
        "No. A direct purchase delivers a licence by email. Paste the key into the app to activate it. The Mac App Store version uses Apple’s purchase mechanism.",
    },
    {
      question: "Can I drag saved text into another app?",
      answer:
        "Saved text uses copy and paste. File and image cards can be dragged to compatible destinations. The Store build copies a selected card for manual Command-V; the direct build also offers optional automatic paste.",
    },
    {
      question: "What if I delete something by mistake?",
      answer:
        "Kopy keeps the last 20 manual delete or clear actions for Undo, including after relaunch. This is bounded recovery, not a backup service. Pins and notes protect items from automatic cleanup and bulk clearing.",
    },
  ],
  closingTitle: "A little more room to think.",
  closing: "Kopy for macOS 14 and later. No account required.",
};

export const features = [
  {
    title: "Set files down for a moment.",
    text: "Drop files onto the edge shelf, group them into a stack, then drag them into the next app.",
    symbol: "shelf",
  },
  {
    title: "Find the thing you copied.",
    text: "Search saved text, links, images and file references. Filter by kind or time, and keep useful items pinned.",
    symbol: "search",
  },
  {
    title: "Keep the words you reuse.",
    text: "Write and edit text snippets, add a note, and find them again without hunting through documents.",
    symbol: "text",
  },
  {
    title: "An undo you can come back to.",
    text: "Recover the last 20 manual delete or clear actions, even after quitting Kopy and restarting your Mac.",
    symbol: "undo",
  },
];

export const comparison = {
  label: "Kopy vs. Spotlight Clipboard",
  title: "Why Kopy if your Mac has clipboard history?",
  introduction:
    "Spotlight gives you a history of what you copied. Kopy gives you a shelf for what you’re working on: files to move, snippets to reuse and useful items to keep close.",
  spotlightSummary: "Find something you copied.",
  kopySummary: "Collect, organise and reuse it.",
  rows: [
    {
      task: "Find a recent copy",
      spotlight: "Search recent copies",
      kopy: "Search history by content, kind or time",
    },
    {
      task: "Move files between apps",
      spotlight: "Copy and paste",
      kopy: "Collect files on the edge, group into stacks and drag into the next app",
    },
    {
      task: "Reuse your words",
      spotlight: "Copy a previous item",
      kopy: "Create, edit and pin reusable text snippets",
    },
    {
      task: "Keep things organised",
      spotlight: "Search the history",
      kopy: "Pin important items, add notes and group files",
    },
    {
      task: "Recover a manual clear",
      spotlight: "No restore action documented",
      kopy: "Undo the last 20 delete or clear actions, even after restart",
    },
    {
      task: "Price and macOS",
      spotlight: "Included with macOS 26 and later",
      kopy: "macOS 14 and later. Planned $2.99, once.",
    },
  ],
  note: "Comparing Spotlight’s Clipboard view with Kopy’s current build, checked November 21, 2026. Apple’s column follows its published Clipboard guide; undocumented controls are not claims about every macOS app. Kopy’s recovery is bounded, and file references still depend on their originals.",
  conclusion:
    "Build a stack of files for an email. Pin a reply you use every day. Switch windows without gathering everything again.",
  takeawayTitle: "Make the next handoff easier.",
  source: {
    label: "Apple’s Clipboard guide",
    href: "https://support.apple.com/guide/mac-help/mchl40d5b86b/mac",
  },
};
