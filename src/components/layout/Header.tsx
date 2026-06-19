'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { NAV_ITEMS, BOOK_MEETING_URL } from '@/lib/content';
import styles from './Header.module.css';

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // Lock page scroll while the mobile menu is open. The viewport scrolls on
  // the root <html> element, so lock there (locking <body> alone doesn't work).
  useEffect(() => {
    if (!menuOpen) return;
    const root = document.documentElement;
    const prev = root.style.overflow;
    root.style.overflow = 'hidden';
    return () => {
      root.style.overflow = prev;
    };
  }, [menuOpen]);

  // Close menu on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href.split('#')[0]) && href.split('#')[0] !== '/';
  };

  return (
    <>
    <header
      className={`${styles.header} ${scrolled ? styles.scrolled : ''} ${menuOpen ? styles.menuOpen : ''}`}
      role="banner"
    >
      <div className={styles.inner}>
        {/* Logo */}
        <Link href="/" className={styles.logo} aria-label="Khanstruct home">
          <Image
            src="/khanstruct-logo.png"
            alt="Khanstruct"
            width={1301}
            height={344}
            className={styles.logoImg}
            priority
          />
        </Link>

        {/* Desktop Nav */}
        <nav className={styles.nav} aria-label="Primary navigation">
          <ul className={styles.navList} role="list">
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`${styles.navLink} ${isActive(item.href) ? styles.navLinkActive : ''}`}
                  {...(item.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* CTAs */}
        <div className={styles.actions}>
          <a
            href={BOOK_MEETING_URL}
            className={styles.book}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span>Book a Meeting</span>
            <span aria-hidden="true">↗</span>
          </a>
          <Link href="/#contact" className={styles.cta}>
            <span>Work With Me</span>
            <span aria-hidden="true">→</span>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className={styles.menuBtn}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        >
          <span className={`${styles.menuIcon} ${menuOpen ? styles.menuIconOpen : ''}`}>
            <span />
            <span />
            <span />
          </span>
        </button>
      </div>
    </header>

      {/* Mobile Menu — rendered OUTSIDE <header> so the header's backdrop-filter
          (which would otherwise become the containing block for this fixed
          element once scrolled) can't break its full-screen coverage. */}
      <div
        id="mobile-menu"
        ref={menuRef}
        className={`${styles.mobileMenu} ${menuOpen ? styles.mobileMenuOpen : ''}`}
        aria-hidden={!menuOpen}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
      >
        <nav aria-label="Mobile navigation">
          <ul className={styles.mobileNavList} role="list">
            {NAV_ITEMS.map((item, i) => (
              <li
                key={item.href}
                style={{ transitionDelay: menuOpen ? `${i * 50}ms` : '0ms' }}
                className={styles.mobileNavItem}
              >
                <Link
                  href={item.href}
                  className={styles.mobileNavLink}
                  onClick={() => setMenuOpen(false)}
                >
                  <span className={styles.mobileNavNum}>0{i + 1}</span>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className={styles.mobileCta}>
            <Link href="/#contact" className="btn-primary" onClick={() => setMenuOpen(false)}>
              <span>Work With Me</span>
              <span aria-hidden="true">→</span>
            </Link>
            <a
              href={BOOK_MEETING_URL}
              className="btn-outline"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMenuOpen(false)}
            >
              <span>Book a Meeting</span>
              <span aria-hidden="true">↗</span>
            </a>
          </div>
        </nav>
      </div>
    </>
  );
}
