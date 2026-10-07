import { ArrowRight } from '@phosphor-icons/react/dist/ssr';
import Link from 'next/link';
import { Board } from '@/components/Board';
import { HomeAgain } from '@/components/home/HomeAgain';
import { Legend } from '@/components/home/Legend';
import { OnBoard } from '@/components/home/OnBoard';
import { PosterBand } from '@/components/home/PosterBand';
import { GuideRows } from '@/components/GuideRows';
import { GUIDES } from '@/lib/guides';

export default function Home() {
  return (
    <main id="main">
      <section className="wrap hero">
        <div className="hero__say">
          <h1>Somebody has seen them.</h1>
          <p className="hero__lede">
            Istanbul&rsquo;s notice board for lost and found pets. Put up a notice in three short steps; neighbours print it, pass it on and report what they see.
          </p>
          <p className="hero__acts">
            <Link className="btn" href="/post/?kind=lost">
              I lost a pet
            </Link>
            <Link className="btn btn--line" href="/post/?kind=found">
              I found one
            </Link>
          </p>
          <Legend />
        </div>
        <Board />
      </section>

      <section className="wrap section" aria-labelledby="on-board">
        <div className="section__head">
          <h2 id="on-board">On the board now</h2>
          <p>The colour is the whole code. Red is lost, blue is found, amber wants a home, and green is home again.</p>
        </div>
        <OnBoard />
      </section>

      <section className="band" aria-label="The printed poster">
        <div className="wrap">
          <PosterBand id="YV-2055" />
        </div>
      </section>

      <section className="wrap section" id="home-again" aria-labelledby="home-again-title">
        <div className="section__head">
          <h2 id="home-again-title">Home again</h2>
          <p>A notice closes when the animal is back. How each one ended is the useful part.</p>
        </div>
        <HomeAgain />
      </section>

      <section className="wrap section section--last" aria-labelledby="guides-title">
        <div className="section__head">
          <h2 id="guides-title">Before you go out to look</h2>
          <p>Short guides, with the studies they lean on named at the foot of each one.</p>
        </div>
        <GuideRows guides={GUIDES.slice(0, 4)} level={3} />
        <p className="more">
          <Link className="btn btn--line" href="/guides/">
            All {GUIDES.length} guides
            <ArrowRight size={18} weight="bold" aria-hidden="true" />
          </Link>
        </p>
      </section>
    </main>
  );
}
