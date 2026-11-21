import Image from "next/image";
import Link from "next/link";
import { site } from "@/lib/site";
import { MobileNavigation } from "./mobile-navigation";

const navigation = [
  { label: "Features", href: "/#features" },
  { label: "Compare", href: "/#compare" },
  { label: "Guides", href: "/guides" },
  { label: "Support", href: "/support" },
];

export function Header() {
  return (
    <header className="site-header wrap">
      <Link href="/#main" className="wordmark" aria-label="Kopy home">
        <Image src="/images/kopy-icon.png" alt="" width={35} height={35} />
        Kopy
      </Link>
      <nav aria-label="Main navigation">
        {navigation.map((link) => (
          <Link
            className={
              link.href === "/#compare" ? "nav-compare" : "nav-secondary"
            }
            key={link.href}
            href={link.href}
          >
            {link.label}
          </Link>
        ))}
        <MobileNavigation links={navigation} />
        <Link className="nav-buy" href="/buy">
          Get Kopy
        </Link>
      </nav>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="site-footer wrap">
      <div>
        <Link className="wordmark footer-mark" href="/#main">
          <Image src="/images/kopy-icon.png" alt="" width={28} height={28} />
          Kopy
        </Link>
        <p>A little shelf for everything between apps.</p>
        <p className="small">Made for macOS 14 and later.</p>
      </div>
      <div className="footer-links">
        <Link href="/privacy">Privacy</Link>
        <Link href="/terms">Terms</Link>
        <Link href="/support">Support</Link>
        <Link href="/changelog">Changelog</Link>
        <Link href="/llms.txt">Markdown index</Link>
        <a href={`mailto:${site.supportEmail}`}>Contact</a>
      </div>
      <p className="footer-bottom">
        © 2026 Karthik Nadar. Kopy is not affiliated with Apple. Prelaunch
        preview; live sales are not open.
      </p>
    </footer>
  );
}
