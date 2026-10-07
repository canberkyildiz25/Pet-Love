import { note } from '@/lib/server/check';
import { answer, Bad, body, own } from '@/lib/server/guard';
import { needStore, needUser } from '@/lib/server/need';

export const dynamic = 'force-dynamic';

const reference = (id: string) => id.toUpperCase();
const GONE = 'There is no notice with that reference.';
const NOT_YOURS = 'Only whoever posted a notice can change it.';

export async function GET(_request: Request, { params }: RouteContext<'/api/notices/[id]'>) {
  return answer(async () => {
    const store = await needStore();
    const notice = await store.notice(reference((await params).id));
    if (!notice) throw new Bad(GONE, 404);
    return Response.json({ notice }, { headers: { 'cache-control': 'no-store' } });
  });
}

/** Closes a notice, with a line on how it ended, or opens it again. */
export async function PATCH(request: Request, { params }: RouteContext<'/api/notices/[id]'>) {
  return answer(async () => {
    own(request);
    const store = await needStore();
    const user = await needUser();
    const id = reference((await params).id);
    const notice = await store.notice(id);
    if (!notice) throw new Bad(GONE, 404);
    if (notice.owner !== user.id) throw new Bad(NOT_YOURS, 403);
    const { home } = await body(request);
    if (home !== null && (typeof home !== 'object' || Array.isArray(home))) throw new Bad('That could not be read.');
    const changed = await store.setHome(id, home === null ? null : { at: Date.now(), note: note((home as { note?: unknown }).note) });
    if (!changed) throw new Bad(GONE, 404);
    return Response.json({ notice: changed });
  });
}

export async function DELETE(request: Request, { params }: RouteContext<'/api/notices/[id]'>) {
  return answer(async () => {
    own(request);
    const store = await needStore();
    const user = await needUser();
    const id = reference((await params).id);
    const notice = await store.notice(id);
    if (!notice) throw new Bad(GONE, 404);
    if (notice.owner !== user.id) throw new Bad(NOT_YOURS, 403);
    await store.removeNotice(id);
    return Response.json({ gone: id });
  });
}
