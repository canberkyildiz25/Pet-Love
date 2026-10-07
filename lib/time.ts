/* Time on a notice board. Every clock on the site shows Istanbul time, on the
   server and in the browser alike, whatever time zone either is in. */

import type { Ago, Notice, Sighting } from './types';

const ZONE = 'Europe/Istanbul';
const DAY = 86_400_000;

type Timed = { at: number; ago?: Ago };

const dayKey = new Intl.DateTimeFormat('en-CA', { timeZone: ZONE, year: 'numeric', month: '2-digit', day: '2-digit' });
/** The day a moment falls on in Istanbul, counted in days since 1970. */
const dayOf = (at: number) => Math.round(Date.parse(`${dayKey.format(at)}T00:00:00Z`) / DAY);

/** How many days ago. A sample says so itself; a real moment is measured against now. */
export function daysSince(item: Timed, now: number) {
  if (item.ago) return item.ago.days;
  return Math.max(0, dayOf(now) - dayOf(item.at));
}

const clockOf = new Intl.DateTimeFormat('en-GB', { timeZone: ZONE, hour: '2-digit', minute: '2-digit', hour12: false });
export const clock = (item: Timed) => item.ago?.clock ?? clockOf.format(item.at);

/** The moment itself. For a sample this needs now, so it is only right in the browser. */
export function moment(item: Timed, now: number) {
  if (!item.ago) return item.at;
  const [hours, minutes] = item.ago.clock.split(':').map(Number);
  const today = dayOf(now) * DAY;
  // midnight in Istanbul is 21:00 UTC the day before (UTC+3, no summer time)
  return today - item.ago.days * DAY + (hours - 3) * 3_600_000 + minutes * 60_000;
}

/** A moment from "so many days ago, at this time in Istanbul", as a sighting form gives it. */
export const at = (days: number, time: string, now: number) => moment({ at: 0, ago: { days, clock: time } }, now);

/** The time in Istanbul now, as 21:40. */
export const clockNow = (now: number) => clockOf.format(now);

/** today, yesterday, 3 days ago */
export function since(item: Timed, now: number) {
  const days = daysSince(item, now);
  if (days === 0) return 'today';
  if (days === 1) return 'yesterday';
  return `${days} days ago`;
}

/** As the board sets it: TODAY, 1 DAY, 12 DAYS */
export function boardSince(item: Timed, now: number) {
  const days = daysSince(item, now);
  if (days === 0) return 'TODAY';
  return days === 1 ? '1 DAY' : `${days} DAYS`;
}

const dateOf = new Intl.DateTimeFormat('en-GB', { timeZone: ZONE, weekday: 'long', day: 'numeric', month: 'long' });
const shortDateOf = new Intl.DateTimeFormat('en-GB', { timeZone: ZONE, weekday: 'short', day: 'numeric', month: 'short' });
/** Saturday 4 October */
export const dateLine = (item: Timed, now: number) => dateOf.format(moment(item, now)).replace(',', '');
/** Sat 4 Oct */
export const shortDate = (item: Timed, now: number) => shortDateOf.format(moment(item, now)).replace(',', '');

/** How long the animal was away, for a notice that is closed. */
export function awayFor(notice: Notice) {
  if (!notice.home) return null;
  const days = notice.home.after ?? Math.max(0, dayOf(notice.home.at) - dayOf(notice.at));
  if (days === 0) return 'the same day';
  return days === 1 ? 'after 1 day' : `after ${days} days`;
}

/** Newest first. A sample's age stands in for its moment. */
export function newest(a: Timed, b: Timed, now: number) {
  return moment(b, now) - moment(a, now);
}

export const sightingLine = (sighting: Sighting, now: number) => `${since(sighting, now)}, ${clock(sighting)}`;
