import type { Metadata } from 'next';
import { GuideRows } from '@/components/GuideRows';
import { GUIDES } from '@/lib/guides';

export const metadata: Metadata = {
  title: 'Guides',
  description: 'What to do when a pet is lost or found: where to look, what to print, who to call, and which calls to distrust. Each guide names its sources.',
  alternates: { canonical: '/guides/' },
};

export default function Guides() {
  return (
    <main id="main" className="wrap">
      <header className="page-head">
        <h1>Guides</h1>
        <p>What to do, in the order it helps. Every figure comes from a study or an organisation named at the foot of the guide that uses it.</p>
      </header>
      <GuideRows guides={GUIDES} level={2} />
      <div className="page-foot" />
    </main>
  );
}
