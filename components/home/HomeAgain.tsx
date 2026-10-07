'use client';

import Link from 'next/link';
import { PetPhoto } from '@/components/PetPhoto';
import { headline, photoAlt } from '@/components/NoticeCard';
import { useNotices } from '@/lib/notices';
import { pathOf } from '@/lib/seed';
import { awayFor } from '@/lib/time';
import { SIGNALS } from '@/lib/types';

const HOW = { lost: 'Lost', found: 'Found', adopt: 'Wanted a home' } as const;

/** The notices that are closed, and how each one ended. */
export function HomeAgain() {
  const home = useNotices().filter((notice) => notice.home);
  return (
    <ul className="homes" data-signal="home">
      {home.slice(0, 6).map((notice) => (
        <li key={notice.id}>
          <div className="homes__photo">
            <PetPhoto photo={notice.photo} alt={photoAlt(notice)} sizes="4.5rem" />
          </div>
          <div>
            <h3>
              <Link href={pathOf(notice.id)}>{headline(notice)}</Link>
            </h3>
            <p className="label homes__after">
              <i className="dot" aria-hidden="true" />
              <span className="sr-only">{SIGNALS.home.label}: </span>
              {HOW[notice.kind]} in {notice.hood}, home {awayFor(notice)}
            </p>
          </div>
          <p className="homes__note">{notice.home?.note}</p>
        </li>
      ))}
    </ul>
  );
}
