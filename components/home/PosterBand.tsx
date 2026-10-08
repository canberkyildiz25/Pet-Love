'use client';

import { ArrowRight } from '@phosphor-icons/react';
import Link from 'next/link';
import { Poster } from '@/components/Poster';
import { useNotice, useNow } from '@/lib/notices';
import { pathOf } from '@/lib/seed';
import { SITE } from '@/lib/site';

/** One of the sample notices as the sheet it prints, to show what a notice turns into. */
export function PosterBand({ id }: { id: string }) {
  const notice = useNotice(id);
  const now = useNow();
  if (!notice) return null;
  return (
    <div className="wrap printed">
      <div className="printed__sheet" data-in>
        <Poster notice={notice} now={now} link={`${SITE}${pathOf(notice.id)}`} sizes="(min-width: 60rem) 30rem, 86vw" />
      </div>
      <div className="printed__say">
        <h2>A notice that leaves the screen</h2>
        <p>
          The people most likely to have seen a lost pet live on its street, and most of them will never open this site. So every notice prints as one A4 sheet: what the animal looks like in the
          largest type, a code that opens the notice, and nine tabs to tear off.
        </p>
        <p className="printed__acts">
          <Link className="btn" href={`${pathOf(notice.id)}poster/`}>
            Open this poster
          </Link>
          <Link className="more" href="/guides/a-poster-that-gets-read/">
            <span>What makes a poster work</span>
            <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </p>
      </div>
    </div>
  );
}
