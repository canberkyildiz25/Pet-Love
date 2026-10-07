/* What the browser keeps, and the one place the pages change it.

   The site runs in one of two ways, and asks the server which:

   - local: there is no database. Accounts, the notices a visitor posts and
     the sightings they report are kept in this browser's storage and nowhere
     else. This is how the public demonstration runs.
   - remote: a database is connected. The same actions go to the API, and the
     browser keeps only what is a convenience: the saved list, and sightings
     reported on the sample notices, which are not in the database.

   Either way the sample notices ship with the site and are never written to. */

import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import type { Notice, Sighting } from './types';

export interface Me {
  id: string;
  name: string;
  email: string;
}
interface Account extends Me {
  salt: string;
  hash: string;
}

/** What somebody fills in to post a notice. The rest is added when it is posted. */
export type Draft = Pick<Notice, 'kind' | 'species' | 'name' | 'title' | 'sex' | 'age' | 'marks' | 'district' | 'hood' | 'place' | 'at' | 'text' | 'photo'> & { phone?: string };

interface State {
  /** True once the stored state has been read; before that, pages show the samples alone. */
  ready: boolean;
  mode: 'local' | 'remote';
  me: Me | null;
  accounts: Account[];
  /** Notices posted from this browser while there is no database. */
  mine: Notice[];
  /** Notices from the database, when there is one. */
  remote: Notice[];
  /** Sightings reported from this browser on the sample notices. */
  seen: Record<string, Sighting[]>;
  saved: string[];
}

/* A browser gives a site a few megabytes, and a photograph can use a good
   share of that. When there is no room left the write is dropped, and the
   action that caused it finds out and says so. */
let full = false;
const room = {
  getItem: (name: string) => localStorage.getItem(name),
  removeItem: (name: string) => localStorage.removeItem(name),
  setItem: (name: string, value: string) => {
    try {
      localStorage.setItem(name, value);
      full = false;
    } catch {
      full = true;
    }
  },
};

export const useStore = create<State>()(
  persist(
    (): State => ({ ready: false, mode: 'local', me: null, accounts: [], mine: [], remote: [], seen: {}, saved: [] }),
    {
      name: 'yuva',
      version: 1,
      storage: createJSONStorage(() => room),
      skipHydration: true,
      partialize: (state) => ({ me: state.me, accounts: state.accounts, mine: state.mine, seen: state.seen, saved: state.saved }),
    },
  ),
);

const set = useStore.setState;
const get = useStore.getState;

export class Refused extends Error {}

/* ---------- small tools ---------- */

const GUEST = 'guest@yuva.invalid';
const LETTERS = 'ABCDEFGHJKLMNPRSTUVWXYZ';
const MARKS = '23456789ABCDEFGHJKLMNPRSTUVWXYZ';
const pick = (from: string) => from[crypto.getRandomValues(new Uint32Array(1))[0] % from.length];
/** A reference for a new notice, like YV-K7M2: a letter first, so it never looks like a sample's number. */
const reference = () => `YV-${pick(LETTERS)}${pick(MARKS)}${pick(MARKS)}${pick(MARKS)}`;
const token = () => Array.from(crypto.getRandomValues(new Uint8Array(12)), (byte) => byte.toString(16).padStart(2, '0')).join('');

/* A demo account's password never leaves the browser, and is not kept as
   typed: it is stretched with PBKDF2 and only the result is stored. */
async function stretch(password: string, salt: string) {
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', hash: 'SHA-256', salt: new TextEncoder().encode(salt), iterations: 120_000 }, key, 256);
  return Array.from(new Uint8Array(bits), (byte) => byte.toString(16).padStart(2, '0')).join('');
}

