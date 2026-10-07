import type { Kind } from '@/lib/types';
import { Finder } from './Finder';

const HEAD: Record<Kind | 'all', { title: string; lede: string }> = {
  all: { title: 'Every notice', lede: 'Lost, found and looking for a home, newest first.' },
  lost: {
    title: 'Lost',
    lede: 'Pets that are missing now. If you have seen one, open its notice and say where and when. That is the whole of the help.',
  },
  found: {
    title: 'Found',
    lede: 'Animals somebody has taken in, or has seen and could not hold. If one is yours, open its notice.',
  },
  adopt: {
    title: 'Home wanted',
    lede: 'Animals that need somewhere to live: off the street, out of a foster home, or because their person no longer can.',
  },
};

/** One of the four lists: every notice, or one kind. */
export function ListPage({ kind }: { kind: Kind | null }) {
  const head = HEAD[kind ?? 'all'];
  return (
    <main id="main" className="wrap">
      <header className="page-head">
        <h1>{head.title}</h1>
        <p>{head.lede}</p>
      </header>
      <Finder kind={kind} />
      <div className="page-foot" />
    </main>
  );
}

export const listMeta = (kind: Kind | null) => {
  const head = HEAD[kind ?? 'all'];
  return { title: kind ? `${head.title} pets in Istanbul` : 'Every notice', description: head.lede, alternates: { canonical: kind ? `/${kind}/` : '/notices/' } };
};
