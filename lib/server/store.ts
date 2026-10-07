import 'server-only';
import type { Notice, Sighting } from '../types';
import { memory } from './memory';
import { mongo, reach } from './mongo';

/* Where accounts and notices live when the site has a server behind it.

   There are three answers, chosen by the environment:

   - MONGODB_URI is set: MongoDB.
   - YUVA_DB=memory: a store that lives in the server's memory and is gone
     when it stops. It is for running the whole thing end to end on a
     machine with no database, and for the tests.
   - neither: none. The API says so, and the site keeps everything in the
     visitor's browser instead.

   The pages never know which of the first two it is. */

export interface User {
  id: string;
  name: string;
  email: string;
  hash: string;
  made: number;
}

export interface Store {
  userByEmail(email: string): Promise<User | null>;
  userById(id: string): Promise<User | null>;
  /** False when the address already has an account. */
  addUser(user: User): Promise<boolean>;
  /** Newest first. */
  notices(): Promise<Notice[]>;
  notice(id: string): Promise<Notice | null>;
  /** False when the reference is taken. */
  addNotice(notice: Notice): Promise<boolean>;
  setHome(id: string, home: Notice['home']): Promise<Notice | null>;
  removeNotice(id: string): Promise<boolean>;
  addSighting(id: string, sighting: Sighting): Promise<Notice | null>;
}

export type Db = 'mongo' | 'memory' | 'none';

/** A database needs a secret to sign sessions with. Without one it is treated as not there. */
const secretSet = () => (process.env.YUVA_SECRET ?? '').length >= 32;

let warned = false;

export function configured(): Db {
  if (process.env.MONGODB_URI) {
    if (secretSet()) return 'mongo';
    if (!warned) {
      warned = true;
      console.error('Yuva: MONGODB_URI is set but YUVA_SECRET is missing or shorter than 32 characters. Running without a database.');
    }
    return 'none';
  }
  return process.env.YUVA_DB === 'memory' ? 'memory' : 'none';
}

/* A database that is configured but cannot be reached (asleep, paused, wrong
   address) is worse than none: every page would wait on it and fail. So the
   answer is checked, and remembered for half a minute. */
let checked = { at: 0, up: false };

export async function db(): Promise<Db> {
  const kind = configured();
  if (kind !== 'mongo') return kind;
  if (Date.now() - checked.at > 30_000) checked = { at: Date.now(), up: await reach() };
  return checked.up ? 'mongo' : 'none';
}

export async function store(): Promise<Store | null> {
  const kind = await db();
  if (kind === 'mongo') return mongo();
  if (kind === 'memory') return memory();
  return null;
}
