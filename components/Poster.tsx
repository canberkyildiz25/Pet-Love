import { upper } from '@/lib/places';
import { clock, dateLine } from '@/lib/time';
import { SPECIES, type Notice } from '@/lib/types';
import { them, they } from '@/lib/words';
import { photoAlt } from './NoticeCard';
import { PetPhoto } from './PetPhoto';
import { Qr } from './Qr';

/* The poster: one A4 sheet for a door, a shop window, a vet's board.
   It is drawn in units of its own width, so the same markup is the small one
   on the front page, the one on screen before printing, and the print.

   What the animal looks like is the largest line on it, and the name comes
   after: a stranger cannot use a name. A notice looking for a home is the
   other way round, because there the name is who you are being introduced to. */


const WORD = { lost: 'LOST', found: 'FOUND', adopt: 'HOME WANTED' } as const;
const WHEN = { lost: 'Last seen', found: 'Found', adopt: 'Listed' } as const;

function ask(notice: Notice) {
  if (notice.kind === 'lost') return `Seen ${them(notice)}? Please do not chase. Note the place and the time, and tell us.`;
  if (notice.kind === 'found') return `Is ${notice.sex === 'unknown' ? 'this one' : they(notice)} yours? Tell us a mark that is not on this sheet, or bring a photograph of the two of you.`;
  return `Could you give ${them(notice)} a home? Ask us anything first.`;
}

export interface PosterProps {
  notice: Notice;
  now: number;
  /** The address the code opens. Without one, the sheet carries the phone number alone. */
  link: string | null;
  /** Print in outline, for a printer that is short of colour. */
  thrifty?: boolean;
  sizes?: string;
}

export function Poster({ notice, now, link, thrifty = false, sizes = '(min-width: 52rem) 34rem, 92vw' }: PosterProps) {
  const species = SPECIES.find((entry) => entry.key === notice.species)?.label ?? 'Pet';
  const nameFirst = notice.kind === 'adopt' && Boolean(notice.name);
  const head = nameFirst ? notice.name : notice.title;
  const under = [nameFirst ? notice.title : notice.name ? `Answers to ${notice.name}` : null, notice.sex === 'unknown' ? null : notice.sex, notice.age].filter(Boolean).join(' · ');
  const phone = notice.contact.phone;
  const tab = phone ?? (link ? new URL(link).host : 'yuva');

  return (
    <div className="a4">
      <article className="poster" data-signal={notice.kind} data-thrifty={thrifty ? '' : undefined} data-long={notice.kind === 'adopt' ? '' : undefined}>
        <header className="poster__band">
          <span className="poster__word">{WORD[notice.kind]}</span>
          <span className="poster__kind">
            {upper(species)}
            <br />
            {notice.id}
          </span>
        </header>
        <div className="poster__photo">
          <PetPhoto photo={notice.photo} alt={photoAlt(notice)} sizes={sizes} />
        </div>
        <div className="poster__body">
          <h2 className="poster__name" data-plain={(head?.length ?? 0) > 18 ? '' : undefined}>
            {head}
          </h2>
          {under && <p className="poster__facts">{under}</p>}
          <div className="poster__cols">
            <dl className="poster__list">
              <div>
                <dt>{WHEN[notice.kind]}</dt>
                <dd suppressHydrationWarning>{now ? `${dateLine(notice, now)}, ${clock(notice)}` : clock(notice)}</dd>
              </div>
              <div>
                <dt>Where</dt>
                <dd>
                  {notice.hood}, {notice.district}: {notice.place}
                </dd>
              </div>
              <div>
                <dt>Look for</dt>
                <dd>{notice.marks}</dd>
              </div>
            </dl>
            <div className="poster__reach">
              {link && <Qr text={link} label={`A code that opens notice ${notice.id}`} />}
              <p>
                {link ? 'Point a phone camera here' : `Notice ${notice.id}`}
                {phone ? (
                  <>
                    {link ? ', or call' : ': call'} <strong>{phone}</strong>
                  </>
                ) : (
                  link && (
                    <>
                      {' '}
                      to reach <strong>{notice.contact.name}</strong>
                    </>
                  )
                )}
              </p>
            </div>
          </div>
          <p className="poster__ask">{ask(notice)}</p>
        </div>
        <ul className="poster__tabs" aria-hidden="true">
          {Array.from({ length: 9 }, (_, index) => (
            <li key={index}>
              <span>
                <b>{WORD[notice.kind]}</b> {upper(species)} {notice.id}
              </span>
              <span>{tab}</span>
            </li>
          ))}
        </ul>
      </article>
    </div>
  );
}
