/* Small words that depend on the animal. A found animal's sex is often not
   known, and then the page says "them". */

import type { Notice } from './types';

type Sexed = Pick<Notice, 'sex'>;

export const them = (notice: Sexed) => (notice.sex === 'male' ? 'him' : notice.sex === 'female' ? 'her' : 'them');
export const they = (notice: Sexed) => (notice.sex === 'male' ? 'he' : notice.sex === 'female' ? 'she' : 'they');
export const their = (notice: Sexed) => (notice.sex === 'male' ? 'his' : notice.sex === 'female' ? 'her' : 'their');
/** "he is", "she is", "they are" */
export const theyAre = (notice: Sexed) => (notice.sex === 'unknown' ? 'they are' : `${they(notice)} is`);

/** The first sentence of a longer text. */
export const firstSentence = (text: string) => text.match(/^.*?[.!?](?=\s|$)/)?.[0] ?? text;
