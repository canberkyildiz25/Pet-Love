'use client';

import { List, X } from '@phosphor-icons/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { count, useNotices } from '@/lib/notices';
import { useStore } from '@/lib/store';
import type { Kind } from '@/lib/types';

/** The mark: a roof, and a light on under it. */
export function Mark({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 28 28" aria-hidden="true">
      <path d="M5 15.5 14 6.5l9 9" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="14" cy="19.5" r="2.6" fill="var(--home)" />
    </svg>
  );
}

const KINDS: { kind: Kind; label: string }[] = [
  { kind: 'lost', label: 'Lost' },
  { kind: 'found', label: 'Found' },
  { kind: 'adopt', label: 'Home wanted' },
];

function Links({ sheet = false, onGo }: { sheet?: boolean; onGo?: () => void }) {
  const path = usePathname();
  const counts = count(useNotices());
  const on = (kind: Kind) => path === `/${kind}/`;

  return (
    <>
      {KINDS.map(({ kind, label }) => (
        <Link key={kind} className={sheet ? undefined : 'plate__link'} href={`/${kind}/`} aria-current={on(kind) ? 'page' : undefined} data-signal={kind} onClick={onGo}>
          <span className="dot" aria-hidden="true" />
          {label}
          <span className="plate__n">
            <span className="sr-only">, </span>
            {counts[kind]}
            <span className="sr-only"> open</span>
          </span>
        </Link>
      ))}
      <Link className={sheet ? undefined : 'plate__link'} href="/guides/" aria-current={path.startsWith('/guides/') ? 'page' : undefined} onClick={onGo}>
        Guides
      </Link>
    </>
  );
}

function Me({ onGo, className }: { onGo?: () => void; className?: string }) {
  const me = useStore((state) => state.me);
  const ready = useStore((state) => state.ready);
  return (
    <Link className={className} href={ready && me ? '/me/' : '/sign-in/'} onClick={onGo}>
      {ready && me ? 'My notices' : 'Sign in'}
    </Link>
  );
}

export function Plate() {
  const sheet = useRef<HTMLDialogElement>(null);
  const path = usePathname();
  const close = () => sheet.current?.close();

  // a link in the sheet has been followed: the sheet has done its job
  useEffect(() => {
    sheet.current?.close();
  }, [path]);

  return (
    <header className="plate-wrap">
      <div className="plate">
        <Link className="wordmark" href="/" aria-label="Yuva, the front page">
          <Mark />
          YUVA
        </Link>
        <nav className="plate__links" aria-label="Notices and guides">
          <Links />
        </nav>
        <div className="plate__end">
          <Me className="plate__link plate__me" />
          <Link className="plate__post" href="/post/">
            Post<span className="plate__rest">&nbsp;a notice</span>
          </Link>
          <button type="button" className="iconbtn plate__menu" aria-label="Open the menu" aria-haspopup="dialog" onClick={() => sheet.current?.showModal()}>
            <List size={24} weight="bold" aria-hidden="true" />
          </button>
        </div>
      </div>

      <dialog ref={sheet} className="sheet" aria-label="Menu">
        <div className="sheet__in">
          <div className="sheet__top">
            <Link className="wordmark" href="/" onClick={close}>
              <Mark />
              YUVA
            </Link>
            <button type="button" className="iconbtn" aria-label="Close the menu" onClick={close}>
              <X size={24} weight="bold" aria-hidden="true" />
            </button>
          </div>
          <nav className="sheet__links" aria-label="Notices and guides">
            <Links sheet onGo={close} />
          </nav>
          <div className="sheet__foot">
            <Link className="plate__post" href="/post/" onClick={close}>
              Post a notice
            </Link>
            <Me onGo={close} />
          </div>
        </div>
      </dialog>
    </header>
  );
}
