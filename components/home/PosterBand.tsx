'use client';

import { Printer } from '@phosphor-icons/react';
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
    <div className="posterband">
      <div className="posterband__sheet" data-in>
        <Poster notice={notice} now={now} link={`${SITE}${pathOf(notice.id)}`} sizes="(min-width: 52rem) 24rem, 80vw" />
      </div>
      <div className="posterband__say">
        <h2>A notice that leaves the screen</h2>
        <p>
          The people most likely to have seen a lost pet are the ones who live on its street, and most of them will never open this site. So every notice prints as an A4 sheet for a door, a shop
          window or a lamp post.
        </p>
        <ul className="posterband__parts">
          <li>
            <strong>What they look like, first.</strong> A stranger cannot use a name. They can use brindle, red collar, white patch.
          </li>
          <li>
            <strong>A code that opens the notice.</strong> Whoever scans it can report where and when, and the sighting joins the trail.
          </li>
          <li>
            <strong>Nine tabs to tear off.</strong> For the person who will see the dog tomorrow and has no pen today.
          </li>
        </ul>
        <p className="posterband__acts">
          <Link className="btn btn--line" href={`${pathOf(notice.id)}poster/`}>
            <Printer size={20} aria-hidden="true" />
            Open this poster
          </Link>
          <Link className="link" href="/guides/a-poster-that-gets-read/">
            What makes a poster work
          </Link>
        </p>
      </div>
    </div>
  );
}
