'use client';

import { ArrowLeft, BookmarkSimple, Eye, Phone, Printer, ShareNetwork } from '@phosphor-icons/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';
import { matches, useNotice, useNotices, useNow } from '@/lib/notices';
import { pathOf } from '@/lib/seed';
import { Refused, remove, setHome, toggleSaved, useStore } from '@/lib/store';
import { awayFor, clock, dateLine, newest, sightingLine, since } from '@/lib/time';
import { called, signalOf, SIGNALS, type Notice } from '@/lib/types';
import { them, they } from '@/lib/words';
import { Field, Refusal } from './Field';
import { Modal } from './Modal';
import { headline, NoticeCard, photoAlt } from './NoticeCard';
import { PetPhoto } from './PetPhoto';
import { SightingForm } from './SightingForm';
import { toast } from './Toasts';

const BACK = { lost: 'Lost notices', found: 'Found notices', adopt: 'Home wanted' } as const;
const WHEN = { lost: 'Last seen', found: 'Found', adopt: 'Listed' } as const;

/** A notice's own page. It is looked up in the browser, so that a notice
    posted from this browser a minute ago has a page like any other. */
export function NoticeView({ id }: { id: string }) {
  const notice = useNotice(id);
  const ready = useStore((state) => state.ready);
  if (notice) return <Sheet notice={notice} />;
  if (!ready) return <p className="lost-page" aria-busy="true" />;
  return (
    <div className="lost-page">
      <h1>That notice is not on the board.</h1>
      <p>
        There is nothing here under {id.toUpperCase()}. It may have been taken down, or it was posted from another browser: without a database, a notice lives only where it was written.
      </p>
      <div className="acts">
        <Link className="btn" href="/notices/">
          See every notice
        </Link>
      </div>
    </div>
  );
}

