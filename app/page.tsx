import { ArrowRight } from '@phosphor-icons/react/dist/ssr';
import Link from 'next/link';
import { GuideRows } from '@/components/GuideRows';
import { Cover } from '@/components/home/Cover';
import { Fact } from '@/components/home/Fact';
import { HomeAgain } from '@/components/home/HomeAgain';
import { Index } from '@/components/home/Index';
import { Opening } from '@/components/home/Opening';
import { PosterBand } from '@/components/home/PosterBand';
import { GUIDES } from '@/lib/guides';

export default function Home() {
  return (
    <main id="main">
      <Cover />
      <Opening />

      <section className="wrap board" aria-labelledby="on-board">
        <Index />
      </section>

      <Fact />

      <section className="band" aria-label="The printed poster">
        <PosterBand id="YV-2055" />
      </section>

      <section className="wrap again" id="home-again" aria-labelledby="home-again-title">
        <HomeAgain />
      </section>

      <section className="wrap reading" aria-labelledby="guides-title">
        <header className="reading__head">
          <h2 id="guides-title">Before you go out to look</h2>
          <p>Short guides, each with its sources: where a frightened animal goes, what a poster has to say, and which phone calls to put down.</p>
          <Link className="more" href="/guides/">
            <span>All {GUIDES.length} guides</span>
            <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </header>
        <GuideRows guides={GUIDES.slice(0, 4)} level={3} />
      </section>
    </main>
  );
}
