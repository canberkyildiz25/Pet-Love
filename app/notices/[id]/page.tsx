import type { Metadata } from 'next';
import { NoticeView } from '@/components/NoticeView';
import { SEED, pathOf, seedById } from '@/lib/seed';
import { called, signalOf, SIGNALS } from '@/lib/types';
import { firstSentence } from '@/lib/words';

/* The sample notices are built ahead of time. Any other reference is a notice
   somebody posted, which only the browser or the database knows about, so its
   page is made when it is asked for and filled in by the browser. */
export function generateStaticParams() {
  return SEED.map((notice) => ({ id: notice.id.toLowerCase() }));
}

export async function generateMetadata({ params }: PageProps<'/notices/[id]'>): Promise<Metadata> {
  const { id } = await params;
  const notice = seedById(id);
  if (!notice) return { title: `Notice ${id.toUpperCase()}`, robots: { index: false } };
  const signal = SIGNALS[signalOf(notice)].label;
  const title = `${signal}: ${called(notice)}, ${notice.hood}`;
  const description = `${notice.title}. ${firstSentence(notice.marks)} ${notice.hood}, ${notice.district}. An example notice on Yuva.`;
  return {
    title,
    description,
    alternates: { canonical: pathOf(notice.id) },
    openGraph: { title, description, url: pathOf(notice.id), images: notice.photo ? [{ url: notice.photo.src, width: notice.photo.w, height: notice.photo.h }] : undefined },
  };
}

export default async function NoticePage({ params }: PageProps<'/notices/[id]'>) {
  const { id } = await params;
  return (
    <main id="main" className="wrap">
      <NoticeView id={id} />
    </main>
  );
}
