'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';
import { guest, join, Refused, signIn, signOut, useStore } from '@/lib/store';
import { Field, Refusal } from './Field';

/** Where to go once signed in: the page that sent the visitor here, if it is one of ours. */
function next() {
  const asked = new URLSearchParams(window.location.search).get('next');
  return asked && asked.startsWith('/') && !asked.startsWith('//') ? asked : '/me/';
}

export function AuthForm({ joining }: { joining: boolean }) {
  const router = useRouter();
  const ready = useStore((state) => state.ready);
  const me = useStore((state) => state.me);
  const mode = useStore((state) => state.mode);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [refused, setRefused] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function send(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const found: Record<string, string> = {};
    if (joining && name.trim().length < 2) found.name = 'Give the name you want on your notices. A first name is enough.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) found.email = 'That does not look like an email address. It needs a name, an @ and a domain.';
    if (joining ? password.length < 8 : !password) found.password = joining ? 'Use at least 8 characters. Longer is better than clever.' : 'Enter your password.';
    setErrors(found);
    const first = Object.keys(found)[0];
    if (first) {
      event.currentTarget.querySelector<HTMLElement>(`[data-field="${first}"] input`)?.focus();
      return;
    }
    setBusy(true);
    setRefused(null);
    try {
      if (joining) await join(name, email, password);
      else await signIn(email, password);
      router.replace(next());
    } catch (error) {
      setRefused(error instanceof Refused ? error.message : 'That did not go through. Try again in a moment.');
      setBusy(false);
    }
  }

  if (ready && me && !busy) {
    return (
      <div className="panel">
        <h2>You are signed in as {me.name}</h2>
        <div className="acts">
          <Link className="btn" href="/me/">
            My notices
          </Link>
          <button type="button" className="btn btn--line" onClick={() => signOut()}>
            Sign out
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="auth">
      <form className="form" onSubmit={send} noValidate>
        {joining && (
          <div data-field="name">
            <Field label="Your name" hint="Your first name is shown on your notices." error={errors.name}>
              {(wire) => <input {...wire} className="input" value={name} onChange={(event) => setName(event.target.value)} maxLength={40} autoComplete="name" />}
            </Field>
          </div>
        )}
        <div data-field="email">
          <Field label="Email" error={errors.email}>
            {(wire) => (
              <input {...wire} className="input" type="email" value={email} onChange={(event) => setEmail(event.target.value)} maxLength={120} autoComplete="email" autoCapitalize="none" spellCheck={false} />
            )}
          </Field>
        </div>
        <div data-field="password">
          <Field label="Password" hint={joining ? 'At least 8 characters.' : undefined} error={errors.password}>
            {(wire) => (
              <input
                {...wire}
                className="input"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                maxLength={72}
                autoComplete={joining ? 'new-password' : 'current-password'}
              />
            )}
          </Field>
        </div>
        <Refusal text={refused} />
        <div className="form__acts">
          <button type="submit" className="btn" disabled={busy} data-busy={busy ? '' : undefined}>
            {joining ? (busy ? 'Creating it' : 'Create the account') : busy ? 'Signing in' : 'Sign in'}
          </button>
        </div>
        <p className="form__note">
          {joining ? 'Have an account already? ' : 'No account yet? '}
          <Link className="link" href={joining ? '/sign-in/' : '/join/'}>
            {joining ? 'Sign in' : 'Create one'}
          </Link>
        </p>
      </form>

      {ready && mode === 'local' ? (
        <aside className="panel">
          <h2>There is no server behind this demonstration</h2>
          <p>An account made here is kept in this browser and nowhere else. The password is not stored as typed, and it is not sent anywhere, because there is nowhere to send it.</p>
          <p>To look round without making one, use a guest account. It can post, close and take down notices like any other.</p>
          <button
            type="button"
            className="btn btn--line"
            onClick={() => {
              guest();
              router.replace(next());
            }}
          >
            Carry on as a guest
          </button>
        </aside>
      ) : (
        <aside className="panel">
          <h2>What an account is for</h2>
          <p>A notice belongs to whoever posted it. Signed in, you can close it when the animal is home, open it again, or take it down, from any browser.</p>
          <p>Reading notices, printing posters and reporting a sighting need no account.</p>
        </aside>
      )}
    </div>
  );
}
