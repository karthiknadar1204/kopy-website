import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { Icon } from "@/components/icon";
import { documentAt, features } from "@/lib/content";
import { absolute, site } from "@/lib/site";

const document = documentAt("/");
export const metadata: Metadata = {
  title: { absolute: document?.title ?? "Kopy for Mac" },
  description: document?.description,
  alternates: { canonical: "/", types: { "text/markdown": "/index.md" } },
  openGraph: { title: "Kopy — Everything between apps", url: "/" },
};

export default function Home() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Kopy",
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "macOS 14 or later",
    description: document?.description,
    url: absolute("/"),
    image: absolute("/images/kopy-history-light.png"),
  };
  return (
    <main id="main">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema).replace(/</g, "\\u003c"),
        }}
      />
      <section className="hero wrap">
        <div className="hero-copy">
          <div className="availability">
            <span />A native Mac app. Coming soon.
          </div>
          <h1>
            Everything between apps.
            <br />
            Right at your edge.
          </h1>
          <p className="hero-description">
            The text you copied. The screenshot you need. The files going
            somewhere else. Give them a little shelf of their own.
          </p>
          <div className="hero-actions">
            <Link className="button button-primary" href="/buy">
              Get Kopy <span>{site.price}</span>
            </Link>
            <a className="button button-secondary" href="#see-kopy">
              See the shelf
            </a>
          </div>
          <p className="hero-note">
            Planned one-time purchase. No account. No subscription.
          </p>
        </div>
        <div className="hero-side">
          <span className="edge-line" />
          <p>
            Copy something.
            <br />
            Keep it close.
            <br />
            Carry on.
          </p>
          <div
            className="shortcut"
            aria-label="Default shortcut Control Option V"
          >
            <kbd>⌃</kbd>
            <kbd>⌥</kbd>
            <kbd>V</kbd>
          </div>
          <span className="shortcut-caption">
            Your shelf, one shortcut away.
          </span>
        </div>
      </section>
      <section
        className="product-preview wrap"
        id="see-kopy"
        aria-label="Kopy interface preview"
      >
        <div className="preview-chrome">
          <div className="window-dots" aria-hidden="true">
            <i />
            <i />
            <i />
          </div>
          <span>A closer look at Kopy</span>
          <span>macOS</span>
        </div>
        <Image
          src="/images/kopy-history-light.png"
          alt="Kopy’s light clipboard shelf showing pinned text, a link, a colour and a two-item stack beside its welcome tour. All content is a fixture."
          width={2560}
          height={1600}
          priority
          sizes="(max-width: 1200px) 100vw, 1160px"
        />
        <p className="image-caption">
          Actual Kopy views, rendered with sample content. Your clipboard stays
          yours.
        </p>
      </section>
      <section className="features wrap section-space" id="features">
        <div className="section-intro">
          <p className="section-number">A place to put it</p>
          <h2>
            Less hunting.
            <br />
            More getting on with it.
          </h2>
          <p>
            Kopy sits at the edge of your screen, ready for the small handoffs
            that fill your day.
          </p>
        </div>
        <div className="feature-list">
          {features.map((feature) => (
            <article className="feature" key={feature.title}>
              <div className="feature-icon">
                <Icon name={feature.symbol} />
              </div>
              <div>
                <h3>{feature.title}</h3>
                <p>{feature.text}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
      <section className="workflow-section">
        <div className="wrap workflow">
          <div className="workflow-copy">
            <p className="section-number">A simple handoff</p>
            <h2>
              Set it down.
              <br />
              Pick it up elsewhere.
            </h2>
            <ol>
              <li>
                <strong>Bring it to the edge.</strong>
                <span>Drop a Finder file or image onto the shelf.</span>
              </li>
              <li>
                <strong>Find your next window.</strong>
                <span>Your shelf stays within reach as you switch apps.</span>
              </li>
              <li>
                <strong>Take it with you.</strong>
                <span>
                  Drag files and images out, or copy and paste saved text.
                </span>
              </li>
            </ol>
            <Link
              className="text-link"
              href="/guides/move-files-between-mac-apps"
            >
              Read the file shelf guide
            </Link>
          </div>
          <div className="detail-preview">
            <Image
              src="/images/kopy-preview-dark.png"
              alt="Kopy’s dark preview and file stack interface, rendered with sample files."
              width={2560}
              height={1600}
              sizes="(max-width: 800px) 100vw, 650px"
            />
            <span className="detail-caption">
              Preview the details. Move just what you need.
            </span>
          </div>
        </div>
      </section>
      <section className="privacy-section wrap section-space">
        <div className="privacy-symbol">
          <Icon name="lock" size={34} />
        </div>
        <h2>
          Useful things.
          <br />
          Kept on your Mac.
        </h2>
        <p>
          Your clipboard history is encrypted locally. No cloud sync, no account
          to create, and no advertising SDK. Licence checks and the image
          downloads you request are explained in our privacy policy.
        </p>
        <Link className="text-link" href="/privacy">
          Read the privacy policy
        </Link>
      </section>
      <section className="faq wrap">
        <div>
          <p className="section-number">Before you get Kopy</p>
          <h2>A few useful details.</h2>
        </div>
        <div className="faq-items">
          <details>
            <summary>Can I download Kopy today?</summary>
            <p>
              Not yet. This is a prelaunch preview. Signing and final release
              checks are still pending. The test checkout is for integration
              testing, not a live purchase.
            </p>
          </details>
          <details>
            <summary>Is it a subscription?</summary>
            <p>
              No. The planned direct-download price is $2.99 USD, paid once,
              with applicable taxes shown at checkout. One active Mac,
              transferable by deactivating the old installation.
            </p>
          </details>
          <details>
            <summary>Do I need an account?</summary>
            <p>
              No. A direct purchase delivers a licence by email. Paste the key
              into the app to activate it. The Mac App Store version uses
              Apple’s purchase mechanism.
            </p>
          </details>
          <details>
            <summary>Can I drag saved text into another app?</summary>
            <p>
              Saved text uses copy and paste. File and image cards can be
              dragged to compatible destinations. The Store build copies a
              selected card for manual Command-V; the direct build also offers
              optional automatic paste.
            </p>
          </details>
          <details>
            <summary>What if I delete something by mistake?</summary>
            <p>
              Kopy keeps the last 20 manual delete or clear actions for Undo,
              including after relaunch. This is bounded recovery, not a backup
              service. Pins and notes protect items from automatic cleanup and
              bulk clearing.
            </p>
          </details>
        </div>
      </section>
      <section className="closing wrap">
        <Image src="/images/kopy-icon.png" alt="" width={64} height={64} />
        <div>
          <h2>A little more room to think.</h2>
          <p>Kopy for macOS 14 and later. No account required.</p>
        </div>
        <Link className="button button-primary" href="/buy">
          Explore the {site.price} purchase
        </Link>
      </section>
    </main>
  );
}
