import Link from 'next/link';
import { upper } from '@/lib/places';
import { pathOf } from '@/lib/seed';
import { awayFor, boardSince } from '@/lib/time';
import { called, signalOf, SIGNALS, type Notice } from '@/lib/types';
import { firstSentence } from '@/lib/words';
import { PetPhoto } from './PetPhoto';

/** The line under a name: what a stranger would see, and how the search is going. */
export function summary(notice: Notice) {
  if (notice.home) return notice.home.note;
  const look = notice.name ? `${notice.title}. ${firstSentence(notice.marks)}` : firstSentence(notice.marks);
  const seen = notice.sightings.length;
  if (notice.kind !== 'lost' || !seen) return look;
  return `${look} ${seen === 1 ? '1 sighting.' : `${seen} sightings.`}`;
}

/** Where and how long, set the way the board sets it: MODA, KADIKÖY · 2 DAYS */
export function whereLine(notice: Notice, now: number) {
  const place = `${upper(notice.hood)}, ${upper(notice.district)}`;
  return `${place} · ${notice.home ? upper(awayFor(notice) ?? 'home') : boardSince(notice, now)}`;
}

export const headline = (notice: Notice) => (notice.home ? `${called(notice)} is home` : called(notice));

/** What the photograph shows, for somebody who cannot see it. */
export const photoAlt = (notice: Notice) => (notice.name ? `${notice.name}, a ${notice.title.toLowerCase()}` : notice.title);

interface CardProps {
  notice: Notice;
  now: number;
  sizes?: string;
  lead?: boolean;
  /** The heading its name is: 2 in a list that is the page, 3 in a list under a heading of its own. */
  level?: 2 | 3;
}

export function NoticeCard({ notice, now, sizes = '(min-width: 64rem) 20rem, (min-width: 34rem) 45vw, 7rem', lead = false, level = 3 }: CardProps) {
  const signal = signalOf(notice);
  const Title = level === 2 ? 'h2' : 'h3';
  return (
    <article className="card" data-signal={signal}>
      <div className="card__photo">
        <PetPhoto photo={notice.photo} alt={photoAlt(notice)} sizes={sizes} lead={lead} />
        <span className="chip">{SIGNALS[signal].label}</span>
      </div>
      <div className="card__text">
        <p className="label card__where" suppressHydrationWarning>
          {whereLine(notice, now)}
        </p>
        <Title className="card__title">
          <Link href={pathOf(notice.id)}>{headline(notice)}</Link>
        </Title>
        <p className="card__sum">{summary(notice)}</p>
      </div>
    </article>
  );
}
