import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { Icon } from "@/components/icon";
import { documentAt, features } from "@/lib/content";
import { home } from "@/lib/home";
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
    <main id="main" tabIndex={-1}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema).replace(/</g, "\\u003c"),
        }}
      />
      <section className="hero wrap">
        <div className="hero-copy">
          <div className="availability">
            <span />
            {home.availability}
          </div>
          <h1>
            {home.title[0]}
            <br />
            {home.title[1]}
          </h1>
          <p className="hero-description">{home.description}</p>
          <div className="hero-actions">
            <Link className="button button-primary" href="/buy">
              Get Kopy <span>{site.price}</span>
            </Link>
            <a className="button button-secondary" href="#see-kopy">
              See the shelf
            </a>
          </div>
          <p className="hero-note">{home.note}</p>
        </div>
        <div className="hero-side">
          <span className="edge-line" />
          <p>
            {home.aside[0]}
            <br />
            {home.aside[1]}
            <br />
            {home.aside[2]}
          </p>
          <div
            className="shortcut"
            aria-label="Default shortcut Control Option V"
          >
            <kbd>⌃</kbd>
            <kbd>⌥</kbd>
            <kbd>V</kbd>
          </div>
          <span className="shortcut-caption">{home.shortcutCaption}</span>
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
          <span>{home.previewTitle}</span>
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
        <p className="image-caption">{home.previewCaption}</p>
      </section>
      <section className="features wrap section-space" id="features">
        <div className="section-intro">
          <p className="section-number">{home.featuresLabel}</p>
          <h2>
            {home.featuresTitle[0]}
            <br />
            {home.featuresTitle[1]}
          </h2>
          <p>{home.featuresIntroduction}</p>
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
            <p className="section-number">{home.workflowLabel}</p>
            <h2>
              {home.workflowTitle[0]}
              <br />
              {home.workflowTitle[1]}
            </h2>
            <ol>
              {home.workflowSteps.map((step) => (
                <li key={step.title}>
                  <strong>{step.title}</strong>
                  <span>{step.text}</span>
                </li>
              ))}
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
            <span className="detail-caption">{home.detailCaption}</span>
          </div>
        </div>
      </section>
      <section className="privacy-section wrap section-space">
        <div className="privacy-symbol">
          <Icon name="lock" size={34} />
        </div>
        <h2>
          {home.privacyTitle[0]}
          <br />
          {home.privacyTitle[1]}
        </h2>
        <p>{home.privacy}</p>
        <Link className="text-link" href="/privacy">
          Read the privacy policy
        </Link>
      </section>
      <section className="faq wrap">
        <div>
          <p className="section-number">{home.faqLabel}</p>
          <h2>{home.faqTitle}</h2>
        </div>
        <div className="faq-items">
          {home.faqs.map((faq) => (
            <details key={faq.question}>
              <summary>{faq.question}</summary>
              <p>{faq.answer}</p>
            </details>
          ))}
        </div>
      </section>
      <section className="closing wrap">
        <Image src="/images/kopy-icon.png" alt="" width={64} height={64} />
        <div>
          <h2>{home.closingTitle}</h2>
          <p>{home.closing}</p>
        </div>
        <Link className="button button-primary" href="/buy">
          Explore the {site.price} purchase
        </Link>
      </section>
    </main>
  );
}
