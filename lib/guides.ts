/* The guides. Every figure in them comes from one of the sources listed
   here, and each guide names the ones it leans on. Nothing is rounded up. */

import type { Signal } from './types';

export interface Source {
  /** How a sentence refers to it. */
  short: string;
  cite: string;
  url: string;
}

export const SOURCES = {
  huang: {
    short: 'Huang and others, 2018',
    cite: 'Huang L, Coradini M, Rand J, Morton J, Albrecht K, Wasson B, Robertson D. Search Methods Used to Locate Missing Cats and Locations Where Missing Cats Are Found. Animals, 2018; 8(1): 5.',
    url: 'https://doi.org/10.3390/ani8010005',
  },
  weiss: {
    short: 'Weiss, Slater and Lord, 2012',
    cite: 'Weiss E, Slater M, Lord L. Frequency of Lost Dogs and Cats in the United States and the Methods Used to Locate Them. Animals, 2012; 2(2): 301-315.',
    url: 'https://doi.org/10.3390/ani2020301',
  },
  lord: {
    short: 'Lord and others, 2009',
    cite: 'Lord LK, Ingwersen W, Gray JL, Wintz DJ. Characterization of animals with microchips entering animal shelters. Journal of the American Veterinary Medical Association, 2009; 235(2): 160-167.',
    url: 'https://doi.org/10.2460/javma.235.2.160',
  },
  osu: {
    short: 'Ohio State University, 2009',
    cite: 'Ohio State University. Microchips result in high rate of return of shelter animals to owners. News release on the study above, 2009.',
    url: 'https://news.osu.edu/microchips-result-in-higher-rate-of-return-of-shelter-animals-to-owners/',
  },
  marnCat: {
    short: 'Missing Animal Response Network',
    cite: 'Missing Animal Response Network. Lost Cat Behavior.',
    url: 'https://www.missinganimalresponse.com/lost-cat-behavior/',
  },
  marnDog: {
    short: 'Missing Animal Response Network',
    cite: 'Missing Animal Response Network. Lost Dog Behavior.',
    url: 'https://www.missinganimalresponse.com/lost-dog-behavior/',
  },
  marnPoster: {
    short: 'Missing Animal Response Network',
    cite: 'Missing Animal Response Network. Neon Posters.',
    url: 'https://www.missinganimalresponse.com/neon-posters/',
  },
  ftc: {
    short: 'Federal Trade Commission, 2021',
    cite: 'Puig A. The Google Voice scam: How this verification code scam works and how to avoid it. United States Federal Trade Commission, consumer alert, 29 October 2021.',
    url: 'https://consumer.ftc.gov/consumer-alerts/2021/10/google-voice-scam-how-verification-code-scam-works-and-how-avoid-it',
  },
  petfbi: {
    short: 'Pet FBI',
    cite: 'Pet FBI (Pets Found By Internet). Lost Pet Scams.',
    url: 'https://petfbi.org/lost-pet-scams/',
  },
  pasadena: {
    short: 'Pasadena Humane',
    cite: 'Pasadena Humane. What to Do if You Find a Pet.',
    url: 'https://pasadenahumane.org/what-to-do-if-you-find-a-pet/',
  },
  bianet: {
    short: 'bianet, 2017',
    cite: 'bianet. Eyüp Belediyesi’nin Küpeli Köpekleri Toplaması Meclis’e Taşındı. 27 October 2017. In Turkish.',
    url: 'https://bianet.org/haber/eyup-belediyesi-nin-kupeli-kopekleri-toplamasi-meclis-e-tasindi-191007',
  },
  cnnturk: {
    short: 'CNN Türk, 2025',
    cite: 'CNN Türk. Evcil hayvanlarda mikroçip zorunluluğunda son dönemeç. 13 December 2025. In Turkish.',
    url: 'https://www.cnnturk.com/turkiye/evcil-hayvanlarda-mikrocip-zorunlulugunda-son-donemec-2371662',
  },
} satisfies Record<string, Source>;

export type SourceKey = keyof typeof SOURCES;

export type Block =
  | { p: string }
  | { h: string }
  /** A measured number, what it measures, and where it was measured. */
  | { figure: string; says: string; from: SourceKey }
  | { list: string[]; title?: string; ordered?: boolean };

export interface Guide {
  slug: string;
  title: string;
  lede: string;
  /** The signal it belongs with, which gives it its colour. */
  signal: Signal;
  /** Who it is for, in a few words. */
  when: string;
  blocks: Block[];
  sources: SourceKey[];
}

