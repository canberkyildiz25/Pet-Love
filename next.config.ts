import path from 'node:path';
import type { NextConfig } from 'next';

/* The address the site is served from: set by hand, or the one Vercel gives
   the project, or this machine. It is printed on posters, so it is settled
   here once, for the server and the browser alike. */
const site = process.env.NEXT_PUBLIC_SITE_URL ?? (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : 'http://localhost:3000');

const config: NextConfig = {
  turbopack: { root: path.resolve(__dirname) },
  env: { NEXT_PUBLIC_SITE_URL: site },
  trailingSlash: true,
  images: {
    // The sample photographs are files in public/pets, at most 1,600 pixels
    // wide. A photograph a visitor adds never comes through here: it is made
    // small in their browser and kept as it is.
    formats: ['image/webp'],
    // few widths and one quality, held for a month
    deviceSizes: [640, 960, 1280, 1600],
    imageSizes: [160, 320, 480],
    qualities: [80],
    minimumCacheTTL: 2678400,
  },
  // the database driver is used on the server only, and only when an address for it is set
  serverExternalPackages: ['mongodb'],
};

export default config;
