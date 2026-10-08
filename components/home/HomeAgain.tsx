'use client';

import Link from 'next/link';
import type { CSSProperties } from 'react';
import { PetPhoto } from '@/components/PetPhoto';
import { headline, photoAlt } from '@/components/NoticeCard';
import { useNotices } from '@/lib/notices';
import { pathOf } from '@/lib/seed';
import { awayFor } from '@/lib/time';
import { spell } from './Opening';

/** The notices that are closed, laid out like prints on a table, each with how it ended. */
export function HomeAgain() {
  const home = useNotices().filter((notice) => notice.home);
  const shown = home.slice(0, 4);
  if (!shown.length) return null;
  return (
    <>
      <header className="again__head">
        <h2 id="home-again-title">Home again</h2>
        <p>
          {home.length === 1 ? 'One notice on this board is closed.' : `${spell(home.length).replace(/^./, (letter) => letter.toUpperCase())} notices on this board are closed.`} This is how{' '}
          {shown.length === 1 ? 'it' : 'each one'} ended.
        </p>
      </header>
      <ul className="prints">
        {shown.map((notice, index) => (
          <li key={notice.id} style={{ '--i': index } as CSSProperties}>
            <div className="prints__photo" data-reveal>
              <PetPhoto photo={notice.photo} alt={photoAlt(notice)} sizes="(min-width: 48rem) 32vw, 72vw" />
            </div>
            <h3>
              <Link href={pathOf(notice.id)}>{headline(notice)}</Link>
            </h3>
            <p className="prints__after">
              {awayFor(notice)?.replace(/^./, (letter) => letter.toUpperCase())}, {notice.hood}
            </p>
            <p className="prints__note">{notice.home?.note}</p>
          </li>
        ))}
      </ul>
    </>
  );
}
