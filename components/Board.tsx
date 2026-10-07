'use client';

import { Pause, Play } from '@phosphor-icons/react';
import Link from 'next/link';
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useNotices, useNow } from '@/lib/notices';
import { upper } from '@/lib/places';
import { pathOf } from '@/lib/seed';
import { boardSince, daysSince, since } from '@/lib/time';
import { called, signalOf, SIGNALS, type Notice } from '@/lib/types';

/* The board: the latest notices on a split-flap sign, the kind a station
   uses. Each line is a link to its notice. Every few seconds one line turns
   over to the next notice, so that over a minute the whole board has passed.

   The letters are a show for the eye: each line carries the same words as its
   label, for a screen reader, and the board stands still when less motion is
   asked for, when the pointer or the keyboard is on it, and when it is paused. */

const ROWS = 7;
const TURN = 4800;
const GLYPHS = 'ABCÇDEFGĞHIİJKLMNOÖPRSŞTUÜVYZ0123456789';
const FLIP: Keyframe[] = [
  { transform: 'perspective(8rem) rotateX(-78deg)', opacity: 0.55 },
  { transform: 'perspective(8rem) rotateX(0deg)', opacity: 1 },
];

const fit = (text: string, size: number) => upper(text).padEnd(size).slice(0, size);
/* an empty flap still has to hold its width: a space that does not collapse */
const BLANK = String.fromCharCode(160);
const glyph = (ch: string) => (ch === ' ' ? BLANK : ch);

/** A word on the board. React sets the letters once; after that the sign turns them itself. */
function Flaps({ text, size, wait, className }: { text: string; size: number; wait: number; className?: string }) {
  const host = useRef<HTMLSpanElement>(null);
  const [first] = useState(() => fit(text, size));
  const shown = useRef<string | null>(null);

  // before the browser paints, so that a word never shows whole and then blanks to turn
  useLayoutEffect(() => {
    const cells = host.current ? ([...host.current.children] as HTMLElement[]) : [];
    const target = fit(text, size);
    const live = document.documentElement.classList.contains('live');
    const from = shown.current ?? ' '.repeat(size);
    shown.current = target;
    if (!live) {
      cells.forEach((cell, index) => (cell.textContent = glyph(target[index])));
      return;
    }
    const timers: number[] = [];
    cells.forEach((cell, index) => {
      if (from[index] === target[index]) return;
      cell.textContent = glyph(from[index]);
      const turns = 2 + ((index * 5 + size) % 4);
      for (let turn = 1; turn <= turns; turn += 1) {
        timers.push(
          window.setTimeout(
            () => {
              cell.textContent = glyph(turn === turns ? target[index] : GLYPHS[(index * 7 + turn * 13 + target.charCodeAt(index)) % GLYPHS.length]);
              cell.animate(FLIP, { duration: 140, easing: 'cubic-bezier(0.23, 1, 0.32, 1)' });
            },
            wait + index * 26 + turn * 64,
          ),
        );
      }
    });
    return () => {
      timers.forEach(clearTimeout);
      // a turn cut short still ends on the right letter
      cells.forEach((cell, index) => (cell.textContent = glyph(target[index])));
    };
  }, [text, size, wait]);

  return (
    <span ref={host} className={className ? `flaps ${className}` : 'flaps'} aria-hidden="true" suppressHydrationWarning>
      {first.split('').map((ch, index) => (
        <b key={index} suppressHydrationWarning>
          {glyph(ch)}
        </b>
      ))}
    </span>
  );
}

/* An animal nobody has a name for goes on the board by its colour: "Young
   tabby cat" is TABBY. The word is English, so it is set in capitals here,
   before the Turkish rule for the letter i can reach it. */
const FILLER = new Set(['young', 'old', 'small', 'large', 'long-haired', 'short-haired', 'and', 'with', 'a', 'cat', 'dog', 'kitten', 'puppy', 'bird', 'rabbit']);
const plain = (title: string) => (title.split(' ').find((word) => !FILLER.has(word.toLowerCase())) ?? title).toUpperCase();

