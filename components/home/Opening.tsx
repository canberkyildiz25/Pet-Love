'use client';

import Link from 'next/link';
import type { CSSProperties, ReactNode } from 'react';
import { count, useNotices } from '@/lib/notices';

const NUMBER = ['no', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen', 'twenty'];
/** A count as a sentence says it: nine, not 9. */
export const spell = (n: number) => NUMBER[n] ?? String(n);

const place = (index: number) => ({ '--i': index }) as CSSProperties;

/* What the site is, in one sentence, with what is on the board today inside
   it. The sentence is set word by word, so that it can take its ink as it
   comes up the window. */
export function Opening() {
  const counts = count(useNotices());
  let at = 0;
  const say = (text: string): ReactNode =>
    text.split(' ').map((word) => (
      <span key={at} className="opening__w" style={place(at++)}>
        {word}{' '}
      </span>
    ));
  const link = (href: string, text: string, lost = false): ReactNode => (
    <Link key={href} className="opening__w" style={place(at++)} href={href} data-signal={lost ? 'lost' : undefined}>
      {text}
    </Link>
  );

  return (
    <section className="wrap opening" aria-label="What Yuva is">
      <p className="opening__word" data-in>
        <b>yuva</b>
        <span>noun, Turkish. A nest; a home.</span>
      </p>
      <p className="opening__say">
        {say('Yuva is Istanbul’s notice board for animals that have gone missing. On it today:')}
        {link('/lost/', `${spell(counts.lost)} lost`, true)}
        {say(',')}
        {link('/found/', `${spell(counts.found)} found`)}
        {say(', and')}
        {link('/adopt/', `${spell(counts.adopt)} looking for a home`)}
        {say('.')}
      </p>
    </section>
  );
}