function Sheet({ notice }: { notice: Notice }) {
  const now = useNow();
  const all = useNotices();
  const router = useRouter();
  const me = useStore((state) => state.me);
  const mode = useStore((state) => state.mode);
  const saved = useStore((state) => state.saved.includes(notice.id));
  const [seeing, setSeeing] = useState(false);
  const [closing, setClosing] = useState(false);
  const [dropping, setDropping] = useState(false);

  const signal = signalOf(notice);
  const name = called(notice);
  const mine = Boolean(me && notice.owner === me.id);
  const facts = [notice.name ? notice.title : null, notice.sex === 'unknown' ? null : notice.sex, notice.age].filter(Boolean).join(' · ');
  const trail = [...notice.sightings].sort((a, b) => newest(a, b, now || 1));
  const alike = matches(notice, all, now || 1);
  const phone = notice.contact.phone;

  async function share() {
    const url = window.location.href;
    const title = `${SIGNALS[signal].label}: ${name}, ${notice.hood}`;
    if (navigator.share) {
      // the share sheet is its own confirmation; closing it is not an error
      await navigator.share({ title, url }).catch(() => undefined);
      return;
    }
    try {
      await navigator.clipboard.writeText(url);
      toast('The link to this notice is copied.');
    } catch {
      toast('The link could not be copied. It is in the address bar.');
    }
  }

  async function takeDown() {
    setDropping(false);
    try {
      const undo = await remove(notice.id);
      router.push('/me/');
      toast(`The notice for ${name} is down.`, undo ?? undefined);
    } catch (error) {
      toast(error instanceof Refused ? error.message : 'The notice could not be taken down. Try again in a moment.');
    }
  }

  return (
    <>
      <Link className="crumb" href={`/${notice.kind}/`}>
        <ArrowLeft size={18} weight="bold" aria-hidden="true" />
        {BACK[notice.kind]}
      </Link>

      <article className="notice" data-signal={signal}>
        <div className="notice__side">
          <div className="notice__photo">
            <PetPhoto photo={notice.photo} alt={photoAlt(notice)} sizes="(min-width: 60rem) 40rem, 94vw" lead />
          </div>
          {notice.photo?.credit && (
            <p className="notice__credit">
              An example notice: this animal is not lost. Photograph by {notice.photo.credit.by},{' '}
              <a className="link" href={notice.photo.credit.page} rel="noopener">
                Wikimedia Commons
              </a>
              , {notice.photo.credit.licence}.
            </p>
          )}
        </div>

        <div>
          <p className="notice__top">
            <span className="chip">{SIGNALS[signal].label}</span>
            <span className="label notice__ref">{notice.id}</span>
          </p>
          <h1>{headline(notice)}</h1>
          {facts && <p className="notice__kind">{facts}</p>}

          {notice.home && (
            <div className="state">
              <strong>Home {awayFor(notice)}</strong>
              {notice.home.note && <p>{notice.home.note}</p>}
              {mine && (
                <div className="acts">
                  <button type="button" className="btn btn--line btn--small" onClick={() => setHome(notice.id, null).catch(() => toast('The notice could not be opened again. Try again in a moment.'))}>
                    Open the notice again
                  </button>
                </div>
              )}
            </div>
          )}
          {mine && !notice.home && (
            <div className="state">
              <strong>This is your notice</strong>
              <p>Print the poster while the search is fresh. When {they(notice)} {notice.sex === 'unknown' ? 'are' : 'is'} home, close the notice so that people stop looking.</p>
              <div className="acts">
                <button type="button" className="btn btn--small" onClick={() => setClosing(true)}>
                  {notice.kind === 'adopt' ? 'A home is found' : notice.kind === 'found' ? 'The owner is found' : `${name} is home`}
                </button>
                <button type="button" className="btn btn--line btn--small" onClick={() => setDropping(true)}>
                  Take the notice down
                </button>
              </div>
            </div>
          )}

          <p className="notice__text">{notice.text}</p>

          <dl className="facts">
            <div>
              <dt className="label">{WHEN[notice.kind]}</dt>
              <dd suppressHydrationWarning>
                {now ? dateLine(notice, now) : since(notice, now).replace(/^./, (letter) => letter.toUpperCase())}, {clock(notice)}
                {now > 0 && <small>{since(notice, now)}</small>}
              </dd>
            </div>
            <div>
              <dt className="label">Where</dt>
              <dd>
                {notice.place}
                <small>
                  {notice.hood}, {notice.district}
                </small>
              </dd>
            </div>
            <div>
              <dt className="label">Look for</dt>
              <dd>{notice.marks}</dd>
            </div>
          </dl>

          <div className="acts">
            {notice.kind === 'lost' && !notice.home && (
              <button type="button" className="btn btn--signal" onClick={() => setSeeing(true)}>
                <Eye size={20} weight="bold" aria-hidden="true" />I have seen {them(notice)}
              </button>
            )}
            {!notice.home && (
              <Link className={notice.kind === 'lost' ? 'btn btn--line' : 'btn'} href={`${pathOf(notice.id)}poster/`}>
                <Printer size={20} aria-hidden="true" />
                Print the poster
              </Link>
            )}
            <button type="button" className="btn btn--line" onClick={share}>
              <ShareNetwork size={20} aria-hidden="true" />
              Share
            </button>
            <button type="button" className="btn btn--line" aria-pressed={saved} onClick={() => toggleSaved(notice.id)}>
              <BookmarkSimple size={20} weight={saved ? 'fill' : 'regular'} aria-hidden="true" />
              {saved ? 'Saved' : 'Save'}
            </button>
          </div>

          {!notice.home && (
            <section className="reach" aria-labelledby="reach-title">
              <h2 id="reach-title">
                {notice.kind === 'lost' ? `Reach ${notice.contact.name}` : notice.kind === 'found' ? 'Is this one yours?' : `Could you give ${them(notice)} a home?`}
              </h2>
              <p>
                {notice.kind === 'lost' && `If ${name} is in front of you now, call. If you saw ${them(notice)} earlier, add a sighting: the place and the time are what the search needs.`}
                {notice.kind === 'found' && `Tell ${notice.contact.name} a mark that is not in this notice, or send a photograph of the two of you. It is how a finder knows who they are handing an animal to.`}
                {notice.kind === 'adopt' && `Ask ${notice.contact.name} anything first: how ${they(notice)} ${notice.sex === 'unknown' ? 'are' : 'is'} with children, with other animals, and alone in a flat.`}
              </p>
              {phone ? (
                <a className="btn" href={`tel:${phone.replace(/[^+\d]/g, '')}`}>
                  <Phone size={20} weight="fill" aria-hidden="true" />
                  {phone}
                </a>
              ) : (
                <p>
                  {notice.sample
                    ? 'This is an example notice, so there is no number to call. A real notice shows the phone number its poster chose to give.'
                    : `${notice.contact.name} did not give a phone number.${notice.kind === 'lost' ? ' A sighting added here is the way to reach them.' : ''}`}
                </p>
              )}
            </section>
          )}
        </div>
      </article>

      {(notice.kind === 'lost' || trail.length > 0) && (
        <section className="section" aria-labelledby="trail-title" data-signal={signal}>
          <div className="section__head">
            <h2 id="trail-title">Where {name} has been seen</h2>
            {trail.length > 0 && <p>The latest sighting is first. A run of them shows which way an animal is moving.</p>}
          </div>
          {trail.length ? (
            <ol className="trail" reversed>
              {trail.map((sighting) => (
                <li key={sighting.id}>
                  <p className="label trail__when" suppressHydrationWarning>
                    {sightingLine(sighting, now)}
                  </p>
                  <p className="trail__where">{sighting.where}</p>
                  {sighting.note && <p>{sighting.note}</p>}
                  <p className="trail__by">Reported by {sighting.by}</p>
                </li>
              ))}
            </ol>
          ) : (
            <p className="trail-empty">
              Nobody has reported a sighting yet.{!notice.home && ` If you have seen ${them(notice)}, the place and the time are enough.`}
            </p>
          )}
        </section>
      )}

      {alike.length > 0 && (
        <section className="section" aria-labelledby="alike-title">
          <div className="section__head">
            <h2 id="alike-title">Could this be {them(notice)}?</h2>
            <p>
              {notice.kind === 'lost' ? 'Open found notices for the same kind of animal, nearest first.' : 'Open lost notices for the same kind of animal, nearest first.'} The board cannot tell one tabby from
              another. You can.
            </p>
          </div>
          <div className="cards">
            {alike.map((other) => (
              <NoticeCard key={other.id} notice={other} now={now} />
            ))}
          </div>
        </section>
      )}
      <div className="page-foot" />

      <Modal open={seeing} onClose={() => setSeeing(false)} title={`You have seen ${name}`}>
        <SightingForm notice={notice} now={now} onDone={() => setSeeing(false)} />
      </Modal>
      <Modal open={closing} onClose={() => setClosing(false)} title="Close the notice">
        <CloseForm notice={notice} onDone={() => setClosing(false)} />
      </Modal>
      <Modal open={dropping} onClose={() => setDropping(false)} title="Take the notice down?">
        <div className="form">
          <p className="form__note">
            {mode === 'remote'
              ? `The notice for ${name} and its sightings will be deleted. This cannot be undone.`
              : `The notice for ${name} and its sightings will be removed from this browser. You can undo it straight after.`}
          </p>
          <div className="form__acts">
            <button type="button" className="btn" onClick={takeDown}>
              Take it down
            </button>
            <button type="button" className="btn btn--quiet" onClick={() => setDropping(false)}>
              Keep it
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}

/** Closing a notice: one optional line on how it ended, which is what the next searcher reads. */
function CloseForm({ notice, onDone }: { notice: Notice; onDone: () => void }) {
  const [note, setNote] = useState('');
  const [refused, setRefused] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function send(event: FormEvent) {
    event.preventDefault();
    setBusy(true);
    setRefused(null);
    try {
      await setHome(notice.id, note);
      onDone();
    } catch (error) {
      setRefused(error instanceof Refused ? error.message : 'That did not go through. Try again in a moment.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="form" onSubmit={send}>
      <Field label="How did it end?" optional hint="One or two lines: who saw them, where they were. It is the most useful thing on a closed notice.">
        {(wire) => <textarea {...wire} className="input" value={note} onChange={(event) => setNote(event.target.value)} maxLength={280} rows={3} />}
      </Field>
      <Refusal text={refused} />
      <div className="form__acts">
        <button type="submit" className="btn btn--signal" data-signal="home" disabled={busy} data-busy={busy ? '' : undefined}>
          {busy ? 'Closing' : 'Close the notice'}
        </button>
        <button type="button" className="btn btn--quiet" onClick={onDone}>
          Cancel
        </button>
      </div>
    </form>
  );
}