export const GUIDES: Guide[] = [
  {
    slug: 'the-first-day',
    title: 'The first day',
    lede: 'What to do in the hours after a pet goes missing, in the order that finds most of them.',
    signal: 'lost',
    when: 'They have just gone',
    blocks: [
      {
        p: 'Most lost pets are found close to where they went missing, and most are found by somebody looking for them on foot. That is the whole plan: look near, look properly, then make it easy for a neighbour to tell you what they saw.',
      },
      {
        figure: '50 m',
        says: 'The median distance between where a missing cat got out and where it was found, in a study of 1,210 cats. Three in four were within 500 metres.',
        from: 'huang',
      },
      { h: 'Search close, and search it properly' },
      {
        p: 'Start at the door or window they left by and work outwards. Look under and inside things, not across them: beneath parked cars, in stairwells and basements, behind bins, in sheds and garages, up on ledges. In that study 83 in 100 of the cats that were found were outdoors, and about one in ten was inside somebody else’s house.',
      },
      {
        p: 'Ask neighbours to check their own gardens, sheds and garages, and ask whether you may look yourself: you know what you are looking for. Then go out again after dark with a torch. The street is quiet, and eyes shine back in the beam.',
      },
      {
        figure: '49%',
        says: 'Lost dogs that were recovered because the owner searched the neighbourhood, in a survey of 1,015 households in the United States. One in five came back on their own.',
        from: 'weiss',
      },
      { h: 'Put the notice up within the hour' },
      {
        p: 'Post a notice here, print the poster, and put it where people on foot will pass it: the door of the building, the grocer, the vet, the bus stop. A notice does the one thing a search cannot. It lets somebody you will never meet tell you where to look next.',
      },
      { h: 'Make three calls' },
      {
        list: [
          'Your own vet, and the vets nearest to where they went missing.',
          'The veterinary office of the district municipality, which runs the local animal shelter.',
          'If they are microchipped, whoever holds the registration: check that the phone number on it is the one in your pocket.',
        ],
      },
      { h: 'Keep going past the first week' },
      {
        figure: '7 days',
        says: 'A third of the missing cats in the study were found alive within seven days, and half within thirty. Few were found alive after ninety.',
        from: 'huang',
      },
      {
        p: 'More than half of the cats that were ever found were found in that first week, so spend it searching. The rest took longer. Keep the notice open, replace the posters the rain takes, and put every sighting on the notice so that the trail is in one place.',
      },
    ],
    sources: ['huang', 'weiss'],
  },
  {
    slug: 'cats-hide-dogs-travel',
    title: 'Cats hide close. Dogs travel.',
    lede: 'A frightened cat and a frightened dog do opposite things. Search for the animal you have lost.',
    signal: 'lost',
    when: 'Before you go out to look',
    blocks: [
      { h: 'An indoor cat that got out' },
      {
        figure: '39 m',
        says: 'The median distance at which indoor-only cats were found from the point they escaped. Three in four were within 137 metres.',
        from: 'huang',
      },
      {
        p: 'An indoor cat outside for the first time does not explore. It gets into the first place that feels like cover and stays there without a sound. The Missing Animal Response Network, which trains people to search for lost pets, puts it flatly: a frightened cat will hide in silence. It will not answer you, even when you are standing over it. That is fear, and it says nothing about how the cat feels about you.',
      },
      {
        p: 'So do not walk the streets calling. Search every hiding place within a few buildings of the door, on your knees, with a torch, and then search them again. Some of these cats stay put for days before they break cover: the Network’s figure is typically ten to twelve.',
      },
      { h: 'A cat that goes out, and did not come back' },
      {
        figure: '300 m',
        says: 'The median for cats that were used to going outdoors. A quarter of them were found more than 1.6 kilometres away.',
        from: 'huang',
      },
      {
        p: 'A cat that knows its way home and has not come is being kept from it: shut in a shed or a garage, hurt, chased off its ground. Widen the search to the whole neighbourhood, ask people to open closed spaces, and get posters up. Somebody has probably seen the cat without knowing it was missing.',
      },
      {
        figure: '59%',
        says: 'Lost cats that were recovered because they came home on their own, in the United States household survey. Three in ten were found by searching the neighbourhood.',
        from: 'weiss',
      },
      { h: 'A dog' },
      {
        p: 'Dogs cover ground, and how much depends mostly on temperament. The Network sorts lost dogs into three kinds. A sociable dog goes up to the first person who speaks to it and is usually picked up close to home. A wary dog avoids people at first and can be brought round with food and patience. A fearful dog runs from everybody, sometimes from its owner, travels furthest and is most at risk on the road.',
      },
      {
        p: 'For the last two, the instinct to shout the name and run towards the dog is the wrong one. The Network’s warning is that calling a dog can cause it to run from you. Stop. Crouch side-on, look away, put food down, and let the dog close the distance. If you saw it and could not hold it, the place and the time are worth more than the chase: report the sighting.',
      },
    ],
    sources: ['huang', 'marnCat', 'marnDog', 'weiss'],
  },
  {
    slug: 'a-poster-that-gets-read',
    title: 'A poster that gets read',
    lede: 'People pass a poster in a few seconds. What they can take in during those seconds is what it is for.',
    signal: 'lost',
    when: 'Before you print',
    blocks: [
      {
        p: 'The Missing Animal Response Network teaches a rule for posters at junctions, where the reader is in a car: five words, in five seconds. Its example is LOST DOG, YELLOW LAB. Everything else on the sheet is for somebody who has already stopped.',
      },
      { h: 'Lead with the look' },
      {
        p: 'A stranger cannot use a name. They can use brindle, red collar, white patch. The poster this site prints puts the signal word at the top, the photograph under it, and then what the animal looks like in the largest type on the sheet. The name comes after.',
      },
      {
        p: 'Choose a photograph that shows the whole animal and its markings in daylight. The favourite photograph is often the wrong one: asleep, half out of frame, or lit by a phone.',
      },
      { h: 'What goes on, and what stays off' },
      {
        title: 'On the sheet',
        list: [
          'LOST or FOUND, large enough to read from across the road.',
          'One clear photograph.',
          'Colour, size, and the mark that tells this animal from another one like it.',
          'Where and when.',
          'A phone number that will be answered.',
        ],
      },
      {
        title: 'Off it',
        list: [
          'Your address.',
          'The word REWARD. The Network’s advice is to leave it off: it puts off people who would have helped for nothing.',
          'One identifying mark. Hold it back, so that you can tell a true call from a false one.',
        ],
      },
      { h: 'Where they go' },
      {
        p: 'Start where the animal was last seen and work outwards along the routes people walk: building doors, bus and ferry stops, the grocer, the bakery, the vet, the park gate. Ask before you tape one to a shop window. A shopkeeper who agreed to it will also keep an eye out.',
      },
      {
        p: 'An A4 sheet cannot be read from a car. For a busy junction the Network’s answer is a sheet of fluorescent card about 70 by 55 centimetres, with two lines of black letters some 12 centimetres tall, fixed as far above head height as you can reach.',
      },
      { h: 'Take them down' },
      {
        p: 'When the animal is home, close the notice and collect the posters. A street of old posters teaches people to stop reading them.',
      },
    ],
    sources: ['marnPoster'],
  },
  {
    slug: 'you-found-an-animal',
    title: 'You found an animal',
    lede: 'Is it lost, or does it live here? And if it is lost, how do you reach the person looking for it?',
    signal: 'found',
    when: 'There is a cat in your stairwell',
    blocks: [
      { h: 'First: is it lost at all?' },
      {
        p: 'Istanbul’s streets are home to a great many cats and dogs that belong to a neighbourhood and to nobody in particular. A healthy, calm cat sitting on a wall is very probably where it means to be. Pasadena Humane, a shelter in California, tells finders the same about its own streets: a cat that appears friendly and healthy probably is not lost.',
      },
      {
        title: 'It probably lives on the street if',
        list: [
          'A cat has a tipped ear: the tip of one ear cut straight across. It is done when a street cat is neutered, so that nobody catches the same cat twice.',
          'A dog has a tag in its ear. For years municipalities here neutered and vaccinated street dogs, tagged an ear and put them back.',
          'It knows the street: it has a spot, a feeder and a route.',
        ],
      },
      {
        title: 'It is probably somebody’s if',
        list: [
          'It wears a collar or a harness, or has the mark where one has been.',
          'It is in the wrong kind of place, such as a stairwell, a car park or a bus stop, and it is crying or frozen.',
          'It walks up to you, or straight into a carrier.',
        ],
      },
      { h: 'Look for a name' },
      {
        p: 'Check the collar for a tag. Then take the animal to a vet and ask for it to be scanned for a microchip, which takes seconds. In Turkey owned cats, dogs and ferrets have to be chipped and registered, and the deadline for animals over six months old was 31 December 2025.',
      },
      { h: 'Put up a found notice' },
      {
        p: 'Post it here with a clear photograph, the place and the time. Leave one thing out: a mark, the colour of the collar, what was on the tag. Whoever claims the animal should be able to tell you what it is.',
      },
      {
        p: 'A notice is worth posting even if you cannot take the animal in. A place and a time are what a searching owner needs most.',
      },
      { h: 'When somebody calls' },
      {
        list: [
          'Ask for the detail you held back, or for a photograph of them with the animal.',
          'Meet somewhere public, and take somebody with you.',
          'Do not ask for money, and do not hand an animal over for money.',
        ],
      },
    ],
    sources: ['pasadena', 'bianet', 'cnnturk', 'petfbi'],
  },
  {
    slug: 'chips-and-tags',
    title: 'A chip is only as good as its phone number',
    lede: 'A microchip brings pets home at many times the usual rate. When it fails, the reason is usually a number nobody answers.',
    signal: 'home',
    when: 'Before anything goes wrong',
    blocks: [
      {
        figure: '20×',
        says: 'How much more often microchipped stray cats went back to their owners than stray cats as a whole, across 53 shelters in the United States. For dogs it was two and a half times.',
        from: 'osu',
      },
      {
        p: 'A chip is a number, read by a scanner held over the animal’s shoulders. It does nothing by itself. The number has to be in a register, with a phone number beside it that still works.',
      },
      {
        figure: '35%',
        says: 'Of the microchipped animals whose owners could not be found, the share where the reason was a wrong or disconnected phone number. It was the commonest reason.',
        from: 'lord',
      },
      {
        p: 'In the same study the shelters reached the owner of nearly three in four chipped animals. The failures were paperwork: a number that had changed, an owner who did not call back, a chip that was never registered or was registered somewhere nobody thought to look.',
      },
      { h: 'In Turkey' },
      {
        p: 'Owned cats, dogs and ferrets have to be microchipped by a vet and entered in PETVET, the pet register of the Ministry of Agriculture and Forestry, under the Animal Protection Law, number 5199. The deadline for animals over six months old was 31 December 2025. When you move or change your number, ask your vet to bring the record up to date.',
      },
      { h: 'A tag still does the quick work' },
      {
        p: 'A chip needs a vet and a scanner. A tag needs a neighbour who can read. In the United States household survey, 15 in 100 of the dogs that were recovered came back because somebody read a tag or a chip. For cats it was 2 in 100, and only a quarter of the cats had a tag at all.',
      },
    ],
    sources: ['lord', 'osu', 'weiss', 'cnnturk'],
  },
  {
    slug: 'the-call-that-is-not-about-your-pet',
    title: 'The call that is not about your pet',
    lede: 'A lost notice has a phone number on it, and some of the people who ring it have never seen your animal.',
    signal: 'adopt',
    when: 'Your number is on a poster',
    blocks: [
      {
        p: 'Almost everybody who rings about a notice is trying to help. A few are working from a script, and the scripts are well known.',
      },
      { h: 'The code' },
      {
        p: 'Somebody says they have your pet. To be sure you are the owner, they will send a six-digit code to your phone for you to read back. The code is the verification for an account being opened in your number’s name. The United States Federal Trade Commission names posts about lost pets as a place these callers find numbers, and its advice has no exceptions: do not share a verification code with somebody who contacted you first.',
      },
      { h: 'The fee' },
      {
        p: 'The animal is found, the caller says, but there is something to pay first: a vet’s bill because it was hurt, a transport cost because it is in another city, a release fee because they are a shelter. Pet FBI, a non-profit register of lost and found pets, lists all three, along with detectives who guarantee a result for money up front.',
      },
      { h: 'What to do instead' },
      {
        list: [
          'Ask for something only a person looking at the animal could know: the mark you kept off the poster.',
          'Ask for a photograph taken now, and be wary of one that could be any animal of that colour.',
          'Pay nothing before the animal is in front of you.',
          'Meet in a public place, and take somebody with you.',
        ],
      },
      {
        p: 'None of this is a reason to leave the number off. A notice nobody can answer finds nothing.',
      },
    ],
    sources: ['ftc', 'petfbi'],
  },
];

export const guideBySlug = (slug: string) => GUIDES.find((guide) => guide.slug === slug);

/** Roughly how long a guide takes to read, at 220 words a minute. */
export function minutes(guide: Guide) {
  const words = guide.blocks
    .flatMap((block) => ('p' in block ? [block.p] : 'h' in block ? [block.h] : 'figure' in block ? [block.says] : block.list))
    .join(' ')
    .split(/\s+/).length;
  return Math.max(1, Math.round(words / 220));
}
