import data from '@/data/photos.json';
import type { Photo } from './types';

interface Stored {
  src: string;
  w: number;
  h: number;
  fx: number;
  fy: number;
  title: string;
  by: string;
  licence: string;
  licenceUrl: string | null;
  page: string;
}

const STORED = data.photos as Record<string, Stored>;

/** The day the photographs were fetched from Wikimedia Commons. */
export const PHOTOS_FETCHED: string = data.fetched;

/** A sample photograph by its key in data/photos.json, with its maker. */
export function samplePhoto(key: string): Photo {
  const photo = STORED[key];
  if (!photo) throw new Error(`no photograph called ${key}`);
  return {
    src: photo.src,
    w: photo.w,
    h: photo.h,
    fx: photo.fx,
    fy: photo.fy,
    credit: { title: photo.title, by: photo.by, licence: photo.licence, licenceUrl: photo.licenceUrl, page: photo.page },
  };
}

export const SAMPLE_PHOTOS = Object.entries(STORED).map(([key, photo]) => ({ key, ...photo }));
