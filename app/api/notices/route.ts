import { draft } from '@/lib/server/check';
import { answer, Bad, body, brake, own } from '@/lib/server/guard';
import { needStore, needUser } from '@/lib/server/need';
import type { Notice } from '@/lib/types';

export const dynamic = 'force-dynamic';

export async function GET() {
  return answer(async () => {
    const store = await needStore();
    return Response.json({ notices: await store.notices() }, { headers: { 'cache-control': 'no-store' } });
  });
}

const LETTERS = 'ABCDEFGHJKLMNPRSTUVWXYZ';
const MARKS = '23456789ABCDEFGHJKLMNPRSTUVWXYZ';
const pick = (from: string) => from[crypto.getRandomValues(new Uint32Array(1))[0] % from.length];
/** Like YV-K7M2: a letter first, so that it can never be taken for one of the example notices. */
const reference = () => `YV-${pick(LETTERS)}${pick(MARKS)}${pick(MARKS)}${pick(MARKS)}`;

export async function POST(request: Request) {
  return answer(async () => {
    own(request);
    brake(request, 'post', 12, 3_600_000);
    const store = await needStore();
    const user = await needUser();
    const { phone, ...rest } = draft(await body(request));
    const notice: Notice = { ...rest, id: '', home: null, contact: { name: user.name.split(' ')[0], ...(phone ? { phone } : {}) }, sightings: [], sample: false, owner: user.id };
    // a reference that is taken is drawn again
    for (let tries = 0; tries < 6; tries += 1) {
      notice.id = reference();
      if (await store.addNotice(notice)) return Response.json({ notice }, { status: 201 });
    }
    throw new Bad('The notice could not be given a reference. Try again.', 503);
  });
}
