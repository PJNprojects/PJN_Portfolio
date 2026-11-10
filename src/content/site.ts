// Every word and every picture on the site lives here. Edit this file, not the components.
// Confidentiality: describe what a device does, never the specific parts inside it.

/** Files in public/media. Replace a file with a newer one of the same name and the site picks it up. */
const media = (file: string) => `${import.meta.env.BASE_URL}media/${file}`;

export type Picture = { src: string; srcSet: string; width: number; height: number; alt: string };

const picture = (name: string, large: number, small: number, ratio: number, alt: string): Picture => ({
  src: media(`${name}-${large}.webp`),
  srcSet: `${media(`${name}-${small}.webp`)} ${small}w, ${media(`${name}-${large}.webp`)} ${large}w`,
  width: large,
  height: Math.round(large * ratio),
  alt,
});

export const site = {
  name: 'Panchajanyam',
  email: 'projects.pjn@gmail.com',
  description:
    'Panchajanyam is an embedded engineering studio. You bring the idea. We design the circuit board, write the firmware, build the enclosure and get it made.',
  nav: [
    { label: 'Work', href: '#work' },
    { label: 'Lab', href: '#lab' },
    { label: 'Process', href: '#process' },
    { label: 'About', href: '#about' },
  ],
  cta: { label: 'Start a project', href: '#brief' },
  // Add { label: 'LinkedIn', href: 'https://…' } here when the pages exist. Empty means no links are shown.
  social: [] as { label: string; href: string }[],
};

export const hero = {
  line1: 'Idea in.',
  line2: 'Device out.',
  cta: 'Tell us your idea',
  second: 'See the collar we built for Markwave',
  sticker: 'Scroll down · Open it up · ',
  picture: picture('collar-enclosure', 1536, 900, 1024 / 1536, 'A matte black collar enclosure with two strap slots, seen from above at an angle'),
};

export const marquee = [
  'Circuit boards', 'Firmware', 'Radio', 'Enclosures', '3D printing', 'Vacuum casting', 'Sourcing', 'Production',
];

export const work = {
  heading: 'One collar, taken apart',
  intro:
    'Markwave needed a collar that tells a farmer when a buffalo is in heat or running a temperature. We built it from the first schematic to the counterweight, and it is now a working prototype in its final phase. Here is what is inside, and what each part says about us.',
  provesLabel: 'What this shows',
  steps: [
    {
      title: 'Enclosure',
      label: 'The base, straight off the printer',
      text:
        'Top and base, modelled from scratch to fit our own board, then 3D-printed. This is the base as it left the printer: strap slots, screw bosses, layer lines and all. The lid is the part you saw at the top of the page.',
      proves: ['3D design from a blank file', '3D printing in PLA and ABS', 'Vacuum-casting trials for small batches'],
      picture: picture('collar-base', 1120, 640, 1400 / 1120, 'The 3D-printed base of the collar enclosure, black, with two strap slots and four screw bosses'),
    },
    {
      title: 'Circuit board',
      label: 'Our own board, assembled',
      text:
        'Our own layout, proven on a breadboard first and then made as a board. Motion sensing, a tag reader, radio and power management share one small board that runs on batteries.',
      proves: ['Schematic and PCB layout', 'SMD soldering and rework', 'Firmware for sensing, radio and power'],
      picture: picture('collar-board', 1086, 640, 1448 / 1086, 'The collar circuit board, green, populated with surface-mount parts and four battery spring contacts'),
    },
    {
      title: 'Antenna coil',
      label: 'The reader antenna',
      text:
        'The collar reads a microchip placed under the animal’s skin, which reports identity and body temperature. This coil is the reader’s antenna: it powers the chip and listens for the answer through hide and hair.',
      proves: ['Low-frequency RFID', 'Antenna tuning', 'Bluetooth and Wi‑Fi links'],
      picture: picture('collar-coil', 1086, 640, 1448 / 1086, 'A flat wound antenna coil on a ferrite plate with two leads'),
    },
    {
      title: 'Bench test',
      label: 'The carrier on the scope',
      text:
        'Nothing leaves the bench on trust. This is the reader’s carrier on the oscilloscope, steady at 133.33 kHz. A design counts as working when the instrument agrees.',
      proves: ['Oscilloscope and signal debugging', 'Breadboard first, board second', 'Measured, then shipped'],
      picture: picture('bench-scope', 1600, 800, 900 / 1600, 'An oscilloscope screen showing a steady carrier wave measured at 133.33 kHz'),
    },
  ],
};

