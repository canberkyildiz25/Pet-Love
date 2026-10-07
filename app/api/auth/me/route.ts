import { answer } from '@/lib/server/guard';
import { shown, who } from '@/lib/server/session';

export const dynamic = 'force-dynamic';

export async function GET() {
  return answer(async () => {
    const user = await who();
    return Response.json({ me: user ? shown(user) : null }, { headers: { 'cache-control': 'no-store' } });
  });
}
