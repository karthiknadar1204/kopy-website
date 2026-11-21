import Image from "next/image";
import { comparison } from "@/lib/home";
import { Icon } from "./icon";
import styles from "./comparison-section.module.css";

export function ComparisonSection() {
  return (
    <section
      className={`${styles.section} wrap section-space`}
      id="compare"
      aria-labelledby="comparison-title"
    >
      <div className={styles.introduction}>
        <p className={styles.label}>{comparison.label}</p>
        <h2 id="comparison-title">{comparison.title}</h2>
        <p className={styles.description}>{comparison.introduction}</p>
      </div>

      <div className={styles.matrix}>
        <table role="table">
          <caption className="visually-hidden">
            Compare Spotlight Clipboard and Kopy for everyday Mac workflows
          </caption>
          <thead role="rowgroup">
            <tr role="row">
              <th scope="col" role="columnheader" className={styles.featureHeader}>
                What you want to do
              </th>
              <th scope="col" role="columnheader" className={styles.spotlightHeader}>
                <div className={styles.product}>
                  <span className={styles.spotlightIcon}>
                    <Icon name="search" size={25} />
                  </span>
                  <span>Spotlight Clipboard</span>
                </div>
                <p className={styles.productSummary}>{comparison.spotlightSummary}</p>
              </th>
              <th scope="col" role="columnheader" className={styles.kopyHeader}>
                <div className={styles.product}>
                  <Image src="/images/kopy-icon.png" alt="" width={44} height={44} />
                  <span>Kopy</span>
                </div>
                <p className={styles.productSummary}>{comparison.kopySummary}</p>
              </th>
            </tr>
          </thead>
          <tbody role="rowgroup">
            {comparison.rows.map((row) => (
              <tr key={row.task} role="row">
                <th scope="row" role="rowheader">{row.task}</th>
                <td role="cell" className={styles.spotlightCell}>
                  <span className={styles.mobileLabel} aria-hidden="true">Spotlight</span>
                  <span>{row.spotlight}</span>
                </td>
                <td role="cell" className={styles.kopyCell}>
                  <span className={styles.mobileLabel} aria-hidden="true">Kopy</span>
                  <div className={styles.capability}>
                    <svg aria-hidden="true" viewBox="0 0 20 20" width="20" height="20">
                      <circle cx="10" cy="10" r="10" fill="currentColor" opacity=".1" />
                      <path d="m5.8 10 2.7 2.7 5.7-5.7" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span>{row.kopy}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className={styles.takeaway}>
        <div>
          <h3>{comparison.takeawayTitle}</h3>
          <p>{comparison.conclusion}</p>
        </div>
        <a className="button button-secondary" href="#interactive-demo">
          Try the shelf
        </a>
      </div>
      <p className={styles.source}>
        {comparison.note}{" "}
        <a href={comparison.source.href}>{comparison.source.label}</a>.
      </p>
    </section>
  );
}
