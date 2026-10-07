'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useNotices, useNow } from '@/lib/notices';
import { pathOf } from '@/lib/seed';
import { forget, signOut, useStore } from '@/lib/store';
import { awayFor, since } from '@/lib/time';
import { signalOf, SIGNALS } from '@/lib/types';
import { Modal } from './Modal';
import { headline, NoticeCard, photoAlt } from './NoticeCard';
import { PetPhoto } from './PetPhoto';

/** Your own page: the notices you posted, the ones you saved, and what this browser keeps. */
export function MyNotices() {
  const router = useRouter();
  const ready = useStore((state) => state.ready);
  const me = useStore((state) => state.me);
  const mode = useStore((state) => state.mode);
  const saved = useStore((state) => state.saved);
  const notices = useNotices();
  const now = useNow();
  const [forgetting, setForgetting] = useState(false);

  if (!ready) return <p aria-busy="true" />;

  const mine = me ? notices.filter((notice) => notice.owner === me.id) : [];
  const kept = saved.map((id) => notices.find((notice) => notice.id === id)).filter((notice) => notice !== undefined);

  return (
    <>
      <header className="page-head me-head">
        <div>
          <h1>{me ? `${me.name}’s notices` : 'Your notices'}</h1>
          <p>{me ? 'What you have put on the board, and what you are keeping an eye on.' : 'Sign in to see the notices you have posted. The ones you saved are below either way.'}</p>
        </div>
        <div className="acts">
          {me ? (
            <>
              <Link className="btn" href="/post/">
                Post a notice
              </Link>
              <button
                type="button"
                className="btn btn--line"
                onClick={async () => {
                  await signOut();
                  router.push('/');
                }}
              >
                Sign out
              </button>
            </>
          ) : (
            <>
              <Link className="btn" href="/sign-in/">
                Sign in
              </Link>
              <Link className="btn btn--line" href="/join/">
                Create an account
              </Link>
            </>
          )}
        </div>
      </header>

      {me && (
        <section aria-labelledby="mine-title">
          <h2 id="mine-title" className="sr-only">
            Posted by you
          </h2>
          {mine.length ? (
            <ul className="mine">
              {mine.map((notice) => {
                const signal = signalOf(notice);
                return (
                  <li key={notice.id} data-signal={signal}>
                    <div className="mine__photo">
                      <PetPhoto photo={notice.photo} alt={photoAlt(notice)} sizes="4.5rem" />
                    </div>
                    <div>
                      <h3>{headline(notice)}</h3>
                      <p className="mine__line">
                        <span className="chip">{SIGNALS[signal].label}</span>
                        <span className="label">{notice.id}</span>
                        <span suppressHydrationWarning>
                          {notice.home ? `home ${awayFor(notice)}` : since(notice, now)} · {notice.sightings.length === 1 ? '1 sighting' : `${notice.sightings.length} sightings`}
                        </span>
                      </p>
                    </div>
                    <div className="mine__acts">
                      <Link className="btn btn--line btn--small" href={pathOf(notice.id)}>
                        Open
                      </Link>
                      {!notice.home && (
                        <Link className="btn btn--line btn--small" href={`${pathOf(notice.id)}poster/`}>
                          Poster
                        </Link>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="empty">
              <h2>You have not posted a notice.</h2>
              <p>It takes three short steps, and it can be closed or taken down from here at any time.</p>
              <div className="acts">
                <Link className="btn" href="/post/">
                  Post a notice
                </Link>
              </div>
            </div>
          )}
        </section>
      )}

      <section className="section" aria-labelledby="saved-title">
        <div className="section__head">
          <h2 id="saved-title">Saved</h2>
          <p>Notices you are keeping an eye on. The list is kept in this browser.</p>
        </div>
        {kept.length ? (
          <div className="cards">
            {kept.map((notice) => (
              <NoticeCard key={notice.id} notice={notice} now={now} />
            ))}
          </div>
        ) : (
          <p className="trail-empty">Nothing saved yet. Every notice has a Save button beside Share.</p>
        )}
      </section>

      <section className="panel" aria-labelledby="kept-title">
        <h2 id="kept-title">What this browser keeps</h2>
        <p>
          {mode === 'local'
            ? 'Everything you do here: the account, the notices you post, the sightings you report and the saved list. None of it leaves this browser, and clearing it cannot be undone.'
            : 'The saved list, and any sighting you report on an example notice. Your account and your notices are in the database.'}
        </p>
        <button type="button" className="btn btn--line" onClick={() => setForgetting(true)}>
          Forget everything
        </button>
      </section>
      <div className="page-foot" />

      <Modal open={forgetting} onClose={() => setForgetting(false)} title="Forget everything?">
        <div className="form">
          <p className="form__note">
            {mode === 'local'
              ? 'This removes the account, every notice posted from this browser, the sightings and the saved list. It cannot be undone.'
              : 'This removes the saved list and the sightings kept in this browser, and signs you out. Your notices in the database are not touched.'}
          </p>
          <div className="form__acts">
            <button
              type="button"
              className="btn"
              onClick={async () => {
                setForgetting(false);
                if (mode === 'remote') await signOut();
                forget();
              }}
            >
              Forget it all
            </button>
            <button type="button" className="btn btn--quiet" onClick={() => setForgetting(false)}>
              Keep it
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
}
