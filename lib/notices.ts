'use client';

/* The notices a page shows: the samples that ship with the site, and after
   them whatever this browser or the database has. */

import { useEffect, useMemo, useState } from 'react';
import { SEED } from './seed';
import { useStore } from './store';
import { newest } from './time';
import { signalOf, type Notice, type Signal } from './types';

/** Now, once the page is in a browser. 0 before that, and the samples do not need it. */
export function useNow() {
  const [now, setNow] = useState(0);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- the clock is only known once the page is in a browser
    setNow(Date.now());
  }, []);
  return now;
}

/** Every notice, newest first. Sightings reported from this browser are joined on. */
export function useNotices(): Notice[] {
  const ready = useStore((state) => state.ready);
  const mode = useStore((state) => state.mode);
  const mine = useStore((state) => state.mine);
  const remote = useStore((state) => state.remote);
  const seen = useStore((state) => state.seen);
  const now = useNow();

  return useMemo(() => {
    // until the browser's own store and its clock are known, the samples are the whole board
    if (!ready || !now) return SEED;
    const samples = SEED.map((notice) => (seen[notice.id]?.length ? { ...notice, sightings: [...notice.sightings, ...seen[notice.id]] } : notice));
    const added = mode === 'remote' ? remote : mine;
    return [...added, ...samples].sort((a, b) => newest(a, b, now));
  }, [ready, mode, mine, remote, seen, now]);
}

export function useNotice(id: string): Notice | undefined {
  const notices = useNotices();
  return notices.find((notice) => notice.id.toLowerCase() === id.toLowerCase());
}

export type Counts = Record<Signal, number>;

export function count(notices: Notice[]): Counts {
  const counts: Counts = { lost: 0, found: 0, adopt: 0, home: 0 };
  for (const notice of notices) counts[signalOf(notice)] += 1;
  return counts;
}

/** Notices that might be the same animal seen from the other side: a found
    cat for a lost cat, and the other way round. Nearest in place first. */
export function matches(notice: Notice, all: Notice[], now: number): Notice[] {
  if (notice.kind === 'adopt' || notice.home) return [];
  const other = notice.kind === 'lost' ? 'found' : 'lost';
  return all
    .filter((candidate) => candidate.kind === other && !candidate.home && candidate.species === notice.species && candidate.id !== notice.id)
    .map((candidate) => ({ candidate, near: (candidate.district === notice.district ? 2 : 0) + (candidate.hood === notice.hood ? 1 : 0) }))
    .sort((a, b) => b.near - a.near || newest(a.candidate, b.candidate, now))
    .slice(0, 3)
    .map(({ candidate }) => candidate);
}
