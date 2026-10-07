import type { MetadataRoute } from 'next';
import { DESCRIPTION } from '@/lib/site';

export const dynamic = 'force-static';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Yuva · Lost and found pets in Istanbul',
    short_name: 'Yuva',
    description: DESCRIPTION,
    start_url: '/',
    display: 'standalone',
    background_color: '#fafbfc',
    theme_color: '#141a26',
    icons: [
      { src: '/icon.svg', sizes: 'any', type: 'image/svg+xml' },
      { src: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  };
}
