'use client';

import { ArrowLeft, ArrowRight, Camera, Trash } from '@phosphor-icons/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState, type FormEvent, type MouseEvent } from 'react';
import { useNow } from '@/lib/notices';
import { DISTRICTS } from '@/lib/places';
import { pathOf } from '@/lib/seed';
import { guest, post, Refused, useStore, type Draft } from '@/lib/store';
import { at, clockNow } from '@/lib/time';
import { SPECIES, type Kind, type Notice, type Photo, type Sex, type Species } from '@/lib/types';
import { Choices, Field, Refusal } from './Field';
import { NoticeCard } from './NoticeCard';

/* Posting a notice, in three short steps. Each step asks only what the
   poster needs, and says why it is asking. Nothing is sent until the last
   button; before it, the notice is shown as others will see it. */

const KIND: { key: Kind; title: string; says: string }[] = [
  { key: 'lost', title: 'Lost', says: 'My pet is missing.' },
  { key: 'found', title: 'Found', says: 'I have found an animal, or seen one that looks lost.' },
  { key: 'adopt', title: 'Home wanted', says: 'An animal needs somewhere to live.' },
];
const STEPS = ['What happened', 'Where and when', 'What to look for'];
const WHEN = { lost: 'When were they last seen?', found: 'When did you find them?', adopt: '' } as const;
const STORY = {
  lost: { label: 'How they went missing, and how to approach them', hint: 'Shy or friendly, whether they come to their name, what not to do.' },
  found: { label: 'Where they are now, and how they are', hint: 'With you, still on the street, at a vet. Hurt or well.' },
  adopt: { label: 'What they are like, and what home would suit', hint: 'With children, with other animals, alone in a flat. Be plain about the hard parts.' },
} as const;

type Day = 'today' | 'yesterday' | 'earlier';
type Errors = Record<string, string>;

/** Makes a photograph small enough to keep: at most 1,000 pixels on its long side, as a JPEG. */
async function shrink(file: File): Promise<Photo> {
  if (!file.type.startsWith('image/')) throw new Refused('That file is not a photograph. Choose a JPEG or a PNG.');
  const bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' }).catch(() => null);
  if (!bitmap) throw new Refused('That photograph could not be read. Try a JPEG or a PNG.');
  const scale = Math.min(1, 1000 / Math.max(bitmap.width, bitmap.height));
  const w = Math.round(bitmap.width * scale);
  const h = Math.round(bitmap.height * scale);
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  canvas.getContext('2d')?.drawImage(bitmap, 0, 0, w, h);
  bitmap.close();
  return { src: canvas.toDataURL('image/jpeg', 0.8), w, h, fx: 50, fy: 40 };
}

