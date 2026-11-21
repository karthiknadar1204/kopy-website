import Link from "next/link";
import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Check your Dodo receipt | Kopy",
  description:
    "Return from Kopy’s Dodo test checkout. Check the payment receipt and licence email for the actual result.",
  robots: { index: false, follow: false },
};
export default function PurchaseComplete() {
  return (
    <main id="main" className="article wrap">
      <div className="article-heading">
        <p className="availability">
          <span />
          Test checkout return
        </p>
        <h1>
          Check your receipt.
          <br />
          Your key comes by email.
        </h1>
        <p className="article-description">
          This page does not confirm a payment or unlock Kopy. Dodo’s payment
          record and licence delivery determine the result.
        </p>
      </div>
      <div className="prose">
        <h2>If your test payment completed</h2>
        <p>
          Look for the receipt and licence email from Dodo Payments, including
          your spam folder. Use the key only with the matching Kopy test build.
        </p>
        <h2>If you cancelled, or the payment failed</h2>
        <p>
          No licence is granted by returning here. Check the status shown by
          Dodo before attempting another payment.
        </p>
        <h2>Need help?</h2>
        <p>
          Contact support using the purchase email address. Do not include your
          full licence key or private clipboard contents in a public report.
        </p>
        <div className="related-links">
          <Link href="/support">
            <strong>Get activation help</strong>
            <span>Permissions, licences and troubleshooting.</span>
          </Link>
          <Link href="/">
            <strong>Back to Kopy</strong>
            <span>Explore the clipboard and file shelf.</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
