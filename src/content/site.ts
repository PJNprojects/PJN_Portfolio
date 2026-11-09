// All the words on the site live here. Edit this file, not the components.
// Confidentiality: describe what a device does, never the specific parts inside it.

export const site = {
  name: 'Panchajanyam',
  email: 'projects.pjn@gmail.com',
  tagline: 'Idea in. Device out.',
  description:
    'Panchajanyam takes an idea to a working device: circuit board, firmware, enclosure and production.',
  nav: [
    { label: 'Work', href: '#work' },
    { label: 'Process', href: '#process' },
    { label: 'Contact', href: '#brief' },
  ],
  social: [
    { label: 'LinkedIn', href: '#' }, // fill in when the page exists
    { label: 'Instagram', href: '#' },
  ],
};

export const hero = {
  line1: 'Idea in.',
  line2: 'Device out.',
  scrollCue: 'Scroll to see one built',
  captions: [
    'A sketch first. Every part drawn before any part is bought.',
    'Then the board, the case and the counterweight, each made by us.',
    'Then it closes up and goes to the field.',
  ],
  cta: 'Tell us your idea',
};

export const work = {
  heading: 'One collar, built from scratch',
  statement:
    'Markwave asked for a reverse-engineered livestock collar. We built a new one instead, from the first schematic to the counterweight.',
  note:
    'It rides on a buffalo’s neck, watches how the animal moves, reads an implanted tag through the skin for identity and body temperature, and sends everything to a nearby gateway. A working prototype exists on our own board, in a case we designed. Field trials are next.',
  figureCaption: 'Drawn from the build. Photographs of the board and the case go here.',
  ledgerTitle: 'What’s inside',
  ledger: [
    { name: 'Motion sensing', kind: 'inertial sensor on the board', where: 'board' },
    { name: 'Identity and temperature', kind: 'low-frequency RFID, read from an implanted tag', where: 'board' },
    { name: 'Wireless', kind: 'low-energy radio to a nearby gateway', where: 'board' },
    { name: 'Power', kind: 'battery pair with a switched rail for the reader', where: 'board' },
    { name: 'Circuit board', kind: 'our own layout, grown out of separate dev boards', where: 'board' },
    { name: 'Enclosure', kind: 'CAD, then 3D-printed in PLA and ABS', where: 'case' },
    { name: 'Casting trials', kind: 'vacuum-cast samples', where: 'case' },
    { name: 'Counterweight', kind: 'metal', where: 'collar' },
    { name: 'Status', kind: 'working prototype; field trials next', where: '' },
  ],
};

export const process = {
  heading: 'How a project runs',
  intro:
    'You bring the idea. We say yes, no, or how, and we start. Budget comes second; the project comes first. The slip shows the usual path. The pace depends on the device.',
  slipTitle: 'Project slip',
  slipSub: 'Panchajanyam, for one new device',
  groups: [
    { title: 'Week one', rows: [['We talk', 'a call'], ['We write the brief', 'a page'], ['We say yes, no, or how', 'a day']] },
    { title: 'Design', rows: [['Schematic and parts list', '1–2 weeks'], ['Board layout', '1 week'], ['Firmware', 'alongside']] },
    { title: 'Prototype', rows: [['Breadboard proof', 'days'], ['First boards made and tested', '2–3 weeks'], ['Case printed to fit', 'days']] },
    { title: 'Production', rows: [['Castings or moulds', 'by quantity'], ['Counterweights and fittings', 'by quantity'], ['Parts ordered from distributors', 'by lead time']] },
  ],
  result: 'You hold a working device, and the files to make more.',
};

export const capabilities = {
  heading: 'What we do',
  items: [
    ['Circuit design', 'Schematics and part choices for sensing, radio and power.'],
    ['PCB layout', 'Boards drawn from scratch and proven on a breadboard first.'],
    ['Firmware', 'Code on the microcontroller that reads the sensors and talks over the air.'],
    ['Wireless', 'Bluetooth Low Energy, Wi‑Fi and low-frequency RFID, chosen for the power budget.'],
    ['Enclosures', 'Cases modelled around the board and 3D-printed in PLA or ABS.'],
    ['Prototyping', 'Vacuum-cast parts, metal counterweights, fit and field tests.'],
    ['Production', 'Small batches by casting now; designs prepared for injection moulding when the numbers call for it.'],
    ['Sourcing', 'Distributors we already know, so parts arrive and prices hold.'],
  ],
};

export const about = {
  heading: 'Why the name',
  // Words wrapped in [[ ]] are highlighted; the last sentence links to the brief.
  story:
    'Panchajanyam is the conch Krishna sounds to begin the battle. We took the name because starting is the hard part: most ideas never reach a workbench, and most workbenches never see a finished device. We are [[embedded engineers]] in India. Where a software team ships an app, we ship the thing you can hold: the board, the code on it, the case around it, and the plan to make more. Our first client, [[Markwave]], asked us to copy a collar. We built one [[from scratch]] instead, and along the way tested [[3D printing]], [[vacuum casting]] and metalwork, and gathered a list of [[distributors]] who pick up the phone. Budget comes second. The project comes first.',
  link: 'Tell us your idea.',
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
  send: 'Send this brief',
  hintMail: 'Opens your mail app with the brief written in.',
  hintSaved: 'Sent. We’ll write back within a few days.',
  subject: 'An idea for Panchajanyam',
};

export const footer = {
  legal: '© 2026 Panchajanyam',
};
