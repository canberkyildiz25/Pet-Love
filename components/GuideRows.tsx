import Link from 'next/link';
import { minutes, type Guide } from '@/lib/guides';

/** Guides as a list to choose from: who it is for, what it is called, what it says, how long it takes. */
export function GuideRows({ guides, level }: { guides: Guide[]; level: 2 | 3 }) {
  const Title = level === 2 ? 'h2' : 'h3';
  return (
    <ol className="rows">
      {guides.map((guide) => (
        <li key={guide.slug} data-signal={guide.signal}>
          <span className="label rows__when">
            <i className="dot" aria-hidden="true" />
            {guide.when}
          </span>
          <Title className="rows__title">
            <Link href={`/guides/${guide.slug}/`}>{guide.title}</Link>
          </Title>
          <p>{guide.lede}</p>
          <span className="label rows__min">{minutes(guide)} min</span>
        </li>
      ))}
    </ol>
  );
}
