import { sighting } from '@/lib/server/check';
import { answer, Bad, body, brake, own } from '@/lib/server/guard';
import { needStore } from '@/lib/server/need';

/** "I have seen them." Anybody may say so, without an account, but not a hundred times a minute. */
export async function POST(request: Request, { params }: RouteContext<'/api/notices/[id]/sightings'>) {
  return answer(async () => {
    own(request);
    brake(request, 'sighting', 10, 600_000);
    const store = await needStore();
    const id = (await params).id.toUpperCase();
    const known = await store.notice(id);
    if (!known) throw new Bad('There is no notice with that reference.', 404);
    if (known.home) throw new Bad('That notice is closed: the animal is home.', 409);
    const seen = sighting(await body(request));
    const notice = await store.addSighting(id, { ...seen, id: `${id}-${crypto.randomUUID().slice(0, 6)}` });
    if (!notice) throw new Bad('There is no notice with that reference.', 404);
    return Response.json({ notice }, { status: 201 });
  });
}
