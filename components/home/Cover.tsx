'use client';

import { ArrowRight } from '@phosphor-icons/react';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

/* The front cover: a short film of a cat in a collar on a pavement, who looks
   away and then looks straight at you. It plays once and holds on that look.
   Under it is a photograph of its first frame, so the page is whole before
   the film arrives, and stays whole where a film is not wanted. */

type Film = 'still' | 'playing' | 'paused' | 'ended';

/** A window much taller than it is wide is given the upright cut. */
const UPRIGHT = '(max-aspect-ratio: 3/4)';
const cut = () => (matchMedia(UPRIGHT).matches ? '/film/opening-tall.mp4' : '/film/opening.mp4');

const CONTROL: Record<Film, string> = { still: 'Play the film', playing: 'Pause the film', paused: 'Play the film', ended: 'Play it again' };

export function Cover() {
  const video = useRef<HTMLVideoElement>(null);
  const [film, setFilm] = useState<Film>('still');

  useEffect(() => {
    const element = video.current;
    if (!element || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    element.src = cut();
    // a browser that will not start a film leaves the photograph up
    element.play().catch(() => undefined);
  }, []);

  function toggle() {
    const element = video.current;
    if (!element) return;
    if (film === 'playing') {
      element.pause();
      return;
    }
    if (!element.getAttribute('src')) element.src = cut();
    if (film === 'ended') element.currentTime = 0;
    element.play().catch(() => undefined);
  }

  return (
    <section className="cover" data-film={film}>
      <div className="cover__film">
        <picture>
          <source media={`(prefers-reduced-motion: reduce) and ${UPRIGHT}`} srcSet="/film/opening-tall-last.jpg" />
          <source media="(prefers-reduced-motion: reduce)" srcSet="/film/opening-last.jpg" />
          <source media={UPRIGHT} srcSet="/film/opening-tall-first.jpg" />
          {/* four fixed frames of the film: the first or the last, wide or upright, chosen by the window and by whether motion is wanted */}
          <img src="/film/opening-first.jpg" alt="A tabby and white cat in a red collar, lying on a pavement beside a street" width={1920} height={1080} fetchPriority="high" decoding="async" />
        </picture>
        <video
          ref={video}
          muted
          playsInline
          preload="none"
          aria-hidden="true"
          tabIndex={-1}
          onPlaying={() => setFilm('playing')}
          onPause={(event) => setFilm(event.currentTarget.ended ? 'ended' : 'paused')}
          onEnded={() => setFilm('ended')}
        />
      </div>

      <div className="wrap cover__in">
        <h1 className="cover__title">
          <span className="cover__line">
            <span>Somebody</span>
          </span>{' '}
          <span className="cover__line">
            <span>has seen</span>
          </span>{' '}
          <span className="cover__line">
            <span>them.</span>
          </span>
        </h1>
        <p className="cover__lede">Istanbul&rsquo;s notice board for lost and found pets. Post in three steps; neighbours print it and report what they see.</p>
        <p className="cover__acts">
          <Link className="btn btn--light" href="/post/">
            Post a notice
          </Link>
          <Link className="more" href="/notices/">
            <span>See every notice</span>
            <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </p>
      </div>

      <button type="button" className="cover__ctl" onClick={toggle}>
        {CONTROL[film]}
      </button>
    </section>
  );
}
