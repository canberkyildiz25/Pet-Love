import bcrypt from 'bcryptjs';
import { account } from '@/lib/server/check';
import { answer, Bad, body, brake, own } from '@/lib/server/guard';
import { needStore } from '@/lib/server/need';
import { open, shown } from '@/lib/server/session';

export async function POST(request: Request) {
  return answer(async () => {
    own(request);
    brake(request, 'join', 8, 600_000);
    const store = await needStore();
    const { name, email, password } = account(await body(request), true);
    const user = { id: crypto.randomUUID(), name, email, hash: await bcrypt.hash(password, 11), made: Date.now() };
    if (!(await store.addUser(user))) throw new Bad('There is already an account with that address. Sign in instead.', 409);
    await open(user);
    return Response.json({ me: shown(user) }, { status: 201 });
  });
}
