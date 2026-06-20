import type { Metadata } from 'next';
import { Space_Grotesk, Space_Mono } from 'next/font/google';
import './globals.css';
import { ExperienceProvider } from '@/components/canvas/ExperienceProvider';
import { CustomCursor } from '@/components/ui/CustomCursor';
import { SiteLoader } from '@/components/loader/SiteLoader';
import { ContactModal } from '@/components/contact/ContactModal';

// Runs before first paint: lock scroll synchronously so there is no flash or
// scroll jump before React hydrates the loader. The loader removes the class
// once it hands off to the page (and <noscript> below covers JS-disabled).
const NO_FLASH_SCRIPT = `try{document.documentElement.classList.add('loader-active')}catch(e){}`;

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
});

const spaceMono = Space_Mono({
  subsets: ['latin'],
  variable: '--font-space-mono',
  display: 'swap',
  weight: ['400', '700'],
});

export const metadata: Metadata = {
  title: {
    default: 'Khanstruct — Design. Data. AI Implementation.',
    template: '%s | Khanstruct',
  },
  description:
    'Khanstruct helps organizations design better experiences, manage data intelligently, and implement AI systems that drive real impact.',
  keywords: ['AI implementation', 'design systems', 'data management', 'Tulsa', 'Zain Khan'],
  authors: [{ name: 'Zain Khan' }],
  creator: 'Zain Khan',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'Khanstruct',
    title: 'Khanstruct — Design. Data. AI Implementation.',
    description:
      'Khanstruct helps organizations design better experiences, manage data intelligently, and implement AI that drives real impact.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Khanstruct — Design. Data. AI Implementation.',
    description:
      'Khanstruct helps organizations design better experiences, manage data intelligently, and implement AI that drives real impact.',
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${spaceMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="mask-icon" href="/favicon.svg" color="#d7ff3f" />
        <script dangerouslySetInnerHTML={{ __html: NO_FLASH_SCRIPT }} />
        <noscript>
          {/* Without JS the loader can't tear itself down — hide it and unlock. */}
          <style>{`#site-loader{display:none!important}html.loader-active{overflow:auto!important}`}</style>
        </noscript>
      </head>
      <body>
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <div className="grain" aria-hidden="true" />
        <CustomCursor />
        <SiteLoader />
        <ExperienceProvider>
          <div id="main-content" className="page-content" tabIndex={-1}>
            {children}
          </div>
        </ExperienceProvider>
        <ContactModal />
      </body>
    </html>
  );
}
