import { answer, own } from '@/lib/server/guard';
import { shut } from '@/lib/server/session';

export async function POST(request: Request) {
  return answer(async () => {
    own(request);
    await shut();
    return Response.json({ me: null });
  });
}
