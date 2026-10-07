# Yuva

A notice board for lost and found pets in Istanbul. *Yuva* is Turkish for a nest, and for home.

**Live:** https://yuva-istanbul.vercel.app

This started as PetLove, a course project: a listings site on a stock design, with a separate Express server. I rebuilt it from nothing around a different question, which is what somebody needs in the first hour after a pet goes missing. The answer I settled on is a notice that is quick to put up, easy for a stranger to act on, and able to leave the screen as a poster.

## What it does

- **The board.** The newest notices on a split-flap sign, one line turning over every few seconds. It is real text and real links, it pauses on hover, on focus and on its own button, and it stands still when the visitor asks for less motion.
- **Four signals.** Red is lost, blue is found, amber wants a home, green is home again. Each colour means one thing everywhere on the site, and every chip also carries its word.
- **Sightings.** Anybody can say "I have seen them" on a lost notice, with no account: a place, a time and a first name. The sightings build a trail, latest first.
- **The poster.** Every notice prints as one A4 sheet: what the animal looks like in the largest type, a code that opens the notice, and nine tabs to tear off. There is a version that saves coloured ink.
- **Could this be them?** A lost notice is shown beside the open found notices for the same kind of animal, nearest first, and the other way round. The board does not decide. It puts them where one person can see both.
- **Posting.** Three short steps. The photograph is made small in the browser before it goes anywhere, and a tap on it sets where the crop should stay.
- **Closing.** Whoever posted a notice closes it when the animal is home, with a line on how it ended. Without a database, taking a notice down can be undone straight after; with one, the page says first that it is final.
- **Guides.** Six short ones on where to look, what to print, who to call and which calls to distrust. Every figure in them comes from a study or an organisation listed at the foot of the guide.

## Two ways of running

The site asks its own server which of these it is, and behaves accordingly.

**Without a database.** This is the default, and how the public demonstration runs. An account, the notices you post, the sightings you report and the saved list are kept in the browser's storage and nowhere else. A guest account is one click. The example notices ship with the site.

**With MongoDB.** Set `MONGODB_URI` and `YUVA_SECRET` and the same pages talk to an API instead: accounts with bcrypt hashes, a signed session cookie, notices and sightings shared between visitors. If the database is configured but does not answer, the site says so to itself and falls back to the first way instead of failing.

| Variable | What it is for |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | The site's address, printed on posters as the code to scan. Worked out on Vercel; set it for a custom domain. |
| `MONGODB_URI` | Turns the database on. |
| `YUVA_SECRET` | Signs sessions. At least 32 characters. Without it the database stays off. |
| `MONGODB_DB` | The database name. `yuva` if left out. |
| `YUVA_DB=memory` | Keeps accounts and notices in the server's memory, to try the server side with no database installed. |

`.env.example` has the same list.

## Run it

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.

```bash
npm run build && npm start     # the production build
npm run start:memory           # the production build with the in-memory store, on port 5392
npm run lint
npm run typecheck
npm run photos                 # fetch the example photographs again from Wikimedia Commons
```

## How it is put together

Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4, Zustand.

```
app/
  page.tsx                  the front page
  lost/ found/ adopt/       one list per kind; notices/ is all of them
  notices/[id]/             a notice, and notices/[id]/poster/ its printed sheet
  post/ sign-in/ join/ me/  posting and the account
  guides/                   the guides
  api/                      status, auth, notices, sightings
  styles/                   one stylesheet per part of the site
components/                 Board, NoticeCard, NoticeView, Poster, PostWizard, Finder ...
lib/
  seed.ts                   the example notices
  guides.ts                 the guides and their sources
  store.ts                  what the browser keeps, and the one place pages change it
  time.ts                   every clock on the site is Istanbul time
  server/                   the store behind the API: MongoDB, memory, or none
scripts/photos.mjs          fetches the photographs and records who took each one
design.md                   the look, and the rules behind it
```

The example notices keep their dates as "so many days ago", so the board never goes stale and a page built last month reads the same today.

## On the server side

- Passwords are hashed with bcrypt. The session is a signed token in a cookie that scripts cannot read, sent only to this site.
- Every request that changes something has to come from the site's own pages, has to be JSON, and is capped in size.
- Nothing a browser sends is trusted: each field is checked for its kind and its length, and only the fields a notice has are kept. A photograph has to be a small JPEG that the browser made.
- Only whoever posted a notice can close it or take it down.
- Sign-in attempts and sightings are slowed per address. The count is kept in the server's memory, so on a host that runs several copies of the server it slows an attacker down and does not stop one.
- `vercel.json` sets a content security policy and the usual headers.

Without a database none of this is in play, and the account in the browser is a convenience, not a lock: anybody with the browser can read what it keeps.

## What I checked, and what I did not

I checked the built site with scripts that drive a real browser:

- every page at seven widths from 320 to 1920 pixels: no sideways scroll, one main heading, heading order, targets a finger can hit, no control that wraps to two lines;
- the flows: searching, a sighting, posting as a guest with a photograph, closing, reopening, taking down and undoing, an account kept in the browser;
- accessibility rules (axe) on the main pages in light and dark;
- the page with less motion, with scripts turned off, and as a printed sheet, where all 29 example posters fit their A4 page;
- the API and the pages on top of it against the in-memory store: who may do what, what is refused and why;
- the site behind the production security headers.

What I did not check:

- **The MongoDB adapter has not been run against a real MongoDB server.** It sits behind the same interface as the in-memory store the tests use, and it is short, but it is untested.
- **Real phones.** The phone widths are a desktop browser made narrow.
- **Paper.** The poster is checked in the browser's print view, not out of a printer.

## The example notices

They are examples. The stories are made up, and none of the animals in the photographs is lost. The photographs are real ones from Wikimedia Commons; `data/photos.json` records the photographer and the licence of each, and the site's credits page lists them.

The typeface is Barlow by Jeremy Tribby (SIL Open Font License). The icons are Phosphor (MIT). The code on the posters is drawn with qrcode-generator by Kazuhiko Arase (MIT).

Made by [Canberk Yıldız](https://canberkyildiz.netlify.app).
