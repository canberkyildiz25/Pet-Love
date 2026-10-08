'use client';

import { ArrowRight } from '@phosphor-icons/react';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { headline, photoAlt, summary } from '@/components/NoticeCard';
import { PetPhoto } from '@/components/PetPhoto';
import { useNotices, useNow } from '@/lib/notices';
import { pathOf } from '@/lib/seed';
import { since } from '@/lib/time';
import { signalOf, SIGNALS } from '@/lib/types';

/* The newest open notices as an index: names set large, and beside them one
   photograph that changes to whichever name is being looked at. With nothing
   under the pointer, that is the name nearest the middle of the window, so
   the photographs turn over as the list is read. On a narrow screen there is
   no room for that, and every name carries its own small photograph. */
export function Index() {
  const notices = useNotices();
  const now = useNow();
  const open = notices.filter((notice) => !notice.home).slice(0, 8);
  const [on, setOn] = useState(0);
  const list = useRef<HTMLOListElement>(null);

  useEffect(() => {
    if (!list.current || typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) if (entry.isIntersecting) setOn(Number((entry.target as HTMLElement).dataset.row));
      },
      // a band across the middle of the window, one row deep
      { rootMargin: '-46% 0px -46% 0px' },
    );
    list.current.querySelectorAll('li').forEach((row) => observer.observe(row));
    return () => observer.disconnect();
  }, [open.length]);

  const shown = open[Math.min(on, open.length - 1)];

  return (
    <div className="index">
      <div className="index__side">
        <h2 id="on-board">On the board</h2>
        <div className="index__frame" aria-hidden="true">
          {open.map((notice, row) => (
            <div key={notice.id} className="index__shot" data-on={row === on ? '' : undefined}>
              <PetPhoto photo={notice.photo} alt="" sizes="(min-width: 64rem) 40vw, 1px" />
            </div>
          ))}
        </div>
        {shown && <p className="index__note">{summary(shown)}</p>}
      </div>

      <div className="index__main">
        <ol ref={list} className="index__list">
          {open.map((notice, row) => {
            const signal = signalOf(notice);
            return (
              <li key={notice.id} data-row={row} data-on={row === on ? '' : undefined} data-plain={notice.name || notice.home ? undefined : ''} data-signal={signal} onPointerEnter={() => setOn(row)}>
                <div className="index__thumb">
                  <PetPhoto photo={notice.photo} alt={photoAlt(notice)} sizes="5rem" />
                </div>
                <h3 className="index__name">
                  <Link href={pathOf(notice.id)} onFocus={() => setOn(row)}>
                    {headline(notice)}
                  </Link>
                </h3>
                <p className="index__meta">
                  <span className="chip">{SIGNALS[signal].label}</span>
                  <span>
                    {notice.hood}, {notice.district}
                  </span>
                  <span suppressHydrationWarning>{since(notice, now)}</span>
                </p>
              </li>
            );
          })}
        </ol>
        <p className="index__all">
          <Link className="more" href="/notices/">
            <span>See every notice</span>
            <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </p>
      </div>
    </div>
  );
}
