import type { Metadata } from 'next';
import Link from 'next/link';
import { ModeNote } from '@/components/ModeNote';
import { AUTHOR, REPO } from '@/lib/site';
import { SIGNALS, type Signal } from '@/lib/types';

export const metadata: Metadata = {
  title: 'How it works',
  description: 'What Yuva does with a notice, what the four kinds of notice are, what on the site is an example, and where what you type is kept.',
  alternates: { canonical: '/about/' },
};

const KEY: { signal: Signal; says: string }[] = [
  { signal: 'lost', says: 'Missing now. The notice asks one thing of you: if you have seen them, say where and when.' },
  { signal: 'found', says: 'Somebody has the animal, or has seen it and could not hold it, and is looking for whoever lost it.' },
  { signal: 'adopt', says: 'Needs somewhere to live: off the street, out of a foster home, or because their person no longer can.' },
  { signal: 'home', says: 'The notice is closed, whatever it was before. It stays readable, with a line on how it ended.' },
];

export default function About() {
  return (
    <main id="main" className="wrap">
      <header className="page-head">
        <h1>How it works</h1>
        <p>Yuva is a notice board for lost and found pets in Istanbul, built as a demonstration. This page says what it does, what on it is real, and where what you type is kept.</p>
      </header>

      <div className="prose">
        <h2>A notice, and what happens to it</h2>
        <p>A notice says three things: what the animal looks like, where, and when. It goes on the board at once, and it prints as an A4 poster with a code that opens it.</p>
        <p>
          Anybody can add a sighting to a lost notice, without an account: a place, a time and a first name. Sightings build a trail, latest first, and a trail shows which way an animal is moving.
        </p>
        <p>
          A lost notice is set beside the open found notices for the same kind of animal, nearest first, and a found notice beside the lost ones. The board does not decide whether two notices are the same
          animal. It puts them where one person can see both.
        </p>
        <p>When the animal is home, whoever posted the notice closes it with a line about how it ended. Closed notices stay readable, because how one search ended is useful to the next.</p>

        <h2>The four kinds of notice</h2>
        <dl className="key">
          {KEY.map(({ signal, says }) => (
            <div key={signal} data-signal={signal}>
              <dt>
                <span className="chip">{SIGNALS[signal].label}</span>
              </dt>
              <dd>{says}</dd>
            </div>
          ))}
        </dl>
        <p>Only a lost notice is set in red, the colour of the word on a street poster. Colour is never the only sign: every notice says what it is in words.</p>

        <h2>What is real here, and what is not</h2>
        <p>
          The notices that ship with the site are examples. The stories are made up, and none of the animals in the photographs is lost. The photographs are real ones from Wikimedia Commons, and each is
          credited on its notice and on the <Link className="link" href="/credits/">credits page</Link>.
        </p>
        <p>
          The <Link className="link" href="/guides/">guides</Link> are real. Every figure in them comes from a published study or a named organisation, listed at the foot of the guide that uses it.
        </p>

        <h2>Where what you type is kept</h2>
        <p>The site runs in one of two ways, depending on whether a database is connected to it.</p>
        <ModeNote />
        <h3>Without a database</h3>
        <p>
          This is how the public demonstration runs. An account, the notices you post, the sightings you report and the saved list are kept in your browser&rsquo;s own storage, and nothing is sent to a
          server. A password is stretched with PBKDF2 before it is stored. What you post can be seen in that browser only.
        </p>
        <h3>With a database</h3>
        <p>
          Accounts and notices are stored in MongoDB. Passwords are kept as bcrypt hashes, and the session is a signed cookie that scripts on the page cannot read. The same pages then talk to an API
          instead of to the browser&rsquo;s storage.
        </p>
        <p>Either way, a photograph you add is made small in your browser first, and the site carries no trackers, no advertising and no scripts from anybody else.</p>

        <h2>Who made it</h2>
        <p>
          I am{' '}
          <a className="link" href={AUTHOR.url}>
            {AUTHOR.name}
          </a>
          . The first version of this project was a course exercise built on a stock design. I rebuilt it from nothing around a different question: what does somebody need in the first hour after a pet
          goes missing? The source is on{' '}
          <a className="link" href={REPO}>
            GitHub
          </a>
          .
        </p>
      </div>
      <div className="page-foot" />
    </main>
  );
}
