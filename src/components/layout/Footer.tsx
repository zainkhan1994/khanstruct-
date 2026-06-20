import Link from 'next/link';
import Image from 'next/image';
import { NAV_ITEMS, CONTACT_LINKS } from '@/lib/content';
import { ContactButton } from '@/components/contact/ContactButton';
import styles from './Footer.module.css';

const SERVICES_LINKS = [
  { label: 'Design', href: '/#services' },
  { label: 'Data Management', href: '/#services' },
  { label: 'AI Implementation', href: '/#services' },
];

export function Footer() {
  return (
    <footer className={styles.footer} role="contentinfo">
      <div className={styles.glow} aria-hidden="true" />

      <div className={styles.inner}>
        <div className={styles.top}>
          {/* Brand */}
          <div className={styles.brand}>
            <Link href="/" className={styles.logo} aria-label="Khanstruct home">
              <Image
                src="/khanstruct-logo.png"
                alt="Khanstruct"
                width={1301}
                height={344}
                className={styles.logoImg}
              />
            </Link>
            <p className={styles.tagline}>
              Design, Data, AI Implementation.
              <br />
              Building digital solutions that matter.
            </p>
            <p className={styles.location}>Tulsa, Oklahoma</p>
          </div>

          {/* Navigation */}
          <nav aria-label="Footer navigation" className={styles.navCol}>
            <p className={styles.colHead}>Navigation</p>
            <ul className={styles.linkList} role="list">
              {NAV_ITEMS.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className={styles.link}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Services */}
          <nav aria-label="Services navigation" className={styles.navCol}>
            <p className={styles.colHead}>Services</p>
            <ul className={styles.linkList} role="list">
              {SERVICES_LINKS.map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className={styles.link}>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Connect */}
          <div className={styles.navCol}>
            <p className={styles.colHead}>Connect</p>
            <ul className={styles.linkList} role="list">
              {CONTACT_LINKS.slice(0, 3).map((item) => (
                <li key={item.label}>
                  <a
                    href={item.url}
                    className={styles.link}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
              <li>
                <ContactButton className={styles.link}>Email</ContactButton>
              </li>
            </ul>
          </div>
        </div>

        <div className={styles.bottom}>
          <p className={styles.copy}>
            © {new Date().getFullYear()} Khanstruct. All rights reserved.
          </p>
          <p className={styles.copy}>
            Tulsa, Oklahoma · Design · Data · AI
          </p>
        </div>
      </div>
    </footer>
  );
}
