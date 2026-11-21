export const home = {
  availability: "A native Mac app. Coming soon.",
  title: ["Everything between apps.", "Right at your edge."],
  description:
    "The text you copied. The screenshot you need. The files going somewhere else. Give them a little shelf of their own.",
  note: "Planned one-time purchase. No account. No subscription.",
  aside: ["Copy something.", "Keep it close.", "Carry on."],
  shortcutCaption: "Your shelf, one shortcut away.",
  previewTitle: "A closer look at Kopy",
  previewCaption:
    "Actual Kopy views, rendered with sample content. Your clipboard stays yours.",
  featuresLabel: "A place to put it",
  featuresTitle: ["Less hunting.", "More getting on with it."],
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
    title: "Find the thing you copied.",
    text: "Search saved text, links, images and file references. Filter by kind or time, and keep useful items pinned.",
    symbol: "search",
  },
  {
    title: "Set files down for a moment.",
    text: "Drop files onto the edge shelf, group them into a stack, then drag them into the next app.",
    symbol: "shelf",
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