async function ask<T>(path: string, method: string, body?: unknown): Promise<T> {
  const response = await fetch(path, {
    method,
    headers: body === undefined ? undefined : { 'content-type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body),
    credentials: 'same-origin',
  });
  const answer = (await response.json().catch(() => ({}))) as { message?: string } & T;
  if (!response.ok) throw new Refused(answer.message ?? 'That did not go through. Try again in a moment.');
  return answer;
}

/* ---------- starting up ---------- */

let started: Promise<void> | null = null;

/** Reads what the browser has kept, then asks the server how the site is running. */
export function start() {
  started ??= (async () => {
    await useStore.persist.rehydrate();
    try {
      const { db } = await ask<{ db: string }>('/api/status/', 'GET');
      if (db !== 'none') {
        const [me, notices] = await Promise.all([
          ask<{ me: Me | null }>('/api/auth/me/', 'GET').catch(() => ({ me: null })),
          ask<{ notices: Notice[] }>('/api/notices/', 'GET').catch(() => ({ notices: [] })),
        ]);
        set({ mode: 'remote', me: me.me, remote: notices.notices });
      }
    } catch {
      // no answer: carry on with what the browser has
    }
    set({ ready: true });
  })();
  return started;
}

/* ---------- accounts ---------- */

export async function join(name: string, email: string, password: string) {
  const address = email.trim().toLowerCase();
  if (get().mode === 'remote') {
    const { me } = await ask<{ me: Me }>('/api/auth/join/', 'POST', { name, email: address, password });
    set({ me });
    return;
  }
  if (address === GUEST || get().accounts.some((account) => account.email === address)) throw new Refused('There is already an account with that address in this browser. Sign in instead.');
  const salt = token();
  const account: Account = { id: token(), name: name.trim(), email: address, salt, hash: await stretch(password, salt) };
  set((state) => ({ accounts: [...state.accounts, account], me: { id: account.id, name: account.name, email: account.email } }));
}

export async function signIn(email: string, password: string) {
  const address = email.trim().toLowerCase();
  if (get().mode === 'remote') {
    const { me } = await ask<{ me: Me }>('/api/auth/sign-in/', 'POST', { email: address, password });
    set({ me });
    return;
  }
  const account = get().accounts.find((candidate) => candidate.email === address && candidate.hash);
  // the same answer for a wrong address and a wrong password
  if (!account || (await stretch(password, account.salt)) !== account.hash) throw new Refused('That address and password do not match an account in this browser.');
  set({ me: { id: account.id, name: account.name, email: account.email } });
}

/** A guest account, for looking round without making one. It lives in this browser like any other. */
export function guest() {
  if (get().mode === 'remote') throw new Refused('A guest account is only for the demonstration without a database.');
  const known = get().accounts.find((account) => account.email === GUEST);
  const account: Account = known ?? { id: token(), name: 'Guest', email: GUEST, salt: '', hash: '' };
  set((state) => ({ accounts: known ? state.accounts : [...state.accounts, account], me: { id: account.id, name: account.name, email: account.email } }));
}

export async function signOut() {
  if (get().mode === 'remote') await ask('/api/auth/sign-out/', 'POST').catch(() => undefined);
  set({ me: null });
}

/* ---------- notices ---------- */

export async function post(draft: Draft): Promise<Notice> {
  const me = get().me;
  if (!me) throw new Refused('Sign in to post a notice.');
  if (get().mode === 'remote') {
    const { notice } = await ask<{ notice: Notice }>('/api/notices/', 'POST', draft);
    set((state) => ({ remote: [notice, ...state.remote] }));
    return notice;
  }
  const { phone, ...rest } = draft;
  const taken = new Set(get().mine.map((notice) => notice.id));
  let id = reference();
  while (taken.has(id)) id = reference();
  const notice: Notice = { ...rest, id, home: null, contact: { name: me.name.split(' ')[0], ...(phone ? { phone } : {}) }, sightings: [], sample: false, owner: me.id };
  set((state) => ({ mine: [notice, ...state.mine] }));
  if (full) {
    set((state) => ({ mine: state.mine.filter((kept) => kept.id !== id) }));
    throw new Refused(notice.photo ? 'This browser has no room left to keep the photograph. Post without it, or take down an older notice first.' : 'This browser has no room left to keep another notice.');
  }
  return notice;
}

function replace(id: string, change: (notice: Notice) => Notice) {
  set((state) => ({
    mine: state.mine.map((notice) => (notice.id === id ? change(notice) : notice)),
    remote: state.remote.map((notice) => (notice.id === id ? change(notice) : notice)),
  }));
}

/** Closes a notice: the animal is home. Passing null opens it again. */
export async function setHome(id: string, note: string | null) {
  const home = note === null ? null : { at: Date.now(), note: note.trim() };
  if (get().mode === 'remote') {
    const { notice } = await ask<{ notice: Notice }>(`/api/notices/${id.toLowerCase()}/`, 'PATCH', { home: home ? { note: home.note } : null });
    replace(id, () => notice);
    return;
  }
  replace(id, (notice) => ({ ...notice, home }));
}

/** Takes a notice down. Returns a way to put it back, for the Undo that follows. */
export async function remove(id: string): Promise<(() => void) | null> {
  if (get().mode === 'remote') {
    await ask(`/api/notices/${id.toLowerCase()}/`, 'DELETE');
    set((state) => ({ remote: state.remote.filter((notice) => notice.id !== id) }));
    return null;
  }
  const gone = get().mine.find((notice) => notice.id === id);
  if (!gone) return null;
  set((state) => ({ mine: state.mine.filter((notice) => notice.id !== id) }));
  return () => set((state) => ({ mine: [gone, ...state.mine.filter((notice) => notice.id !== id)] }));
}

export async function report(notice: Notice, sighting: Pick<Sighting, 'at' | 'where' | 'note' | 'by'>) {
  const mark: Sighting = { ...sighting, id: `${notice.id}-${token().slice(0, 6)}` };
  if (!notice.sample && get().mode === 'remote') {
    const answer = await ask<{ notice: Notice }>(`/api/notices/${notice.id.toLowerCase()}/sightings/`, 'POST', sighting);
    replace(notice.id, () => answer.notice);
    return;
  }
  if (notice.sample) {
    set((state) => ({ seen: { ...state.seen, [notice.id]: [...(state.seen[notice.id] ?? []), mark] } }));
    return;
  }
  replace(notice.id, (current) => ({ ...current, sightings: [...current.sightings, mark] }));
}

export function toggleSaved(id: string) {
  set((state) => ({ saved: state.saved.includes(id) ? state.saved.filter((saved) => saved !== id) : [id, ...state.saved] }));
}

/** Forgets everything this browser has kept for the site. */
export function forget() {
  set({ me: null, accounts: [], mine: [], seen: {}, saved: [] });
}
