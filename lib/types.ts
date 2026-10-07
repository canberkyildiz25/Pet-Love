/* What a notice is. The same shape is used for the sample notices that ship
   with the site, for notices kept in a visitor's browser, and for notices in
   the database when one is connected. */

export type Kind = 'lost' | 'found' | 'adopt';
export type Species = 'cat' | 'dog' | 'bird' | 'rabbit' | 'other';
export type Sex = 'male' | 'female' | 'unknown';

/** A photograph. One from Commons carries its maker; one a visitor added does not. */
export interface Photo {
  src: string;
  w: number;
  h: number;
  /** Where the animal's face is, as percentages from the left and the top. */
  fx: number;
  fy: number;
  credit?: { title: string; by: string; licence: string; licenceUrl: string | null; page: string };
}

/* A moment on a notice. A real notice keeps the moment itself, in milliseconds
   since 1970. A sample notice keeps how long ago it was instead, so that the
   examples never go stale and a page built last month reads the same today. */
export interface Ago {
  days: number;
  /** The time of day in Istanbul, as 21:40. */
  clock: string;
}

/** Somebody saw the animal: when, where, and what they noticed. */
export interface Sighting {
  id: string;
  at: number;
  ago?: Ago;
  where: string;
  note: string;
  by: string;
}

export interface Notice {
  /** The reference printed on the poster, like YV-2041. */
  id: string;
  kind: Kind;
  /** A notice is closed when the animal is home: found by its owner, claimed, or adopted. */
  home: { at: number; after?: number; note: string } | null;
  species: Species;
  /** A found animal has no name. */
  name: string | null;
  /** What somebody would call it at a glance: "Brindle dog", "Young tabby cat". */
  title: string;
  sex: Sex;
  age: string | null;
  /** Collar, tag, scar, odd eyes: what tells this animal from another of its colour. */
  marks: string;
  district: string;
  hood: string;
  /** The exact spot, in the poster's own words: "near the tea garden". */
  place: string;
  /** Last seen, found, or (looking for a home) listed. */
  at: number;
  ago?: Ago;
  text: string;
  photo: Photo | null;
  /** Who to reach. A sample notice has a first name only. */
  contact: { name: string; phone?: string };
  sightings: Sighting[];
  /** One of the notices that ship with the site, as an example. */
  sample: boolean;
  /** The account that posted it, where there is one. */
  owner?: string;
}

export const KINDS: { key: Kind; label: string; plural: string }[] = [
  { key: 'lost', label: 'Lost', plural: 'lost' },
  { key: 'found', label: 'Found', plural: 'found' },
  { key: 'adopt', label: 'Home wanted', plural: 'looking for a home' },
];

export const SPECIES: { key: Species; label: string }[] = [
  { key: 'cat', label: 'Cat' },
  { key: 'dog', label: 'Dog' },
  { key: 'bird', label: 'Bird' },
  { key: 'rabbit', label: 'Rabbit' },
  { key: 'other', label: 'Other' },
];

/** The signal a notice shows: its kind while it is open, "home" once it is closed. */
export type Signal = Kind | 'home';
export const signalOf = (notice: Pick<Notice, 'kind' | 'home'>): Signal => (notice.home ? 'home' : notice.kind);

export const SIGNALS: Record<Signal, { label: string; board: string }> = {
  lost: { label: 'Lost', board: 'LOST' },
  found: { label: 'Found', board: 'FOUND' },
  adopt: { label: 'Home wanted', board: 'WANTED' },
  home: { label: 'Home', board: 'HOME' },
};

/** What the page calls the animal: its name, or what it looks like. */
export const called = (notice: Pick<Notice, 'name' | 'title'>) => notice.name ?? notice.title;
