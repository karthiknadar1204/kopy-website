import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { Icon } from "@/components/icon";
import { HeroDemo } from "@/components/hero-demo";
import { documentAt, features } from "@/lib/content";
import { home, comparison } from "@/lib/home";
import { absolute, site } from "@/lib/site";

const document = documentAt("/");
export const metadata: Metadata = {
  title: { absolute: document?.title ?? "Kopy for Mac" },
  description: document?.description,
  alternates: { canonical: "/", types: { "text/markdown": "/index.md" } },
  openGraph: { title: "Kopy — A little shelf for your Mac", url: "/" },
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
          <p className="availability">{home.availability}</p>
          <h1>
            {home.title[0]}
            <br />
            {home.title[1]}
          </h1>
          <p className="hero-description">{home.description}</p>
          <div className="hero-actions">
            <Link className="button button-primary" href="/buy">
              Explore Kopy <span>{site.price}</span>
            </Link>
            <a className="button button-secondary" href="#see-kopy">
              See the real app
            </a>
          </div>
          <p className="hero-note">{home.note}</p>
          <div className="hero-shortcut">
            <div
              className="shortcut"
              aria-label="Default shortcut Control Option V"
            >
              <kbd>⌃</kbd>
              <kbd>⌥</kbd>
              <kbd>V</kbd>
            </div>
            <span>{home.shortcutCaption}</span>
          </div>
        </div>
        <HeroDemo />
      </section>

      <section className="features wrap section-space" id="features">
        <div className="section-intro">
          <div>
            <p className="section-label">{home.featuresLabel}</p>
            <h2>
              {home.featuresTitle[0]}
              <br />
              {home.featuresTitle[1]}
            </h2>
          </div>
          <p>{home.featuresIntroduction}</p>
        </div>
        <div className="feature-list">
          {features.map((feature) => (
            <article className="feature" key={feature.title}>
              <div className="feature-icon">
                <Icon name={feature.symbol} />
              </div>
              <h3>{feature.title}</h3>
              <p>{feature.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="workflow-section wrap" id="see-kopy">
        <div className="workflow">
          <div className="workflow-copy">
            <p className="section-label">{home.workflowLabel}</p>
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
          <figure className="detail-preview">
            <Image
              src="/images/kopy-preview-dark.png"
              alt="Kopy’s dark preview and file stack interface, rendered with sample files."
              width={2560}
              height={1600}
              sizes="(max-width: 800px) 100vw, 750px"
            />
            <figcaption>{home.detailCaption}</figcaption>
          </figure>
        </div>
        <details className="full-view">
          <summary>See the full light interface</summary>
          <Image
            src="/images/kopy-history-light.png"
            alt="The full light interface showing Kopy’s shelf and welcome tour with sample content."
            width={2560}
            height={1600}
            sizes="(max-width: 1200px) 100vw, 1160px"
          />
        </details>
      </section>

      <section
        className="comparison wrap section-space"
        id="compare"
        aria-labelledby="comparison-title"
      >
        <div className="comparison-intro">
          <p className="section-label">{comparison.label}</p>
          <h2 id="comparison-title">{comparison.title}</h2>
          <p>{comparison.introduction}</p>
        </div>
        <table className="comparison-table">
          <caption className="visually-hidden">
            A workflow comparison of Spotlight Clipboard and Kopy
          </caption>
          <thead>
            <tr>
              <th scope="col">What you want to do</th>
              <th scope="col">
                <span className="comparison-product">
                  <Icon name="search" size={18} />
                  Spotlight Clipboard
                </span>
              </th>
              <th scope="col">
                <span className="comparison-product">
                  <Image
                    src="/images/kopy-icon.png"
                    alt=""
                    width={24}
                    height={24}
                  />
                  Kopy
                </span>
              </th>
            </tr>
          </thead>
          <tbody>
            {comparison.rows.map((row) => (
              <tr key={row.task}>
                <th scope="row">{row.task}</th>
                <td>{row.spotlight}</td>
                <td>{row.kopy}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="comparison-bottom">
          <p className="comparison-conclusion">{comparison.conclusion}</p>
          <p className="comparison-note">
            {comparison.note}{" "}
            <a href={comparison.source.href}>{comparison.source.label}</a>.
          </p>
        </div>
      </section>

      <section className="privacy-section wrap">
        <div className="privacy-symbol">
          <Icon name="lock" size={30} />
        </div>
        <div>
          <h2>{home.privacyTitle.join(" ")}</h2>
          <p>{home.privacy}</p>
          <Link className="text-link" href="/privacy">
            Read the privacy policy
          </Link>
        </div>
      </section>

      <section className="faq wrap section-space">
        <div>
          <p className="section-label">{home.faqLabel}</p>
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
        <div className="closing-brand">
          <Image src="/images/kopy-icon.png" alt="" width={64} height={64} />
          <span>Kopy for Mac</span>
        </div>
        <h2>{home.closingTitle}</h2>
        <p>{home.closing}</p>
        <Link className="button button-primary" href="/buy">
          Explore Kopy <span>{site.price}</span>
        </Link>
        <span className="closing-note">
          Planned one-time purchase. Coming soon.
        </span>
      </section>
    </main>
  );
}
