import { ArrowLeft, ArrowRight } from '@phosphor-icons/react/dist/ssr';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { GUIDES, guideBySlug, minutes, SOURCES, type Block } from '@/lib/guides';
import { AUTHOR, SITE } from '@/lib/site';

export const dynamicParams = false;

export function generateStaticParams() {
  return GUIDES.map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata({ params }: PageProps<'/guides/[slug]'>): Promise<Metadata> {
  const { slug } = await params;
  const guide = guideBySlug(slug);
  if (!guide) return {};
  return {
    title: guide.title,
    description: guide.lede,
    alternates: { canonical: `/guides/${guide.slug}/` },
    openGraph: { type: 'article', title: guide.title, description: guide.lede, url: `/guides/${guide.slug}/` },
  };
}

function Piece({ block }: { block: Block }) {
  if ('p' in block) return <p>{block.p}</p>;
  if ('h' in block) return <h2>{block.h}</h2>;
  if ('figure' in block) {
    return (
      <figure className="fig">
        <strong>{block.figure}</strong>
        <figcaption>
          <p>
            {block.says} <cite>{SOURCES[block.from].short}.</cite>
          </p>
        </figcaption>
      </figure>
    );
  }
  const List = block.ordered ? 'ol' : 'ul';
  return (
    <div className="prose__list">
      {block.title && <h3>{block.title}</h3>}
      <List>
        {block.list.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </List>
    </div>
  );
}

export default async function GuidePage({ params }: PageProps<'/guides/[slug]'>) {
  const { slug } = await params;
  const guide = guideBySlug(slug);
  if (!guide) notFound();
  const next = GUIDES[(GUIDES.indexOf(guide) + 1) % GUIDES.length];
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: guide.title,
    description: guide.lede,
    author: { '@type': 'Person', name: AUTHOR.name, url: AUTHOR.url },
    mainEntityOfPage: `${SITE}/guides/${guide.slug}/`,
    citation: guide.sources.map((key) => SOURCES[key].url),
  };

  return (
    <main id="main" className="wrap">
      <article data-signal={guide.signal}>
        <header className="guide-head">
          <Link className="crumb" href="/guides/">
            <ArrowLeft size={18} aria-hidden="true" />
            Guides
          </Link>
          <p className="guide-head__when">
            {guide.when}, {minutes(guide)} minutes to read
          </p>
          <h1>{guide.title}</h1>
          <p>{guide.lede}</p>
        </header>
        <div className="prose">
          {guide.blocks.map((block, index) => (
            <Piece key={index} block={block} />
          ))}
        </div>
        <section className="sources" aria-labelledby="sources-title">
          <h2 id="sources-title">Where this comes from</h2>
          <ol>
            {guide.sources.map((key) => (
              <li key={key}>
                {SOURCES[key].cite}
                <a className="link" href={SOURCES[key].url} rel="noopener">
                  {SOURCES[key].url.replace(/^https?:\/\/(www\.)?/, '')}
                </a>
              </li>
            ))}
          </ol>
        </section>
      </article>
      <Link className="next" href={`/guides/${next.slug}/`}>
        <span className="label">Next guide</span>
        <strong>
          {next.title}
          <ArrowRight size={26} aria-hidden="true" />
        </strong>
      </Link>
      <div className="page-foot" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }} />
    </main>
  );
}
