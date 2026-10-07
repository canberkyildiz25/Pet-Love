'use client';

import { CircleHalf } from '@phosphor-icons/react';
import Link from 'next/link';
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

export function Footer() {
  return (
    <footer className="foot">
      <div className="wrap foot__in">
        <div className="foot__say">
          <strong>Yuva is Turkish for a nest, and for home.</strong>
          <p>This is a demonstration. The notices on it are examples, and none of the animals in the photographs is lost.</p>
        </div>
        <nav className="foot__links" aria-label="About this site">
          <Link href="/notices/">All notices</Link>
          <Link href="/guides/">Guides</Link>
          <Link href="/about/">How it works</Link>
          <Link href="/credits/">Photo credits</Link>
          <a href={AUTHOR.url}>Made by {AUTHOR.name}</a>
          <a href={REPO}>Source on GitHub</a>
        </nav>
        <div className="foot__base">
          <span>Times are Istanbul time.</span>
          <button type="button" className="foot__theme" onClick={flip}>
            <CircleHalf size={20} weight="fill" aria-hidden="true" />
            Light or dark
          </button>
        </div>
      </div>
    </footer>
  );
}
