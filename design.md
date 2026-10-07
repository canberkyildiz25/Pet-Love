# Yuva: the look, and the rules behind it

I wanted a lost-pet site that looks like a public sign and not like a pet shop. The model is the notice board at a station: white enamel, blue-black lettering, a split-flap board, and a small set of colours that each mean one thing. Everything on the page follows from that.

## The one idea: four signals

A notice is in one of four states, and each has a colour that is never used for anything else.

| Signal | Colour | Token | Means |
| --- | --- | --- | --- |
| Lost | red | `--lost` | Missing now |
| Found | blue | `--found` | Somebody has the animal, or has seen it |
| Home wanted | amber | `--adopt` | Needs somewhere to live |
| Home | green | `--home` | The notice is closed |

Each signal has three tokens: the fill (`--lost`), the lettering that sits on the fill (`--on-lost`), and the same signal as lettering on the page (`--lost-ink`), which is darker in the light theme and lighter in the dark one so that it stays readable.

An element says which signal it belongs to with `data-signal="lost"`. That sets `--sig`, `--on-sig` and `--sig-ink` for it and everything inside it, so a chip, a dot, a button and an underline all pick up the right colour without knowing which notice they are in.

A colour is never the only sign. Every chip carries its word.

## Surfaces

| Token | Light | Use |
| --- | --- | --- |
| `--paper` | cool white | The page |
| `--wash` | one step down | A band, an empty photograph, a quiet panel |
| `--raised` | one step up | A field, a dialog |
| `--ink` | blue-black | Lettering, the primary button |
| `--ink-2` | grey-blue | Secondary lettering |
| `--line` | hairline | Dividers |
| `--edge` | mid grey | The edge of a control: 3 to 1 against the page |
| `--board`, `--flap`, `--flap-ink`, `--board-2` | dark | The board and the plate at the top |
| `--sheet`, `--sheet-ink` | white, black | The printed poster |

The board and the plate are dark in both themes. A sign is its own surface, and it does not change because the room did. The poster is white with black lettering in both themes, because paper is.

All colours are OKLCH and live in `app/globals.css`. Nothing else in the CSS names a colour.

## Type

One family in three widths, all Barlow, which was drawn from California's road signs and number plates.

- **Barlow Semi Condensed 700** for headings (`--font-display`). Tight leading, never italic.
- **Barlow 400, 500, 600** for reading (`--font-sans`), at 17px.
- **Barlow Condensed 600, 700** for the sign's own voice (`--font-cond`): the board, the chips, the labels, the poster's band. Always capitals, always letterspaced.

Place names are set in capitals by Turkish rules, so that Beşiktaş becomes BEŞİKTAŞ and not BEŞIKTAŞ. `upper()` in `lib/places.ts` does it; CSS `text-transform` cannot be trusted to.

## Shape

- Controls: 10px (`--r-ctl`). Chips: 6px (`--r-chip`). Photographs: 12px (`--r-photo`). Plates and dialogs: 18px (`--r-plate`).
- Nothing is a pill, and nothing has a shadow except what floats: the plate, a dialog, a toast, the poster.
- Every target a finger has to hit is at least 44px.

## The board

Seven lines. Each is a signal chip and then words of flaps: the name, the neighbourhood, how long. One line turns over every few seconds, so the whole list passes in about a minute.

- It is real text and real links. Each line carries the same words as its label for a screen reader, and the flaps themselves are hidden from it.
- It stands still when less motion is asked for, when a pointer or the keyboard focus is on it, when the tab is in the background, and when its pause button is pressed.
- It measures itself with container units and gives each flap an equal share of its width, so the lines end at the board's edge at any size. A narrow board drops the neighbourhood first.

## The poster

An A4 sheet drawn in units of its own width (`cqw`), so the same markup is the small one on the front page, the one on screen, and the print. What the animal looks like is the largest line, and the name comes after: a stranger cannot use a name. There is a "save coloured ink" version that prints the band in outline.

## Motion

- Things arrive once as they come into view: 12px up and a fade over 520ms. Nothing moves again after that.
- The board's flaps turn with a short rotation on the X axis, 140ms each, staggered along the word.
- Buttons press to 97%. Dialogs and the menu come in over 180 to 200ms with `@starting-style`.
- With reduced motion, the arrivals and the flips are off and the dialogs fade only.

## What I ruled out

Rounded cartoon pets, paw-print bullets, pastel gradients, a hero photograph of a golden retriever. The subject is somebody having the worst day of their month, and the page should look like it can be relied on.
