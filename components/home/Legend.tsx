'use client';

import Link from 'next/link';
import { count, useNotices } from '@/lib/notices';
import type { Signal } from '@/lib/types';

const ITEMS: { signal: Signal; label: string; href: string }[] = [
  { signal: 'lost', label: 'lost', href: '/lost/' },
  { signal: 'found', label: 'found', href: '/found/' },
  { signal: 'adopt', label: 'want a home', href: '/adopt/' },
  { signal: 'home', label: 'home again', href: '#home-again' },
];

/** The four signals with how many notices carry each one. It is also the key to the colours. */
export function Legend() {
  const counts = count(useNotices());
  return (
    <ul className="legend" aria-label="Notices on the board">
      {ITEMS.map(({ signal, label, href }) => (
        <li key={signal} data-signal={signal}>
          <Link href={href}>
            <strong>{counts[signal]}</strong>
            <span>
              <i className="dot" aria-hidden="true" />
              {label}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
