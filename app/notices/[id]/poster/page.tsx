import type { Metadata } from 'next';
import { PosterView } from '@/components/PosterView';
import { SEED, seedById } from '@/lib/seed';
import { called } from '@/lib/types';

export function generateStaticParams() {
  return SEED.map((notice) => ({ id: notice.id.toLowerCase() }));
}

export async function generateMetadata({ params }: PageProps<'/notices/[id]/poster'>): Promise<Metadata> {
  const { id } = await params;
  const notice = seedById(id);
  // a sheet for a printer is not a page for a search engine
  return { title: notice ? `Poster: ${called(notice)}` : `Poster ${id.toUpperCase()}`, robots: { index: false } };
}

export default async function PosterPage({ params }: PageProps<'/notices/[id]/poster'>) {
  const { id } = await params;
  return (
    <main id="main" className="wrap">
      <PosterView id={id} />
    </main>
  );
}
