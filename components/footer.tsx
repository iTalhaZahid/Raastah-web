import Link from "next/link";
import Image from "next/image";
import PlayStoreLink from "./Home/PlayStoreLink";
export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-width">
        <div className="footer-grid">
          <div>
            <Link href="/" className="wordmark">
              <Image src="/icon.png" alt="" width={40} height={40} className="brand-logo" />
              Raastah
            </Link>
            <p>
              Your Campus. Your People.
              Your Raastah.
            </p>
          </div>
          <nav aria-label="Footer navigation">
            <h2>Explore</h2>
            <Link href="/#home">Home</Link>
            <Link href="/#how-it-works">How It Works</Link>
            <Link href="/#features">Features</Link>
            <Link href="/#faqs">FAQs</Link>
            <a href="mailto:info@raastah.app">Contact</a>
          </nav>
          <nav aria-label="Legal">
            <h2>The details</h2>
            <Link href="/privacy-policy">Privacy Policy</Link>
            <Link href="/terms-and-conditions">Terms &amp; Conditions</Link>
          </nav>
          <div>
            <h2>Get Raastah</h2>
            <PlayStoreLink />
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 Raastah. All rights reserved.</span>
          <span>A better commute starts with community.</span>
        </div>
      </div>
    </footer>
  );
}
