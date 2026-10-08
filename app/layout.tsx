import type { Metadata, Viewport } from 'next';
import { Cormorant_Garamond, Hanken_Grotesk } from 'next/font/google';
import { ViewTransition, type ReactNode } from 'react';
import { Footer } from '@/components/Footer';
import { Glide } from '@/components/Glide';
import { Masthead } from '@/components/Masthead';
import { Start } from '@/components/Start';
import { Toasts } from '@/components/Toasts';
import { AUTHOR, DESCRIPTION, SITE } from '@/lib/site';
import './globals.css';

/* Two families. Cormorant is a Garamond drawn for large sizes, and sets every
   heading; Hanken Grotesk is the plain voice for everything that is read or
   pressed. */
const serif = Cormorant_Garamond({ subsets: ['latin', 'latin-ext'], weight: ['400', '500', '600'], style: ['normal'], variable: '--font-cormorant', display: 'swap' });
const sans = Hanken_Grotesk({ subsets: ['latin', 'latin-ext'], weight: ['400', '500', '600', '800'], variable: '--font-hanken', display: 'swap' });

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: { default: 'Yuva · Lost and found pets in Istanbul', template: '%s · Yuva' },
  description: DESCRIPTION,
  authors: [{ name: AUTHOR.name, url: AUTHOR.url }],
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    siteName: 'Yuva',
    title: 'Yuva · Lost and found pets in Istanbul',
    description: DESCRIPTION,
    url: '/',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Somebody has seen them: a cat in a red collar on a pavement, looking up' }],
  },
  twitter: { card: 'summary_large_image', images: ['/og-image.jpg'] },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#fbfaf9' },
    { media: '(prefers-color-scheme: dark)', color: '#110f0d' },
  ],
};

/* Runs before first paint. The page follows the system unless the visitor has
   chosen light or dark here before. It also says that scripts run, and
   whether motion is welcome. */
const BOOT = `(function(){var d=document.documentElement;try{var t=localStorage.getItem('yuva-theme');if(t==='light'||t==='dark')d.dataset.theme=t}catch(e){}d.classList.add('js');if(!matchMedia('(prefers-reduced-motion: reduce)').matches)d.classList.add('live')})()`;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable}`} suppressHydrationWarning>
      <body>
        <script dangerouslySetInnerHTML={{ __html: BOOT }} />
        <a className="skip-link" href="#main">
          Skip to the page
        </a>
        <Masthead />
        {/* one page gives way to the next, under a masthead that stays put */}
        <ViewTransition>{children}</ViewTransition>
        <Footer />
        <Toasts />
        <Start />
        <Glide />
      </body>
    </html>
  );
}
