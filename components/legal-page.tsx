import Link from "next/link";
import type { ReactNode } from "react";
import "./legal-page.css";

export default function LegalPage({ title, children, description, showContents = true }: { title: string; children: ReactNode; description?: string; showContents?: boolean }) {
  return (
    <main id="main-content" className="legal-page">
      <div className="site-width">
        <header className="legal-heading">
          <h1>{title}</h1>
          <p>{description ?? <>Last updated: <time dateTime="2026-09-27">September 27, 2026</time></>}</p>
        </header>
        <div className="legal-layout">
          <aside className="legal-sidebar">
            <nav aria-label="Legal documents">
              <p>Raastah legal</p>
              <Link href="/privacy-policy" aria-current={title === "Privacy Policy" ? "page" : undefined}>Privacy Policy</Link>
              <Link href="/terms-and-conditions" aria-current={title === "Terms and Conditions" ? "page" : undefined}>Terms and Conditions</Link>
              {showContents && <a className="legal-contents-link" href="#toc">Table of contents <span aria-hidden="true">↓</span></a>}
            </nav>
            <div className="legal-help">
              <p>Have a question?</p>
              <a href="mailto:info@raastah.app">info@raastah.app</a>
            </div>
          </aside>
          <article className="legal-copy" aria-label={title}>{children}</article>
        </div>
      </div>
    </main>
  );
}
