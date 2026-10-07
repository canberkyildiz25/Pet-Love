import 'server-only';
import type { Notice } from '../types';
import type { Store, User } from './store';

/* A store in the server's own memory. Everything in it is gone when the
   server stops. It is kept on globalThis so that a reload of the code in
   development does not empty it. */

interface Kept {
  users: Map<string, User>;
  notices: Map<string, Notice>;
}

const held = globalThis as { yuvaMemory?: Kept };
const kept = (): Kept => (held.yuvaMemory ??= { users: new Map(), notices: new Map() });
const copy = <T>(value: T): T => structuredClone(value);

export function memory(): Store {
  const { users, notices } = kept();
  return {
    async userByEmail(email) {
      return [...users.values()].find((user) => user.email === email) ?? null;
    },
    async userById(id) {
      return users.get(id) ?? null;
    },
    async addUser(user) {
      if ([...users.values()].some((known) => known.email === user.email)) return false;
      users.set(user.id, user);
      return true;
    },
    async notices() {
      return [...notices.values()].sort((a, b) => b.at - a.at).map(copy);
    },
    async notice(id) {
      const found = notices.get(id);
      return found ? copy(found) : null;
    },
    async addNotice(notice) {
      if (notices.has(notice.id)) return false;
      notices.set(notice.id, copy(notice));
      return true;
    },
    async setHome(id, home) {
      const found = notices.get(id);
      if (!found) return null;
      found.home = home;
      return copy(found);
    },
    async removeNotice(id) {
      return notices.delete(id);
    },
    async addSighting(id, sighting) {
      const found = notices.get(id);
      if (!found) return null;
      found.sightings.push(sighting);
      return copy(found);
    },
  };
}

/** Empties the memory store. For the tests. */
export function forgetMemory() {
  held.yuvaMemory = undefined;
}
