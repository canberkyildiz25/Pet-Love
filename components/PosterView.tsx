'use client';

import { ArrowLeft, Printer } from '@phosphor-icons/react';
import Link from 'next/link';
import { useState } from 'react';
import { useNotice, useNow } from '@/lib/notices';
import { pathOf } from '@/lib/seed';
import { SITE } from '@/lib/site';
import { useStore } from '@/lib/store';
import { Poster } from './Poster';

/** The poster on screen, as it will print, with the button that prints it. */
export function PosterView({ id }: { id: string }) {
  const notice = useNotice(id);
  const now = useNow();
  const ready = useStore((state) => state.ready);
  const mode = useStore((state) => state.mode);
  const [thrifty, setThrifty] = useState(false);

  if (!notice) {
    if (!ready) return <p className="lost-page" aria-busy="true" />;
    return (
      <div className="lost-page">
        <h1>There is no poster for that notice.</h1>
        <p>Nothing is on the board under {id.toUpperCase()}.</p>
        <div className="acts">
          <Link className="btn" href="/notices/">
            See every notice
          </Link>
        </div>
      </div>
    );
  }

  // a notice kept in one browser has no page anybody else can open, so its sheet carries no code
  const shared = notice.sample || mode === 'remote';
  const link = shared ? `${SITE}${pathOf(notice.id)}` : null;

  return (
    <div className="print">
      <div className="print__side">
        <Link className="crumb" href={pathOf(notice.id)}>
          <ArrowLeft size={18} weight="bold" aria-hidden="true" />
          Back to the notice
        </Link>
        <h1>The poster</h1>
        <p>One A4 sheet. It prints without the rest of this page, edge to edge: choose no margins in the print window if your printer offers it.</p>
        <div className="acts">
          <button type="button" className="btn" onClick={() => window.print()}>
            <Printer size={20} weight="bold" aria-hidden="true" />
            Print
          </button>
        </div>
        <label className="check">
          <input type="checkbox" checked={thrifty} onChange={(event) => setThrifty(event.target.checked)} />
          Save coloured ink
        </label>
      </div>
      <div className="print__sheet">
        <Poster notice={notice} now={now} link={link} thrifty={thrifty} />
      </div>
      <div className="print__side print__more">
        {!shared && (
          <p>This notice is kept in your browser only, so the sheet carries no code to scan: nobody else could open it. With a database connected, every notice gets one.</p>
        )}
        {notice.sample && <p>This is an example notice. Print it to see the sheet, and please do not put it up: the animal on it is not lost.</p>}
        <ol className="print__tips">
          <li>Put the first one on the door of your own building, then work outwards along the streets people walk.</li>
          <li>Hand the sheet to shops and the nearest vet whole. The tabs are for people who cannot stop.</li>
          <li>When the search is over, collect them.</li>
        </ol>
        <p>
          <Link className="link" href="/guides/a-poster-that-gets-read/">
            What makes a poster work
          </Link>
        </p>
      </div>
    </div>
  );
}