const shortSince = (notice: Notice, now: number) => {
  if (notice.home) return 'HOME';
  const days = daysSince(notice, now);
  return days === 0 ? 'NOW' : `${days}D`;
};

function Row({ notice, now, index }: { notice: Notice; now: number; index: number }) {
  const signal = signalOf(notice);
  const where = `${notice.hood}, ${notice.district}`;
  const label = `${SIGNALS[signal].label}: ${called(notice)}, ${where}, ${notice.home ? 'home again' : since(notice, now)}`;
  const wait = index * 90;
  return (
    <Link className="board__row" href={pathOf(notice.id)} data-signal={signal} aria-label={label}>
      <span className="board__chip" aria-hidden="true">
        {SIGNALS[signal].board}
      </span>
      <Flaps text={notice.name ?? plain(notice.title)} size={8} wait={wait} />
      <Flaps className="board__where" text={notice.hood} size={12} wait={wait + 60} />
      <Flaps className="board__long" text={notice.home ? 'HOME' : boardSince(notice, now)} size={7} wait={wait + 120} />
      <Flaps className="board__short" text={shortSince(notice, now)} size={4} wait={wait + 120} />
    </Link>
  );
}

const stamp = new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Istanbul', weekday: 'short', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', hour12: false });

export function Board() {
  const notices = useNotices();
  const now = useNow();
  const host = useRef<HTMLElement>(null);
  const [paused, setPaused] = useState(false);
  const [on, setOn] = useState(false);
  /* which notice each line shows, as places in the list; a line keeps its place on the board */
  const [slots, setSlots] = useState(() => Array.from({ length: ROWS }, (_, index) => index));
  const turn = useRef({ line: 0, next: ROWS });

  const rows = useMemo(() => slots.map((at) => notices[at % notices.length]).filter(Boolean), [slots, notices]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- the letters stay hidden until the sign can turn them
    setOn(true);
  }, []);

  useEffect(() => {
    if (paused || notices.length <= ROWS || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const element = host.current;
    let held = false;
    const hold = () => (held = true);
    const release = () => (held = false);
    element?.addEventListener('pointerenter', hold);
    element?.addEventListener('pointerleave', release);
    element?.addEventListener('focusin', hold);
    element?.addEventListener('focusout', release);
    const timer = window.setInterval(() => {
      if (held || document.hidden) return;
      const { line, next } = turn.current;
      setSlots((current) => current.map((at, index) => (index === line ? next : at)));
      turn.current = { line: (line + 3) % ROWS, next: (next + 1) % notices.length };
    }, TURN);
    return () => {
      clearInterval(timer);
      element?.removeEventListener('pointerenter', hold);
      element?.removeEventListener('pointerleave', release);
      element?.removeEventListener('focusin', hold);
      element?.removeEventListener('focusout', release);
    };
  }, [paused, notices.length]);

  return (
    <section ref={host} className={on ? 'board is-on' : 'board'} aria-labelledby="board-title">
      <header className="board__top">
        <h2 id="board-title">Latest notices · Istanbul</h2>
        <span className="board__clock" suppressHydrationWarning>
          {now ? stamp.format(now).replace(',', ' ·') : ''}
        </span>
        <button type="button" className="iconbtn board__pause" onClick={() => setPaused((value) => !value)} aria-pressed={paused} aria-label={paused ? 'Let the board turn again' : 'Hold the board still'}>
          {paused ? <Play size={18} weight="fill" aria-hidden="true" /> : <Pause size={18} weight="fill" aria-hidden="true" />}
        </button>
      </header>
      <ol className="board__rows">
        {rows.map((notice, index) => (
          <li key={index}>
            <Row notice={notice} now={now} index={index} />
          </li>
        ))}
      </ol>
    </section>
  );
}
