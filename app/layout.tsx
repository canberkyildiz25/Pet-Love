import type { Metadata, Viewport } from 'next';
import { Barlow, Barlow_Condensed, Barlow_Semi_Condensed } from 'next/font/google';
import type { ReactNode } from 'react';
import { Footer } from '@/components/Footer';
import { Plate } from '@/components/Plate';
import { Start } from '@/components/Start';
import { Toasts } from '@/components/Toasts';
import { AUTHOR, DESCRIPTION, SITE } from '@/lib/site';
import './globals.css';

/* One family in three widths: Barlow was drawn from California's road signs
   and number plates, which is the voice a public notice board wants. */
const barlow = Barlow({ subsets: ['latin', 'latin-ext'], weight: ['400', '500', '600'], variable: '--font-barlow', display: 'swap' });
const semi = Barlow_Semi_Condensed({ subsets: ['latin', 'latin-ext'], weight: ['600', '700'], variable: '--font-semi', display: 'swap' });
const condensed = Barlow_Condensed({ subsets: ['latin', 'latin-ext'], weight: ['500', '600', '700'], variable: '--font-condensed', display: 'swap' });

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
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Somebody has seen them: the Yuva notice board, with the latest lost and found pets' }],
  },
  twitter: { card: 'summary_large_image', images: ['/og-image.jpg'] },
};

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#fafbfc' },
    { media: '(prefers-color-scheme: dark)', color: '#0c111b' },
  ],
};

/* Runs before first paint. The page follows the system unless the visitor has
   chosen light or dark here before. It also says that scripts run, and
   whether motion is welcome. */
const BOOT = `(function(){var d=document.documentElement;try{var t=localStorage.getItem('yuva-theme');if(t==='light'||t==='dark')d.dataset.theme=t}catch(e){}d.classList.add('js');if(!matchMedia('(prefers-reduced-motion: reduce)').matches)d.classList.add('live')})()`;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${barlow.variable} ${semi.variable} ${condensed.variable}`} suppressHydrationWarning>
      <body>
        <script dangerouslySetInnerHTML={{ __html: BOOT }} />
        <a className="skip-link" href="#main">
          Skip to the page
        </a>
        <Plate />
        {children}
        <Footer />
        <Toasts />
        <Start />
      </body>
    </html>
  );
}
