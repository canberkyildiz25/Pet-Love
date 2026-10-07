'use client';

import Link from 'next/link';
import { useId, useMemo, useState } from 'react';
import { count, useNotices, useNow } from '@/lib/notices';
import { fold } from '@/lib/places';
import { SPECIES, type Kind, type Notice, type Species } from '@/lib/types';
import { NoticeCard } from './NoticeCard';

const TABS: { kind: Kind | null; label: string; href: string }[] = [
  { kind: null, label: 'All', href: '/notices/' },
  { kind: 'lost', label: 'Lost', href: '/lost/' },
  { kind: 'found', label: 'Found', href: '/found/' },
  { kind: 'adopt', label: 'Home wanted', href: '/adopt/' },
];

const NOUN: Record<Kind, [one: string, many: string]> = {
  lost: ['lost notice', 'lost notices'],
  found: ['found notice', 'found notices'],
  adopt: ['animal wants a home', 'animals want a home'],
};

/** Everything a search could mean: the name, the look, the marks, the place, the reference. */
const words = (notice: Notice) => fold([notice.name, notice.title, notice.marks, notice.hood, notice.district, notice.place, notice.id, notice.species].filter(Boolean).join(' '));

/** The list of notices, one kind or all of them, with the ways to narrow it. */
export function Finder({ kind }: { kind: Kind | null }) {
  const notices = useNotices();
  const now = useNow();
  const id = useId();
  const [text, setText] = useState('');
  const [species, setSpecies] = useState<Species | ''>('');
  const [district, setDistrict] = useState('');
  const [closed, setClosed] = useState(false);

  const counts = count(notices);
  const pool = useMemo(() => notices.filter((notice) => !kind || notice.kind === kind), [notices, kind]);
  const districts = useMemo(() => [...new Set(pool.map((notice) => notice.district))].sort((a, b) => a.localeCompare(b, 'tr')), [pool]);
  const shown = useMemo(() => {
    const wanted = fold(text).split(/\s+/).filter(Boolean);
    return pool.filter((notice) => {
      if (notice.home && !closed) return false;
      if (species && notice.species !== species) return false;
      if (district && notice.district !== district) return false;
      if (!wanted.length) return true;
      const have = words(notice);
      return wanted.every((word) => have.includes(word));
    });
  }, [pool, text, species, district, closed]);

  const narrowed = Boolean(text || species || district);
  const clear = () => {
    setText('');
    setSpecies('');
    setDistrict('');
  };
  const [one, many] = kind ? NOUN[kind] : ['notice', 'notices'];

  return (
    <>
      <div className="filters">
        <nav className="tabs" aria-label="Kind of notice">
          {TABS.map((tab) => (
            <Link key={tab.href} href={tab.href} aria-current={tab.kind === kind ? 'page' : undefined} data-signal={tab.kind ?? undefined}>
              {tab.kind && <i className="dot" aria-hidden="true" />}
              {tab.label}
              <span className="tabs__n">
                <span className="sr-only">, </span>
                {tab.kind ? counts[tab.kind] : counts.lost + counts.found + counts.adopt}
                <span className="sr-only"> open</span>
              </span>
            </Link>
          ))}
        </nav>
        <form className="filters__row" role="search" onSubmit={(event) => event.preventDefault()}>
          <div className="field">
            <label htmlFor={`${id}-text`}>Search</label>
            <input
              id={`${id}-text`}
              className="input"
              type="search"
              value={text}
              onChange={(event) => setText(event.target.value)}
              placeholder="brindle, red collar, Moda"
              autoComplete="off"
              enterKeyHint="search"
            />
          </div>
          <div className="field">
            <label htmlFor={`${id}-species`}>Animal</label>
            <select id={`${id}-species`} className="input" value={species} onChange={(event) => setSpecies(event.target.value as Species | '')}>
              <option value="">Any animal</option>
              {SPECIES.map((entry) => (
                <option key={entry.key} value={entry.key}>
                  {entry.label}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor={`${id}-district`}>District</label>
            <select id={`${id}-district`} className="input" value={district} onChange={(event) => setDistrict(event.target.value)}>
              <option value="">All of Istanbul</option>
              {districts.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>
          <label className="check">
            <input type="checkbox" checked={closed} onChange={(event) => setClosed(event.target.checked)} />
            Show the ones that are home
          </label>
        </form>
      </div>

      <div className="count">
        <p role="status">
          {shown.length} {shown.length === 1 ? one : many}
          {narrowed && ' that match'}
        </p>
        {narrowed && (
          <button type="button" className="btn btn--quiet btn--small" onClick={clear}>
            Clear the search
          </button>
        )}
      </div>

      {shown.length ? (
        <div className="cards">
          {shown.map((notice, index) => (
            <NoticeCard key={notice.id} notice={notice} now={now} lead={index < 2} level={2} />
          ))}
        </div>
      ) : (
        <div className="empty">
          <h2>Nothing on the board matches that.</h2>
          <p>
            {narrowed
              ? 'Try fewer words, or look across all of Istanbul.'
              : 'There are no open notices of this kind at the moment.'}
          </p>
          <div className="acts">
            {narrowed && (
              <button type="button" className="btn" onClick={clear}>
                Clear the search
              </button>
            )}
            <Link className="btn btn--line" href={kind ? `/post/?kind=${kind}` : '/post/'}>
              Post a notice
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
