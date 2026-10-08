'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { count, useNotices } from '@/lib/notices';
import { useStore } from '@/lib/store';
import type { Kind } from '@/lib/types';

const KINDS: { kind: Kind; label: string }[] = [
  { kind: 'lost', label: 'Lost' },
  { kind: 'found', label: 'Found' },
  { kind: 'adopt', label: 'Home wanted' },
];

/** The three kinds of notice, each with how many are open, and the guides. */
function Links({ onGo }: { onGo?: () => void }) {
  const path = usePathname();
  const counts = count(useNotices());

  return (
    <>
      {KINDS.map(({ kind, label }) => (
        <Link key={kind} href={`/${kind}/`} aria-current={path === `/${kind}/` ? 'page' : undefined} onClick={onGo}>
          <span>{label}</span>
          <sup>
            <span className="sr-only">, </span>
            {counts[kind]}
            <span className="sr-only"> open</span>
          </sup>
        </Link>
      ))}
      <Link href="/guides/" aria-current={path.startsWith('/guides/') ? 'page' : undefined} onClick={onGo}>
        <span>Guides</span>
      </Link>
    </>
  );
}

function Me({ onGo, className }: { onGo?: () => void; className?: string }) {
  const me = useStore((state) => state.me);
  const ready = useStore((state) => state.ready);
  return (
    <Link className={className} href={ready && me ? '/me/' : '/sign-in/'} onClick={onGo}>
      <span>{ready && me ? 'My notices' : 'Sign in'}</span>
    </Link>
  );
}

/** The masthead on every page: the name in the middle, the notices to one
    side, and the way to post one on the other. Over the film on the front
    page it is lettering only; once the page has moved under it, it is a bar. */
export function Masthead() {
  const top = useRef<HTMLDivElement>(null);
  const mast = useRef<HTMLElement>(null);
  const sheet = useRef<HTMLDialogElement>(null);
  const path = usePathname();
  const close = () => sheet.current?.close();

  // a link in the menu has been followed: the menu has done its job
  useEffect(() => {
    sheet.current?.close();
  }, [path]);

  // the marker is as tall as whatever the masthead should stay clear over
  useEffect(() => {
    if (!top.current || typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver(([entry]) => mast.current?.toggleAttribute('data-raised', !entry.isIntersecting));
    observer.observe(top.current);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <div ref={top} className="mast-top" aria-hidden="true" />
      <header ref={mast} className="mast">
        <div className="wrap mast__in">
          <Link className="wordmark" href="/" aria-label="Yuva, the front page">
            Yuva
          </Link>
          <nav className="mast__links" aria-label="Notices and guides">
            <Links />
          </nav>
          <div className="mast__end">
            <Me className="mast__me" />
            <Link className="mast__post" href="/post/">
              Post a notice
            </Link>
            <button type="button" className="mast__menu" aria-haspopup="dialog" onClick={() => sheet.current?.showModal()}>
              Menu
            </button>
          </div>
        </div>

        <dialog ref={sheet} className="sheet" aria-label="Menu">
          <div className="sheet__in">
            <div className="sheet__top">
              <Link className="wordmark" href="/" onClick={close}>
                Yuva
              </Link>
              <button type="button" className="mast__menu" onClick={close}>
                Close
              </button>
            </div>
            <nav className="sheet__links" aria-label="Notices and guides">
              <Links onGo={close} />
            </nav>
            <div className="sheet__foot">
              <Link className="btn" href="/post/" onClick={close}>
                Post a notice
              </Link>
              <Me className="more" onGo={close} />
            </div>
          </div>
        </dialog>
      </header>
    </>
  );
}
