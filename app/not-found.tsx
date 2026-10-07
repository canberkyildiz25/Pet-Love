import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = { title: 'Not on the board' };

export default function NotFound() {
  return (
    <main id="main" className="wrap">
      <div className="lost-page">
        <h1>That page is not on the board.</h1>
        <p>The address may be mistyped, or the page may have been taken down. The notices are all still where they were.</p>
        <div className="acts">
          <Link className="btn" href="/notices/">
            See every notice
          </Link>
          <Link className="btn btn--line" href="/">
            The front page
          </Link>
        </div>
      </div>
    </main>
  );
}
