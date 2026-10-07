'use client';

import { ArrowRight } from '@phosphor-icons/react';
import Link from 'next/link';
import { NoticeCard } from '@/components/NoticeCard';
import { useNotices, useNow } from '@/lib/notices';

/** The newest notices that are still open, of every kind. */
export function OnBoard() {
  const notices = useNotices();
  const now = useNow();
  const open = notices.filter((notice) => !notice.home);
  return (
    <>
      <div className="cards">
        {open.slice(0, 8).map((notice) => (
          <NoticeCard key={notice.id} notice={notice} now={now} />
        ))}
      </div>
      <p className="more">
        <Link className="btn btn--line" href="/notices/">
          All {open.length} open notices
          <ArrowRight size={18} weight="bold" aria-hidden="true" />
        </Link>
      </p>
    </>
  );
}