export function PostWizard() {
  const router = useRouter();
  const ready = useStore((state) => state.ready);
  const me = useStore((state) => state.me);
  const mode = useStore((state) => state.mode);

  const [step, setStep] = useState(0);
  const [kind, setKind] = useState<Kind | ''>('');
  const [species, setSpecies] = useState<Species | ''>('');
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [sex, setSex] = useState<Sex>('unknown');
  const [age, setAge] = useState('');
  const [district, setDistrict] = useState('');
  const [hood, setHood] = useState('');
  const [place, setPlace] = useState('');
  const [day, setDay] = useState<Day>('today');
  const [days, setDays] = useState('2');
  const [time, setTime] = useState('');
  const [marks, setMarks] = useState('');
  const [text, setText] = useState('');
  const [photo, setPhoto] = useState<Photo | null>(null);
  const [phone, setPhone] = useState('');
  const [errors, setErrors] = useState<Errors>({});
  const [refused, setRefused] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const now = useNow();
  const form = useRef<HTMLFormElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const moved = useRef(false);

  // "I lost a pet" on the front page arrives with the kind already chosen
  useEffect(() => {
    const asked = new URLSearchParams(window.location.search).get('kind');
    // eslint-disable-next-line react-hooks/set-state-in-effect -- the address is only known once the page is in a browser
    if (asked === 'lost' || asked === 'found' || asked === 'adopt') setKind(asked);
    setTime(clockNow(Date.now()));
  }, []);

  // a new step starts at its heading, for the eye and for a screen reader
  useEffect(() => {
    if (!moved.current) return;
    heading.current?.focus();
    heading.current?.scrollIntoView({ block: 'start', behavior: 'auto' });
  }, [step]);

  if (!ready) return <p aria-busy="true" />;

  if (!me) {
    return (
      <div className="panel">
        <h2>First, an account</h2>
        <p>A notice belongs to somebody, so that only they can close it when the animal is home, or take it down.</p>
        {mode === 'local' && <p>This demonstration has no database. An account made here is kept in your browser and nowhere else, so a guest account does just as well.</p>}
        <div className="acts">
          {mode === 'local' && (
            <button type="button" className="btn" onClick={() => guest()}>
              Carry on as a guest
            </button>
          )}
          <Link className={mode === 'local' ? 'btn btn--line' : 'btn'} href="/sign-in/?next=/post/">
            Sign in
          </Link>
          <Link className="btn btn--line" href="/join/?next=/post/">
            Create an account
          </Link>
        </div>
      </div>
    );
  }

  const named = kind !== 'found';

  function check(which: number): Errors {
    const found: Errors = {};
    if (which === 0) {
      if (!kind) found.kind = 'Choose what kind of notice this is.';
      if (!species) found.species = 'Choose the kind of animal.';
      if (named && !name.trim()) found.name = 'Give their name. It goes on the notice, under what they look like.';
      if (title.trim().length < 3) found.title = 'Say what a stranger would see: a colour and a kind, like “brindle dog”.';
    }
    if (which === 1) {
      if (!district) found.district = 'Choose the district.';
      if (hood.trim().length < 2) found.hood = 'Give the neighbourhood, as people there call it.';
      if (place.trim().length < 3) found.place = 'Say where exactly: a street, a park gate, what it was next to.';
      if (kind !== 'adopt') {
        const ago = day === 'today' ? 0 : day === 'yesterday' ? 1 : Number(days);
        if (!/^\d{2}:\d{2}$/.test(time)) found.time = 'Give the time as closely as you remember it, like 21:40.';
        if (day === 'earlier' && !(Number.isInteger(ago) && ago >= 2 && ago <= 365)) found.days = 'Give a number of days between 2 and 365.';
        if (!found.time && !found.days && at(ago, time, Date.now()) > Date.now() + 60_000) found.time = 'That time has not come yet. Check the day and the time.';
      }
    }
    if (which === 2) {
      if (marks.trim().length < 6) found.marks = 'Give at least one thing that tells this animal from another one like it.';
      const digits = phone.replace(/\D/g, '');
      if (phone.trim() && (digits.length < 7 || digits.length > 15 || /[^\d\s+()-]/.test(phone))) found.phone = 'That does not look like a phone number. Use digits, like 0532 000 00 00, or leave it empty.';
    }
    return found;
  }

  function show(found: Errors) {
    setErrors(found);
    const first = Object.keys(found)[0];
    if (first) form.current?.querySelector<HTMLElement>(`[data-field="${first}"] :is(input, select, textarea)`)?.focus();
    return !first;
  }

  function go(to: number) {
    if (to > step && !show(check(step))) return;
    setErrors({});
    setRefused(null);
    moved.current = true;
    setStep(to);
  }

  async function pick(file: File | undefined) {
    if (!file) return;
    setRefused(null);
    try {
      setPhoto(await shrink(file));
    } catch (error) {
      setRefused(error instanceof Refused ? error.message : 'That photograph could not be read.');
    }
  }

  function aim(event: MouseEvent<HTMLDivElement>) {
    if (!photo) return;
    const box = event.currentTarget.getBoundingClientRect();
    const fx = Math.round(((event.clientX - box.left) / box.width) * 100);
    const fy = Math.round(((event.clientY - box.top) / box.height) * 100);
    setPhoto({ ...photo, fx: Math.min(100, Math.max(0, fx)), fy: Math.min(100, Math.max(0, fy)) });
  }

  function draft(clock: number): Draft {
    const ago = day === 'today' ? 0 : day === 'yesterday' ? 1 : Number(days);
    return {
      kind: kind as Kind,
      species: species as Species,
      name: named ? name.trim() : null,
      title: title.trim().replace(/^./, (letter) => letter.toUpperCase()),
      sex,
      age: age.trim() || null,
      marks: marks.trim(),
      district,
      hood: hood.trim(),
      place: place.trim(),
      at: kind === 'adopt' ? clock : at(ago, time, clock),
      text: text.trim(),
      photo,
      ...(phone.trim() ? { phone: phone.trim() } : {}),
    };
  }

  async function send(event: FormEvent) {
    event.preventDefault();
    if (step < 2) {
      go(step + 1);
      return;
    }
    if (!show(check(2))) return;
    setBusy(true);
    setRefused(null);
    try {
      const notice = await post(draft(Date.now()));
      router.push(pathOf(notice.id));
    } catch (error) {
      setRefused(error instanceof Refused ? error.message : 'The notice could not be put up. Try again in a moment.');
      setBusy(false);
    }
  }

  const story = STORY[kind || 'lost'];
  const preview: Notice | null =
    step === 2 && kind && species && now ? { ...draft(now), id: 'YV-NEW', home: null, contact: { name: me.name.split(' ')[0] }, sightings: [], sample: false } : null;

  return (
    <form ref={form} className="form" onSubmit={send} noValidate data-signal={kind || undefined}>
      <ol className="steps" aria-label="Steps">
        {STEPS.map((label, index) => (
          <li key={label} className="label" aria-current={index === step ? 'step' : undefined} data-done={index < step ? '' : undefined}>
            <span>
              {index + 1}. {label}
            </span>
          </li>
        ))}
      </ol>

      {step === 0 && (
        <section className="step form">
          <h2 ref={heading} tabIndex={-1}>
            What happened?
          </h2>
          <fieldset className="field" data-field="kind">
            <legend>This notice is for</legend>
            <div className="choices choices--kind">
              {KIND.map((entry) => (
                <label key={entry.key} className="choice" data-signal={entry.key}>
                  <input type="radio" name="kind" value={entry.key} checked={kind === entry.key} onChange={() => setKind(entry.key)} />
                  <span>
                    <strong>
                      <i className="dot" aria-hidden="true" />
                      {entry.title}
                    </strong>
                    <small>{entry.says}</small>
                  </span>
                </label>
              ))}
            </div>
            <div className="field__slot">{errors.kind && <p className="field__error">{errors.kind}</p>}</div>
          </fieldset>
          <div data-field="species">
            <Choices legend="The animal is a" name="species" value={species} onChange={setSpecies} options={SPECIES.map((entry) => ({ value: entry.key, label: entry.label }))} error={errors.species} />
          </div>
          {named && (
            <div data-field="name">
              <Field label="Their name" error={errors.name}>
                {(wire) => <input {...wire} className="input" value={name} onChange={(event) => setName(event.target.value)} maxLength={20} autoComplete="off" />}
              </Field>
            </div>
          )}
          <div data-field="title">
            <Field label="What would a stranger call them?" hint="A colour and a kind, as on a poster: brindle dog, white cat with odd eyes." error={errors.title}>
              {(wire) => <input {...wire} className="input" value={title} onChange={(event) => setTitle(event.target.value)} maxLength={32} autoComplete="off" />}
            </Field>
          </div>
          <Choices
            legend="Sex"
            name="sex"
            value={sex}
            onChange={setSex}
            options={[
              { value: 'male', label: 'Male' },
              { value: 'female', label: 'Female' },
              { value: 'unknown', label: 'Not sure' },
            ]}
          />
          <Field label="Age" optional hint="As near as you know: 3 years, about 4 months, old.">
            {(wire) => <input {...wire} className="input" value={age} onChange={(event) => setAge(event.target.value)} maxLength={20} autoComplete="off" />}
          </Field>
        </section>
      )}

      {step === 1 && (
        <section className="step form">
          <h2 ref={heading} tabIndex={-1}>
            Where and when?
          </h2>
          <div className="form__row">
            <div data-field="district">
              <Field label="District" error={errors.district}>
                {(wire) => (
                  <select {...wire} className="input" value={district} onChange={(event) => setDistrict(event.target.value)}>
                    <option value="">Choose a district</option>
                    {DISTRICTS.map((entry) => (
                      <option key={entry} value={entry}>
                        {entry}
                      </option>
                    ))}
                  </select>
                )}
              </Field>
            </div>
            <div data-field="hood">
              <Field label="Neighbourhood" error={errors.hood}>
                {(wire) => <input {...wire} className="input" value={hood} onChange={(event) => setHood(event.target.value)} maxLength={30} autoComplete="off" />}
              </Field>
            </div>
          </div>
          <div data-field="place">
            <Field
              label={kind === 'adopt' ? 'Where they are now' : 'The exact spot'}
              hint={kind === 'adopt' ? 'In a foster home, at a café terrace, with their owner.' : 'As on a poster: near the tea garden on the shore path.'}
              error={errors.place}
            >
              {(wire) => <input {...wire} className="input" value={place} onChange={(event) => setPlace(event.target.value)} maxLength={80} autoComplete="off" />}
            </Field>
          </div>
          {kind !== 'adopt' && (
            <>
              <Choices
                legend={WHEN[kind || 'lost']}
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
                      {(wire) => <input {...wire} className="input" inputMode="numeric" value={days} onChange={(event) => setDays(event.target.value)} maxLength={3} />}
                    </Field>
                  </div>
                )}
                <div data-field="time">
                  <Field label="At about what time?" hint="Istanbul time." error={errors.time}>
                    {(wire) => <input {...wire} className="input" type="time" value={time} onChange={(event) => setTime(event.target.value)} />}
                  </Field>
                </div>
              </div>
            </>
          )}
        </section>
      )}

      {step === 2 && (
        <section className="step form">
          <h2 ref={heading} tabIndex={-1}>
            What should people look for?
          </h2>
          <div data-field="marks">
            <Field
              label="What tells them from another one like them?"
              hint={kind === 'found' ? 'Collar, tag, scar, odd eyes. Leave one mark out: it is how you will know the owner.' : 'Collar, tag, scar, odd eyes, a limp. This is the line people read.'}
              error={errors.marks}
            >
              {(wire) => <textarea {...wire} className="input" value={marks} onChange={(event) => setMarks(event.target.value)} maxLength={140} rows={3} />}
            </Field>
          </div>
          <Field label={story.label} optional hint={story.hint}>
            {(wire) => <textarea {...wire} className="input" value={text} onChange={(event) => setText(event.target.value)} maxLength={600} rows={5} />}
          </Field>

          <div className="field field--block">
            <span className="field__label" id="photo-label">
              A photograph <span className="field__opt">(optional)</span>
            </span>
            <p className="field__hint">The whole animal, in daylight, with the markings showing. It is made small in your browser before it goes anywhere.</p>
            <div className="drop">
              {photo && (
                <>
                  <div className="drop__frame" style={{ aspectRatio: `${photo.w} / ${photo.h}` }} onClick={aim}>
                    {/* eslint-disable-next-line @next/next/no-img-element -- a photograph kept in the browser has no address to resize from */}
                    <img src={photo.src} alt="The photograph you chose" />
                    <i className="drop__point" style={{ left: `${photo.fx}%`, top: `${photo.fy}%` }} aria-hidden="true" />
                  </div>
                  <p className="field__hint">Tap the face. The notice crops the photograph around that point.</p>
                </>
              )}
              <div className="acts">
                <label className="choice">
                  <input type="file" accept="image/jpeg,image/png,image/webp" aria-labelledby="photo-label" onChange={(event) => pick(event.target.files?.[0])} />
                  <span>
                    <Camera size={20} aria-hidden="true" />
                    {photo ? 'Choose another' : 'Choose a photograph'}
                  </span>
                </label>
                {photo && (
                  <button type="button" className="btn btn--quiet btn--small" onClick={() => setPhoto(null)}>
                    <Trash size={18} aria-hidden="true" />
                    Remove it
                  </button>
                )}
              </div>
            </div>
          </div>

          <div data-field="phone">
            <Field label="A phone number" optional hint="Shown on the notice and printed on the poster. Leave it empty to be reached through sightings alone." error={errors.phone}>
              {(wire) => <input {...wire} className="input" type="tel" value={phone} onChange={(event) => setPhone(event.target.value)} maxLength={20} autoComplete="tel" />}
            </Field>
          </div>

          {preview && (
            <div className="field field--block">
              <span className="field__label">How it will look on the board</span>
              <div className="preview" inert>
                <NoticeCard notice={preview} now={now} sizes="20rem" />
              </div>
            </div>
          )}
          {mode === 'local' && <p className="form__note">This demonstration has no database, so the notice will be kept in your browser and nobody else will see it.</p>}
        </section>
      )}

      <Refusal text={refused} />
      <div className="form__acts">
        {step > 0 && (
          <button type="button" className="btn btn--line" onClick={() => go(step - 1)}>
            <ArrowLeft size={18} weight="bold" aria-hidden="true" />
            Back
          </button>
        )}
        {step < 2 ? (
          <button type="submit" className="btn">
            Next
            <ArrowRight size={18} weight="bold" aria-hidden="true" />
          </button>
        ) : (
          <button type="submit" className="btn" disabled={busy} data-busy={busy ? '' : undefined}>
            {busy ? 'Putting it up' : 'Put the notice up'}
          </button>
        )}
      </div>
    </form>
  );
}
