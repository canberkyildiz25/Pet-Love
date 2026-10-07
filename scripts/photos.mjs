/* The photographs of the sample notices, from Wikimedia Commons.

   The notices on the site are examples, and so are the animals: none of
   them is lost. Each photograph was chosen by looking, is fetched here at
   1600 pixels on its longer side, and is saved in public/pets with its
   maker, licence and source recorded in data/photos.json.

   focus: where the animal's face is, as percentages from the left and the
   top, set by eye. A tile is cropped around it.

   usage: npm run photos */
import { mkdirSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const root = path.resolve(import.meta.dirname, '..');
const UA = 'YuvaSnapshot/1.0 (https://github.com/canberkyildiz25/Pet-Love)';
const get = (url) => fetch(url, { headers: { 'User-Agent': UA, 'Api-User-Agent': UA } });
const pause = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const PHOTOS = [
  // lost
  { key: 'karamel', file: 'Josi, Wikimedia Austria - March 2015.jpg', focus: [46, 40] },
  { key: 'pamuk', file: 'TUA Akkedi Vanessa (15662006542).jpg', focus: [50, 36] },
  { key: 'zeytin', file: 'EbonyCatz Joyous Jasmine.jpg', focus: [30, 30] },
  { key: 'corap', file: 'Tuxedo Cat.jpg', focus: [50, 35] },
  { key: 'boncuk', file: '3 year old calico cat.jpg', focus: [62, 30] },
  { key: 'mavi', file: 'Melopsittacus undulatus -blue -pet-8.jpg', focus: [50, 30] },
  { key: 'pasa', file: '20160327 pies nierasowy 3693.jpg', focus: [50, 45] },
  { key: 'tarcin', file: 'Trix the rabbit.jpg', focus: [72, 40] },
  { key: 'duman', file: 'CertosinoFemmina.JPG', focus: [50, 25] },
  { key: 'findik', file: 'DFC 0440 Portrait of a sandy-coated dog with a weathered collar looking off to the side against a beach backdrop.jpg', focus: [55, 35] },
  { key: 'limon', file: 'Tuxedo cat bi-color paws.JPG', focus: [50, 35] },
  // found
  { key: 'persian', file: 'Persian stray.JPG', focus: [45, 45] },
  { key: 'tabby-kitten', file: 'Cat, Istanbul (P1180136).jpg', focus: [40, 40] },
  { key: 'longhair', file: 'Cat, Istanbul (20191211-IMG 20191211 132409).jpg', focus: [45, 55] },
  { key: 'old-dog', file: 'Kangal.jpg', focus: [38, 32] },
  { key: 'courtyard-kitten', file: 'Straycat Istanbul.JPG', focus: [50, 55] },
  { key: 'tan-dog', file: 'Dog hybrid from Venezuela.jpg', focus: [40, 30] },
  { key: 'tuxedo', file: 'Handsome the tuxedo cat.jpg', focus: [88, 45] },
  // looking for a home
  { key: 'fistik', file: 'Janosch lächelt.JPG', focus: [50, 45] },
  { key: 'kestane', file: 'Brown street dog 03.jpg', focus: [45, 35] },
  { key: 'aslan', file: 'Anatolian Shepherd Dog - Kangal köpeği 01.jpg', focus: [50, 30] },
  { key: 'sarman', file: 'Cat near Kabataş in Istanbul, 20260605 1734 1298.jpg', focus: [28, 45] },
  { key: 'lokum', file: 'A Calico cat.jpg', focus: [50, 30] },
  { key: 'portakal', file: 'Golden tabby and white kitten n01.jpg', focus: [38, 25] },
  { key: 'golge', file: 'Cat near Kabataş in Istanbul, 20260605 1743 1302.jpg', focus: [26, 35] },
  { key: 'mirmir', file: 'Istanbul - cat of Sultanahmet.jpg', focus: [60, 30] },
  { key: 'pofuduk', file: '2018-06-22 AT Wien 13 Hietzing, Tiergarten Schönbrunn, Oryctolagus cuniculus f. domesticus (49019471113).jpg', focus: [40, 45] },
  { key: 'cakil', file: 'Sera Tuxedo Cat.jpg', focus: [55, 50] },
  { key: 'badem', file: 'Brown street dog 01.jpg', focus: [45, 40] },
];

const FREE = /^(cc0|cc[ -]by|public domain|pd\b|attribution|fal\b)/i;
const strip = (html) =>
  String(html ?? '')
    .replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
/* Commons records the author as free text: keep the name, drop where they are from. */
const author = (html) =>
  strip(html)
    .replace(/https?:\/\/\S+/g, '')
    .replace(/^User:/i, '')
    .replace(/\s+from\s+[A-Z].*$/, '')
    .trim()
    .slice(0, 60) || 'Unknown author';

const store = path.join(root, 'public', 'pets');
mkdirSync(store, { recursive: true });
mkdirSync(path.join(root, 'data'), { recursive: true });

const photos = {};
for (const photo of PHOTOS) {
  const res = await get(
    `https://commons.wikimedia.org/w/api.php?action=query&format=json&formatversion=2&prop=imageinfo&iiprop=url|size|extmetadata&iiurlwidth=1920&titles=${encodeURIComponent(`File:${photo.file}`)}`,
  );
  const info = (await res.json()).query?.pages?.[0]?.imageinfo?.[0];
  if (!info) throw new Error(`not on Commons: ${photo.file}`);
  const meta = info.extmetadata ?? {};
  const licence = strip(meta.LicenseShortName?.value);
  if (!FREE.test(licence)) throw new Error(`not freely licensed: ${photo.file} (${licence})`);

  const file = await get(info.thumburl && info.thumbwidth < info.width ? info.thumburl : info.url);
  if (!file.ok) throw new Error(`${file.status} for ${photo.file}`);
  const picture = await sharp(Buffer.from(await file.arrayBuffer()))
    .rotate()
    .resize({ width: 1600, height: 1600, fit: 'inside', withoutEnlargement: true })
    .jpeg({ quality: 80, mozjpeg: true })
    .toBuffer({ resolveWithObject: true });
  writeFileSync(path.join(store, `${photo.key}.jpg`), picture.data);

  photos[photo.key] = {
    src: `/pets/${photo.key}.jpg`,
    w: picture.info.width,
    h: picture.info.height,
    fx: photo.focus[0],
    fy: photo.focus[1],
    title: photo.file,
    by: author(meta.Artist?.value),
    licence,
    licenceUrl: meta.LicenseUrl?.value ?? null,
    page: info.descriptionurl,
  };
  console.log(`  ${photo.key}: ${photos[photo.key].by}, ${licence}, ${picture.info.width}x${picture.info.height}`);
  await pause(250);
}

writeFileSync(path.join(root, 'data', 'photos.json'), `${JSON.stringify({ fetched: new Date().toISOString().slice(0, 10), photos }, null, 1)}\n`);
console.log(`photos: ${PHOTOS.length}`);
