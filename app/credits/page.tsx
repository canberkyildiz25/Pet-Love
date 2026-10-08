import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { PHOTOS_FETCHED, SAMPLE_PHOTOS } from '@/lib/photos';
import { SEED, pathOf } from '@/lib/seed';
import { called } from '@/lib/types';

export const metadata: Metadata = {
  title: 'Credits',
  description: 'Who made the film and took each photograph on Yuva, and under which licence each is used.',
  alternates: { canonical: '/credits/' },
};

const fetched = new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${PHOTOS_FETCHED}T00:00:00Z`));

export default function Credits() {
  return (
    <main id="main" className="wrap">
      <header className="page-head">
        <h1>Credits</h1>
        <p>
          Every photograph on the example notices is from Wikimedia Commons, fetched on {fetched} and made smaller. None of the animals in them is lost, and none of the photographers has anything to do
          with this site.
        </p>
      </header>

      <div className="prose credits-film">
        <h2>The film</h2>
        <p>
          The film on the front page is by Eudes cs, from{' '}
          <a className="link" href="https://www.pexels.com/video/adorable-cat-relaxing-in-urban-setting-29448609/" rel="noopener">
            Pexels
          </a>
          , used under the{' '}
          <a className="link" href="https://www.pexels.com/license/" rel="noopener license">
            Pexels licence
          </a>
          . It is cut to eleven seconds and made smaller, and it has no sound. The cat in it is not lost either.
        </p>
        <h2>The photographs</h2>
      </div>

      <ul className="credits">
        {SAMPLE_PHOTOS.map((photo) => {
          const notice = SEED.find((entry) => entry.photo?.src === photo.src);
          return (
            <li key={photo.key}>
              <div className="credits__photo">
                <Image src={photo.src} alt="" width={photo.w} height={photo.h} sizes="4rem" quality={80} style={{ objectPosition: `${photo.fx}% ${photo.fy}%` }} />
              </div>
              <div>
                <a className="link" href={photo.page} rel="noopener">
                  {photo.title.replace(/\.(jpe?g|png|webp)$/i, '')}
                </a>
                <p className="credits__by">
                  {photo.by} ·{' '}
                  {photo.licenceUrl ? (
                    <a className="link" href={photo.licenceUrl} rel="noopener license">
                      {photo.licence}
                    </a>
                  ) : (
                    photo.licence
                  )}
                </p>
              </div>
              {notice && (
                <p className="credits__by">
                  Used on{' '}
                  <Link className="link" href={pathOf(notice.id)}>
                    {notice.id}, {called(notice)}
                  </Link>
                </p>
              )}
            </li>
          );
        })}
      </ul>

      <div className="prose section">
        <h2>Everything else</h2>
        <p>
          The typefaces are Cormorant Garamond by Christian Thalmann and Hanken Grotesk by Alfredo Marco Pradil, both under the SIL Open Font License. The icons are from Phosphor, under the MIT
          licence. The page is carried under a mouse wheel by Lenis, from darkroom.engineering, also MIT. The code on the posters is drawn with qrcode-generator by Kazuhiko Arase, MIT again. QR Code is a
          registered trademark of Denso Wave.
        </p>
        <p>
          The studies and organisations the guides lean on are listed at the foot of each <Link className="link" href="/guides/">guide</Link>.
        </p>
      </div>
    </main>
  );
}
