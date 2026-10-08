import Link from 'next/link';
import { ViewTransition } from 'react';
import { pathOf } from '@/lib/seed';
import { awayFor, since } from '@/lib/time';
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

export const headline = (notice: Notice) => (notice.home ? `${called(notice)} is home` : called(notice));

/** What the photograph shows, for somebody who cannot see it. */
export const photoAlt = (notice: Notice) => (notice.name ? `${notice.name}, a ${notice.title.toLowerCase()}` : notice.title);

/** The name a photograph keeps while it travels from a card to its notice's page. */
export const photoName = (notice: Pick<Notice, 'id'>) => `photo-${notice.id.toLowerCase()}`;

interface CardProps {
  notice: Notice;
  now: number;
  sizes?: string;
  lead?: boolean;
  /** The heading its name is: 2 in a list that is the page, 3 in a list under a heading of its own. */
  level?: 2 | 3;
}

/* A notice in a list: the photograph, then one line that says what it is,
   where and how long, then the name. What kind of notice it is, is a word
   under the photograph, never a sticker on it. */
export function NoticeCard({ notice, now, sizes = '(min-width: 64rem) 31vw, (min-width: 40rem) 46vw, 92vw', lead = false, level = 3 }: CardProps) {
  const signal = signalOf(notice);
  const Title = level === 2 ? 'h2' : 'h3';
  return (
    <article className="card" data-signal={signal}>
      <div className="card__photo">
        <ViewTransition name={photoName(notice)}>
          <PetPhoto photo={notice.photo} alt={photoAlt(notice)} sizes={sizes} lead={lead} />
        </ViewTransition>
      </div>
      <div className="card__text">
        <p className="card__meta">
          <span className="card__sig">{SIGNALS[signal].label}</span>
          <span className="card__place">
            {notice.hood}, {notice.district}
          </span>
          <span className="card__when" suppressHydrationWarning>
            {notice.home ? awayFor(notice) : since(notice, now)}
          </span>
        </p>
        <Title className="card__title">
          <Link href={pathOf(notice.id)}>{headline(notice)}</Link>
        </Title>
        <p className="card__sum">{summary(notice)}</p>
      </div>
    </article>
  );
}
