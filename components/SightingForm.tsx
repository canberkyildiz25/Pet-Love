'use client';

import { useState, type FormEvent } from 'react';
import { Refused, report, useStore } from '@/lib/store';
import { at, clockNow } from '@/lib/time';
import { called, type Notice } from '@/lib/types';
import { them } from '@/lib/words';
import { Choices, Field, Refusal } from './Field';


type Day = 'today' | 'yesterday' | 'earlier';

/** "I have seen them": where, when, and what you noticed. Two things are needed, the place and a name. */
export function SightingForm({ notice, now, onDone }: { notice: Notice; now: number; onDone: () => void }) {
  const me = useStore((state) => state.me);
  const [where, setWhere] = useState('');
  const [day, setDay] = useState<Day>('today');
  const [days, setDays] = useState('2');
  const [time, setTime] = useState(() => clockNow(now || Date.now()));
  const [note, setNote] = useState('');
  const [by, setBy] = useState(me?.name.split(' ')[0] ?? '');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [refused, setRefused] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function send(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const clock = Date.now();
    const ago = day === 'today' ? 0 : day === 'yesterday' ? 1 : Number(days);
    const found: Record<string, string> = {};
    if (where.trim().length < 3) found.where = 'Say where: a street, a park gate, a shop. It is the part that matters most.';
    if (!/^\d{2}:\d{2}$/.test(time)) found.time = 'Give the time as closely as you remember it, like 08:30.';
    if (day === 'earlier' && !(Number.isInteger(ago) && ago >= 2 && ago <= 90)) found.days = 'Give a number of days between 2 and 90.';
    const moment = found.time || found.days ? 0 : at(ago, time, clock);
    if (moment > clock + 60_000) found.time = 'That time has not come yet. Check the day and the time.';
    if (!by.trim()) found.by = 'A first name is enough, so that the owner knows who to thank.';
    setErrors(found);
    const first = Object.keys(found)[0];
    if (first) {
      event.currentTarget.querySelector<HTMLElement>(`[data-field="${first}"] :is(input, textarea)`)?.focus();
      return;
    }
    setBusy(true);
    setRefused(null);
    try {
      await report(notice, { at: moment, where: where.trim(), note: note.trim(), by: by.trim() });
      onDone();
    } catch (error) {
      setRefused(error instanceof Refused ? error.message : 'That did not go through. Try again in a moment.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <form className="form" onSubmit={send} noValidate>
      <div data-field="where">
        <Field label={`Where did you see ${them(notice)}?`} hint="As you would tell a neighbour: the street, and what it was next to." error={errors.where}>
          {(wire) => <input {...wire} className="input" value={where} onChange={(event) => setWhere(event.target.value)} maxLength={120} autoComplete="off" />}
        </Field>
      </div>
      <Choices
        legend="When?"
        name="day"
        value={day}
        onChange={setDay}
        options={[
          { value: 'today', label: 'Today' },
          { value: 'yesterday', label: 'Yesterday' },
          { value: 'earlier', label: 'Earlier' },
        ]}
      />
      <div className="form__row">
        {day === 'earlier' && (
          <div data-field="days">
            <Field label="How many days ago?" error={errors.days}>
              {(wire) => <input {...wire} className="input" inputMode="numeric" value={days} onChange={(event) => setDays(event.target.value)} maxLength={2} />}
            </Field>
          </div>
        )}
        <div data-field="time">
          <Field label="At about what time?" error={errors.time}>
            {(wire) => <input {...wire} className="input" type="time" value={time} onChange={(event) => setTime(event.target.value)} />}
          </Field>
        </div>
      </div>
      <Field label="What did you notice?" optional hint="Which way they were going, a collar, a limp, who they were with.">
        {(wire) => <textarea {...wire} className="input" value={note} onChange={(event) => setNote(event.target.value)} maxLength={400} rows={3} />}
      </Field>
      <div data-field="by">
        <Field label="Your first name" error={errors.by}>
          {(wire) => <input {...wire} className="input" value={by} onChange={(event) => setBy(event.target.value)} maxLength={40} autoComplete="given-name" />}
        </Field>
      </div>
      {notice.sample && <p className="form__note">{called(notice)} is an example, so this sighting is kept in your browser and goes no further.</p>}
      <Refusal text={refused} />
      <div className="form__acts">
        <button type="submit" className="btn" disabled={busy} data-busy={busy ? '' : undefined}>
          {busy ? 'Adding' : 'Add the sighting'}
        </button>
        <button type="button" className="btn btn--quiet" onClick={onDone}>
          Cancel
        </button>
      </div>
    </form>
  );
}
