"use client";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import { useState } from "react";
const links = [
  ["Home", "/#home"],
  ["Features", "/features"],
  ["How It Works", "/#how-it-works"],
  ["FAQs", "/#faqs"],
];
export function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <header
      className="site-header"
      onKeyDown={(e) => {
        if (e.key === "Escape") {
          setOpen(false);
          document.querySelector<HTMLButtonElement>(".menu-toggle")?.focus();
        }
      }}
    >
      <a className="site-skip" href="#main-content">
        Skip to content
      </a>
      <div className="site-width nav-inner">
        <Link href="/" className="wordmark" aria-label="Raastah home">
          <Image src="/icon.png" alt="" width={40} height={40} className="brand-logo" />
          Raastah

        </Link>
        <nav className="desktop-nav" aria-label="Main navigation">
          {links.map(([name, url]) => (
            <Link key={url} href={url}>
              {name}
            </Link>
          ))}
        </nav>
        <Link className="nav-download" href="https://play.google.com/store/apps/details?id=app.raastah">
          Get the app
        </Link>
        <button
          className="menu-toggle"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-navigation"
          onClick={() => setOpen(!open)}
        >
          {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>
      </div>
      {open && (
        <nav
          id="mobile-navigation"
          className="mobile-nav"
          aria-label="Mobile navigation"
        >
          {links.map(([name, url]) => (
            <Link key={url} href={url} onClick={() => setOpen(false)}>
              {name}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
