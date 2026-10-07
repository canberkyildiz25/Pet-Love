import type { MetadataRoute } from 'next';
import { GUIDES } from '@/lib/guides';
import { SEED, pathOf } from '@/lib/seed';
import { SITE } from '@/lib/site';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = ['/', '/notices/', '/lost/', '/found/', '/adopt/', '/guides/', '/about/', '/credits/', '/post/', ...GUIDES.map((guide) => `/guides/${guide.slug}/`), ...SEED.map((notice) => pathOf(notice.id))];
  return paths.map((path) => ({ url: `${SITE}${path}` }));
}
