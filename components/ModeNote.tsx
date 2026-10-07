'use client';

import { useStore } from '@/lib/store';

/** Says which of the two ways the site is running in, once the browser has asked. */
export function ModeNote() {
  const ready = useStore((state) => state.ready);
  const mode = useStore((state) => state.mode);
  if (!ready) return null;
  return (
    <p className="state" data-signal={mode === 'remote' ? 'found' : 'adopt'}>
      <strong>{mode === 'remote' ? 'Right now: with a database' : 'Right now: without a database'}</strong>
      {mode === 'remote' ? 'What you post here is stored on the server and other visitors can see it.' : 'What you post here stays in this browser. Nobody else can see it.'}
    </p>
  );
}
