import 'server-only';
import { DISTRICTS } from '../places';
import type { Draft } from '../store';
import type { Kind, Photo, Sex, Sighting, Species } from '../types';
import { Bad } from './guard';

/* Nothing a browser sends is taken on trust. Every field is checked for its
   kind and its length here, and only the fields a notice has are kept. */

const KINDS: Kind[] = ['lost', 'found', 'adopt'];
const SPECIES: Species[] = ['cat', 'dog', 'bird', 'rabbit', 'other'];
const SEXES: Sex[] = ['male', 'female', 'unknown'];
const YEAR = 366 * 86_400_000;

function text(value: unknown, what: string, least: number, most: number): string {
  if (typeof value !== 'string') throw new Bad(`${what} is missing.`);
  // control characters are dropped; a tab or a line break is kept
  const clean = [...value]
    .filter((letter) => {
      const code = letter.charCodeAt(0);
      return code === 9 || code === 10 || (code > 31 && code !== 127);
    })
    .join('')
    .trim();
  if (clean.length < least) throw new Bad(`${what} is missing or too short.`);
  if (clean.length > most) throw new Bad(`${what} is too long: keep it under ${most} characters.`);
  return clean;
}

const optional = (value: unknown, what: string, most: number) => (value === null || value === undefined || value === '' ? null : text(value, what, 0, most) || null);

function one<T extends string>(value: unknown, of: readonly T[], what: string): T {
  if (typeof value !== 'string' || !of.includes(value as T)) throw new Bad(`${what} is not one of the choices.`);
  return value as T;
}

function moment(value: unknown, what: string): number {
  if (typeof value !== 'number' || !Number.isFinite(value)) throw new Bad(`${what} is missing.`);
  const now = Date.now();
  if (value > now + 300_000) throw new Bad(`${what} has not come yet.`);
  if (value < now - YEAR) throw new Bad(`${what} is more than a year ago.`);
  return Math.round(value);
}

const share = (value: unknown) => (typeof value === 'number' && value >= 0 && value <= 100 ? Math.round(value) : 50);
const size = (value: unknown) => (typeof value === 'number' && Number.isInteger(value) && value > 0 && value <= 2000 ? value : null);

function photo(value: unknown): Photo | null {
  if (value === null || value === undefined) return null;
  if (typeof value !== 'object') throw new Bad('The photograph could not be read.');
  const { src, w, h, fx, fy } = value as Record<string, unknown>;
  const width = size(w);
  const height = size(h);
  // only a JPEG the browser made itself, and not a large one
  if (typeof src !== 'string' || !/^data:image\/jpeg;base64,[A-Za-z0-9+/]+=*$/.test(src) || src.length > 560_000 || !width || !height) throw new Bad('The photograph could not be read. Try another one.');
  return { src, w: width, h: height, fx: share(fx), fy: share(fy) };
}

export function draft(input: Record<string, unknown>): Draft {
  const kind = one(input.kind, KINDS, 'The kind of notice');
  const phone = optional(input.phone, 'The phone number', 20);
  if (phone) {
    const digits = phone.replace(/\D/g, '');
    if (digits.length < 7 || digits.length > 15 || /[^\d\s+()-]/.test(phone)) throw new Bad('The phone number does not look like one.');
  }
  return {
    kind,
    species: one(input.species, SPECIES, 'The kind of animal'),
    name: kind === 'found' ? null : text(input.name, 'The name', 1, 20),
    title: text(input.title, 'What a stranger would call them', 3, 32),
    sex: one(input.sex, SEXES, 'The sex'),
    age: optional(input.age, 'The age', 20),
    marks: text(input.marks, 'What to look for', 6, 140),
    district: one(input.district, DISTRICTS, 'The district'),
    hood: text(input.hood, 'The neighbourhood', 2, 30),
    place: text(input.place, 'The exact spot', 3, 80),
    at: moment(input.at, 'The time'),
    text: optional(input.text, 'The story', 600) ?? '',
    photo: photo(input.photo),
    ...(phone ? { phone } : {}),
  };
}

export function sighting(input: Record<string, unknown>): Pick<Sighting, 'at' | 'where' | 'note' | 'by'> {
  return {
    at: moment(input.at, 'The time'),
    where: text(input.where, 'Where', 3, 120),
    note: optional(input.note, 'What you noticed', 400) ?? '',
    by: text(input.by, 'Your name', 1, 40),
  };
}

export function account(input: Record<string, unknown>, joining: boolean) {
  const email = text(input.email, 'The email address', 5, 120).toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Bad('That does not look like an email address.');
  if (typeof input.password !== 'string' || !input.password) throw new Bad('The password is missing.');
  // bcrypt reads the first 72 bytes of a password and ignores the rest, so a longer one is refused, not cut
  if (joining && (input.password.length < 8 || new TextEncoder().encode(input.password).length > 72)) throw new Bad('Use a password of between 8 and 72 characters.');
  return { email, password: input.password, name: joining ? text(input.name, 'Your name', 2, 40) : '' };
}

export function note(value: unknown) {
  return optional(value, 'The note', 280) ?? '';
}
