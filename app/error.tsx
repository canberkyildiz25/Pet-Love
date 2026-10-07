'use client';

import Link from 'next/link';

export default function Failed({ reset }: { error: Error; reset: () => void }) {
  return (
    <main id="main" className="wrap">
      <div className="lost-page">
        <h1>This page did not load properly.</h1>
        <p>Something went wrong while putting it together. Nothing you have posted is affected. Try once more, and if it happens again, go back to the front page.</p>
        <div className="acts">
          <button type="button" className="btn" onClick={reset}>
            Try again
          </button>
          <Link className="btn btn--line" href="/">
            The front page
          </Link>
        </div>
      </div>
    </main>
  );
}
