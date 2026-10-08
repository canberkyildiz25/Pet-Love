import Link from 'next/link';
import { minutes, type Guide } from '@/lib/guides';

/** Guides as a contents page: what each is called, what it says, how long it takes to read. */
export function GuideRows({ guides, level }: { guides: Guide[]; level: 2 | 3 }) {
  const Title = level === 2 ? 'h2' : 'h3';
  return (
    <ol className="reads">
      {guides.map((guide) => (
        <li key={guide.slug}>
          <Title className="reads__title">
            <Link href={`/guides/${guide.slug}/`}>
              <span>{guide.title}</span>
            </Link>
          </Title>
          <p className="reads__lede">{guide.lede}</p>
          <p className="reads__min">{minutes(guide)} minutes</p>
        </li>
      ))}
    </ol>
  );
}
