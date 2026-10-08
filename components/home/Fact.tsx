import { ArrowRight } from '@phosphor-icons/react/dist/ssr';
import Image from 'next/image';
import Link from 'next/link';
import { SOURCES } from '@/lib/guides';
import { samplePhoto } from '@/lib/photos';

/* One finding from the guides, given a whole photograph: the reason a search
   starts at the door and not across the city. */
export function Fact() {
  const photo = samplePhoto('sarman');
  return (
    <section className="fact" aria-labelledby="fact-title">
      <div className="fact__photo">
        <Image
          src={photo.src}
          alt="A ginger cat stretched out on a wall above the Bosphorus, a mosque and a bridge behind it"
          width={photo.w}
          height={photo.h}
          sizes="100vw"
          quality={80}
          style={{ objectPosition: `${photo.fx}% ${photo.fy}%` }}
        />
      </div>
      <div className="wrap">
        <div className="fact__card">
          <h2 id="fact-title">Half of the missing cats that were found were within fifty metres of where they got out.</h2>
          <p>
            That is the middle figure from a study of 1,210 cats ({SOURCES.huang.short}), and three in four were within 500 metres. A search starts at the door, on foot, and looks under things.
          </p>
          <Link className="more" href="/guides/cats-hide-dogs-travel/">
            <span>Where to look first</span>
            <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
