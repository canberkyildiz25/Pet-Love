import 'server-only';
import { MongoClient, type Collection } from 'mongodb';
import type { Notice } from '../types';
import type { Store, User } from './store';

/* MongoDB. One client for the life of the server, two collections, and a
   unique index on each so that two requests at once cannot both take the same
   address or the same reference. */

interface Open {
  users: Collection<User>;
  notices: Collection<Notice>;
}

const held = globalThis as { yuvaMongo?: Promise<Open> };
const TAKEN = 11000;
const bare = { projection: { _id: 0 } } as const;

async function open(): Promise<Open> {
  const client = await new MongoClient(process.env.MONGODB_URI ?? '', { serverSelectionTimeoutMS: 4000, appName: 'yuva' }).connect();
  const base = client.db(process.env.MONGODB_DB || 'yuva');
  const users = base.collection<User>('users');
  const notices = base.collection<Notice>('notices');
  await Promise.all([users.createIndex({ email: 1 }, { unique: true }), users.createIndex({ id: 1 }, { unique: true }), notices.createIndex({ id: 1 }, { unique: true }), notices.createIndex({ at: -1 })]);
  return { users, notices };
}

function collections(): Promise<Open> {
  held.yuvaMongo ??= open().catch((error: unknown) => {
    // a failed connection is not remembered: the next request tries again
    held.yuvaMongo = undefined;
    throw error;
  });
  return held.yuvaMongo;
}

/** Whether the database answers. */
export async function reach(): Promise<boolean> {
  try {
    const { users } = await collections();
    await users.estimatedDocumentCount();
    return true;
  } catch (error) {
    console.error('Yuva: the database did not answer.', error instanceof Error ? error.message : error);
    return false;
  }
}

const taken = (error: unknown) => typeof error === 'object' && error !== null && 'code' in error && error.code === TAKEN;

export function mongo(): Store {
  return {
    async userByEmail(email) {
      const { users } = await collections();
      return users.findOne({ email }, bare);
    },
    async userById(id) {
      const { users } = await collections();
      return users.findOne({ id }, bare);
    },
    async addUser(user) {
      const { users } = await collections();
      try {
        await users.insertOne({ ...user });
        return true;
      } catch (error) {
        if (taken(error)) return false;
        throw error;
      }
    },
    async notices() {
      const { notices } = await collections();
      return notices.find({}, bare).sort({ at: -1 }).limit(500).toArray();
    },
    async notice(id) {
      const { notices } = await collections();
      return notices.findOne({ id }, bare);
    },
    async addNotice(notice) {
      const { notices } = await collections();
      try {
        await notices.insertOne({ ...notice });
        return true;
      } catch (error) {
        if (taken(error)) return false;
        throw error;
      }
    },
    async setHome(id, home) {
      const { notices } = await collections();
      return notices.findOneAndUpdate({ id }, { $set: { home } }, { ...bare, returnDocument: 'after' });
    },
    async removeNotice(id) {
      const { notices } = await collections();
      return (await notices.deleteOne({ id })).deletedCount === 1;
    },
    async addSighting(id, sighting) {
      const { notices } = await collections();
      // a notice holds its last 200 sightings
      return notices.findOneAndUpdate({ id }, { $push: { sightings: { $each: [sighting], $slice: -200 } } }, { ...bare, returnDocument: 'after' });
    },
  };
}
