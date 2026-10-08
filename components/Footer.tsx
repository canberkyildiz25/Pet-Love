'use client';

import { ArrowRight, CircleHalf } from '@phosphor-icons/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AUTHOR, REPO } from '@/lib/site';

function flip() {
  const root = document.documentElement;
  const dark = root.dataset.theme ? root.dataset.theme === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches;
  const next = dark ? 'light' : 'dark';
  root.dataset.theme = next;
  try {
    localStorage.setItem('yuva-theme', next);
  } catch {
    // the choice holds for this visit only
  }
}

/* Pages where the visitor is already in the middle of doing what the back
   cover asks for, or is holding a sheet to print. A page the server makes on
   request is given its address without the closing slash, so both are read. */
const BUSY = /^\/(post|sign-in|join|me)\/?$|\/poster\/?$/;

/** The back cover: what the site is for, said once more, and under it the
    small print. */
export function Footer() {
  const path = usePathname();
  return (
    <footer className="back">
      {!BUSY.test(path) && (
        <div className="wrap back__call">
          <h2>Tell the whole street.</h2>
          <p>A notice takes three short steps, and prints as a poster for the lamp posts.</p>
          <div className="back__acts">
            <Link className="btn btn--light" href="/post/">
              Post a notice
            </Link>
            <Link className="more" href="/guides/the-first-day/">
              <span>What to do on the first day</span>
              <ArrowRight size={18} aria-hidden="true" />
            </Link>
          </div>
        </div>
      )}
      <div className="wrap back__base">
        <div className="back__say">
          <p className="wordmark">Yuva</p>
          <p>Turkish for a nest, and for home. This is a demonstration: the notices on it are examples, and none of the animals in the photographs is lost.</p>
        </div>
        <nav className="back__links" aria-label="About this site">
          <Link href="/notices/">
            <span>Every notice</span>
          </Link>
          <Link href="/guides/">
            <span>Guides</span>
          </Link>
          <Link href="/about/">
            <span>How it works</span>
          </Link>
          <Link href="/credits/">
            <span>Credits</span>
          </Link>
          <a href={AUTHOR.url}>
            <span>Made by {AUTHOR.name}</span>
          </a>
          <a href={REPO}>
            <span>Source on GitHub</span>
          </a>
        </nav>
        <div className="back__end">
          <span>Times are Istanbul time.</span>
          <button type="button" className="back__theme" onClick={flip}>
            <CircleHalf size={18} weight="fill" aria-hidden="true" />
            Light or dark
          </button>
        </div>
      </div>
    </footer>
  );
}
