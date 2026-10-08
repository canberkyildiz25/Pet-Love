# Yuva: the look, and the rules behind it

I wanted a lost-pet site that a stranger would stop and read. The model is a large-format magazine: one film, photographs given room, a quiet serif, a great deal of white, and a single colour. The subject is somebody having the worst day of their month. The page should feel calm and sure of itself, not busy and not cute.

## The one colour

Red, and nothing else. It is the red of a collar and of the word LOST on a street poster.

| Token | Use |
| --- | --- |
| `--red` | A fill: the back cover, the poster's band, the button that reports a sighting, a primary button under the pointer |
| `--on-red` | Lettering on that fill |
| `--red-ink` | The same red as lettering on the page, lighter in the dark theme so that it stays readable |

Only a lost notice is given the colour. Found, home wanted and home say what they are in words, in ink. An element says which kind it belongs to with `data-signal`; that sets `--sig`, `--on-sig` and `--sig-ink`, which are red for `lost` and ink for the rest. Colour is never the only sign: every notice carries its word.

## Surfaces

| Token | Light | Use |
| --- | --- | --- |
| `--paper` | gallery white | The page |
| `--wash` | one step down | A band, an empty photograph, a quiet panel |
| `--raised` | one step up | A field, a dialog |
| `--ink` | near black | Lettering, the primary button |
| `--ink-2` | grey | Secondary lettering |
| `--line` | hairline | The few rules there are |
| `--edge` | mid grey | The edge of a control (3 to 1 against the page), and a name in the index that is not being looked at |
| `--on-film`, `--film-shade` | white, near black | Lettering over the film, and the shade laid under it |
| `--sheet`, `--sheet-ink` | white, black | The printed poster, in both themes |

All colours are OKLCH and are named once, in `app/globals.css` (one more, a hairline for the back cover, at the top of `app/styles/chrome.css`). Nothing else in the CSS names a colour. There is a dark theme; it follows the system until the visitor chooses, and the back cover stays red in both.

## Type

Two families.

- **Cormorant Garamond 500** for every heading (`--font-display`): a Garamond drawn for large sizes. Always upright, set tight, with lining figures. It is also the sentence under the cover, the names in the index, and the large figures in the guides.
- **Hanken Grotesk 400, 500, 600** for everything that is read or pressed (`--font-sans`), at 17px. Weight 800 is loaded for the poster alone.

The scale is in tokens: `--t-mega` (the cover), `--t-h1`, `--t-h2`, `--t-h3`, `--t-say` (the sentence), `--t-lede`. Small capitals with letterspacing are kept for the name of a fact beside the fact (`.label`) and the kind of a notice (`.chip`). They are not put over section headings.

Place names are set in capitals by Turkish rules, so that Beşiktaş becomes BEŞİKTAŞ and not BEŞIKTAŞ. `upper()` in `lib/places.ts` does it; CSS `text-transform` cannot be trusted to.

## Shape and space

- Every corner is square: photographs, buttons, fields, dialogs.
- There are no cards and almost no rules. Things are separated by space; `--air` is the distance between one part of a page and the next.
- Nothing has a shadow except what lies over the page: the poster, a dialog, and a message at the foot of the screen.
- On a wide page a heading starts at the left edge and long text starts a quarter of the way in.
- Every target a finger has to hit is at least 44px.

## The front page

1. **The cover.** A short film of a cat in a collar on a pavement. She looks away, then looks straight at you; the film plays once and holds there. The headline stands in the left of the frame, which is why the frame is set wider than the window. There is a button to pause it and to play it again. Under the film is a photograph of its first frame, so the page is whole before the film arrives. A phone gets an upright cut.
2. **One sentence** that says what the site is and counts what is on the board, each count a link.
3. **The index.** The eight newest open notices as names set large, beside one photograph that changes to whichever name is under the pointer or nearest the middle of the window. An animal nobody has named is described a size down. On a phone every name carries its own small photograph.
4. **One finding** from the guides, with a whole photograph and its source.
5. **The poster**, as the sheet it prints.
6. **Home again**: the closed notices as prints of different sizes.
7. **The guides**, as a contents page.
8. **The back cover**: red, one line, one button, and the small print.

## The masthead

The name in the middle, the three kinds of notice with their counts to one side, signing in and posting on the other. Over the film it is lettering only; once the film has gone by it becomes a bar. On a narrow screen the links move into a full-screen menu set in the serif.

## The poster

An A4 sheet drawn in units of its own width (`cqw`), so the same markup is the small one on the front page, the one on screen, and the print. It is the one place the plain face is used heavy and large, because it has to be read from across a street. What the animal looks like is the largest line, and the name comes after: a stranger cannot use a name. There is a "save coloured ink" version that prints the band in outline.

## Motion

Slow, and little of it.

- **Arriving.** Text comes up 28px and fades in over a second, once. A photograph is uncovered from its foot while it settles from 114% to its own size.
- **The cover.** Each line of the headline comes up into its slot. As the page moves on, the film falls behind and the lettering fades first.
- **The sentence** takes its ink word by word as it comes up the window.
- **The index.** The photograph cross-fades; the name being looked at takes full ink and steps forward.
- **The finding's photograph** is taller than its window and passes behind it.
- **Between pages**, the old page fades as the new one arrives, and a notice's photograph travels from its card to its page. It takes under 400ms, because the new page cannot be pressed until it has arrived.
- **The wheel.** A mouse wheel is given some weight, so a turn of it carries the page and lets it settle. Touch scrolling is left alone.
- Controls answer in 160 to 200ms. Buttons press to 98%.

The scroll-linked parts use CSS scroll timelines and are extra: a browser without them shows the same page standing still. With reduced motion nothing arrives, the film does not start (its last frame is shown, and it can still be played), and the wheel is the browser's own.

Two curves: `--ease-out` for a control answering a hand, `--ease-slow` for something arriving.

## What I ruled out

Rounded cartoon pets, paw-print bullets, pastel gradients, badges on photographs, a row of three identical boxes, a small capital label over every heading, and more than one colour.