export const lab = {
  heading: 'Tune the antenna yourself',
  text:
    'A reader coil only reaches the chip when it resonates with the signal that drives it. Slide the capacitor until the trace swells. That is the job we do on the bench, with a real scope.',
  drive: 133.33, // kHz, as measured on the bench
  control: 'Tuning capacitor',
  less: 'Less capacitance',
  more: 'More capacitance',
  readouts: { resonance: 'Coil resonates at', drive: 'Driven at', signal: 'Signal at the chip' },
  states: {
    off: 'Off tune. The chip hears nothing.',
    near: 'Getting warmer.',
    locked: 'In tune. The chip answers.',
  },
  figure: 'The same carrier on our bench.',
  picture: work.steps[3].picture,
};

export const film = {
  heading: 'What the collar watches for',
  text:
    'A buffalo in heat moves more, ruminates less and runs slightly warmer. The collar watches all three and raises the flag only when they agree.',
  caption: 'Concept animation of the detection logic.',
  src: media('heat-detection.mp4'),
  poster: media('heat-detection-poster.webp'),
  width: 1280,
  height: 708,
  // Start time of each chapter, in seconds of the web file.
  chapters: [
    { label: 'A normal day', at: 0 },
    { label: 'Movement', at: 6.07 },
    { label: 'Temperature', at: 18.2 },
    { label: 'The decision', at: 24 },
  ],
  play: 'Play',
  pause: 'Pause',
};

export const process = {
  heading: 'How a project runs',
  intro:
    'You bring the idea. We say yes, no, or how, and we start. This is the usual path; the pace depends on the device.',
  // Timings are typical, not promises. Confirm them before launch.
  stages: [
    { verb: 'Talk', sum: 'Week one', rows: [['We talk', 'a call'], ['We write the brief', 'a page'], ['We say yes, no, or how', 'a day']] },
    { verb: 'Design', sum: 'Schematic to layout', rows: [['Schematic and parts list', '1–2 weeks'], ['Board layout', '1 week'], ['Firmware', 'alongside']] },
    { verb: 'Prototype', sum: 'Bench to hand', rows: [['Breadboard proof', 'days'], ['First boards made and tested', '2–3 weeks'], ['Case printed to fit', 'days']] },
    { verb: 'Produce', sum: 'One to many', rows: [['Castings or moulds', 'by quantity'], ['Counterweights and fittings', 'by quantity'], ['Parts ordered from distributors', 'by lead time']] },
  ],
  result: 'You hold a working device, and the files to make more.',
};

export const about = {
  heading: 'What you bring, what we bring',
  you: {
    title: 'You bring',
    items: ['The idea, even as a sketch.', 'A few hours to answer our questions.', 'The budget to build it.'],
  },
  we: {
    title: 'We bring',
    items: [
      'Electronics engineers who design the board, the code and the case.',
      'Workshop habits: breadboard, board, print, cast, test.',
      'Distributors we already know, so parts arrive and prices hold.',
    ],
  },
  // Words wrapped in [[ ]] are highlighted.
  story:
    'Panchajanyam is the conch Krishna sounds to begin the battle. We took the name because [[starting is the hard part]]: most ideas never reach a workbench, and most workbenches never see a finished device. Where a software team ships an app, we ship [[the thing you can hold]].',
};

export const brief = {
  heading: 'Tell us your idea',
  lead: 'Three taps and a line, and the page writes the brief for you. We reply with yes, no, or how.',
  haveQuestion: 'What do you have?',
  have: [
    ['An idea', 'an idea'],
    ['A sketch', 'a sketch'],
    ['A prototype', 'a working prototype'],
    ['A product to improve', 'a product to improve'],
  ],
  needQuestion: 'What do you need?',
  need: [
    ['Circuit board', 'a circuit board'],
    ['Firmware', 'firmware'],
    ['Wireless', 'wireless'],
    ['Enclosure', 'an enclosure'],
    ['Production', 'a production run'],
  ],
  lineLabel: 'In a line, what is it?',
  linePlaceholder: 'A collar that tracks a buffalo’s heat cycle',
  outLabel: 'Your brief',
  send: 'Send this brief',
  hintMail: 'Opens your mail app with the brief written in.',
  hintSaved: 'Sent. We’ll write back within a few days.',
  subject: 'An idea for Panchajanyam',
  portal: 'Client sign-in',
};

export const footer = {
  invite: 'Start with one line.',
  button: 'Write to us',
  place: 'Embedded engineering studio, India',
  legal: '© 2026 Panchajanyam',
};
