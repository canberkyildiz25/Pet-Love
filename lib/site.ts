/* The site's own address, used for canonical links, the sitemap and the code
   printed on a poster. next.config.ts works it out. */
export const SITE = (process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000').replace(/\/$/, '');

export const NAME = 'Yuva';
export const DESCRIPTION = 'A notice board for lost and found pets in Istanbul. Put up a notice in three short steps; neighbours print it, pass it on and report what they see.';

export const AUTHOR = { name: 'Canberk Yıldız', url: 'https://canberkyildiz.netlify.app' };
export const REPO = 'https://github.com/canberkyildiz25/Pet-Love';
